'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  WebSocketPresenceMessage, 
  PresenceEvent, 
  Resident, 
  Room, 
  MovementPath,
  PresenceNotification,
  PresenceStats 
} from '@/types/presence';

interface UsePresenceDetectionReturn {
  isConnected: boolean;
  residents: Resident[];
  rooms: Room[];
  events: PresenceEvent[];
  notifications: PresenceNotification[];
  currentPaths: MovementPath[];
  stats: PresenceStats | null;
  acknowledgeNotification: (notificationId: string, acknowledgedBy: string) => void;
  triggerManualScan: () => void;
}

export const usePresenceDetection = (): UsePresenceDetectionReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<PresenceEvent[]>([]);
  const [notifications, setNotifications] = useState<PresenceNotification[]>([]);
  const [currentPaths, setCurrentPaths] = useState<MovementPath[]>([]);
  const [stats, setStats] = useState<PresenceStats | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Presence detection connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Request initial data
      socket.emit('get_presence_data');
    });

    socket.on('disconnect', () => {
      console.log('Presence detection disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Presence detection connection error:', error);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    // Handle real-time presence updates
    socket.on('presence_update', (message: WebSocketPresenceMessage) => {
      if (message.data.resident) {
        setResidents(prev => {
          const existing = prev.find(r => r.id === message.data.resident!.id);
          if (existing) {
            return prev.map(r => r.id === message.data.resident!.id ? message.data.resident! : r);
          } else {
            return [...prev, message.data.resident!];
          }
        });
      }
    });

    // Handle movement detection events
    socket.on('movement_detected', (message: WebSocketPresenceMessage) => {
      if (message.data.event) {
        setEvents(prev => [message.data.event!, ...prev.slice(0, 99)]); // Keep last 100 events
      }
      
      if (message.data.path) {
        setCurrentPaths(prev => {
          const existing = prev.find(p => p.id === message.data.path!.id);
          if (existing) {
            return prev.map(p => p.id === message.data.path!.id ? message.data.path! : p);
          } else {
            return [...prev, message.data.path!];
          }
        });
      }
    });

    // Handle room status changes
    socket.on('room_status_change', (message: WebSocketPresenceMessage) => {
      if (message.data.room) {
        setRooms(prev => {
          const existing = prev.find(r => r.id === message.data.room!.id);
          if (existing) {
            return prev.map(r => r.id === message.data.room!.id ? message.data.room! : r);
          } else {
            return [...prev, message.data.room!];
          }
        });
      }
    });

    // Handle notifications
    socket.on('notification', (message: WebSocketPresenceMessage) => {
      if (message.data.notification) {
        setNotifications(prev => [message.data.notification!, ...prev.slice(0, 49)]); // Keep last 50 notifications
      }
    });

    // Handle stats updates
    socket.on('stats_update', (message: WebSocketPresenceMessage) => {
      if (message.data.stats) {
        setStats(message.data.stats);
      }
    });

    // Handle initial data response
    socket.on('presence_data_response', (data: {
      residents: Resident[];
      rooms: Room[];
      events: PresenceEvent[];
      notifications: PresenceNotification[];
      paths: MovementPath[];
      stats: PresenceStats;
    }) => {
      setResidents(data.residents);
      setRooms(data.rooms);
      setEvents(data.events);
      setNotifications(data.notifications);
      setCurrentPaths(data.paths);
      setStats(data.stats);
    });

  }, []);

  const acknowledgeNotification = useCallback((notificationId: string, acknowledgedBy: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('acknowledge_notification', {
        notificationId,
        acknowledgedBy,
        timestamp: new Date()
      });
      
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, acknowledged: true, acknowledgedBy, acknowledgedAt: new Date() }
            : n
        )
      );
    }
  }, []);

  const triggerManualScan = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('trigger_scan');
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  // Auto-reconnect logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected && reconnectAttempts.current < maxReconnectAttempts) {
        connect();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, connect]);

  return {
    isConnected,
    residents,
    rooms,
    events,
    notifications,
    currentPaths,
    stats,
    acknowledgeNotification,
    triggerManualScan
  };
};