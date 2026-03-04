'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Eye,
  Clock,
  User,
  MapPin,
  Activity,
  Zap,
  Shield,
  AlertCircle
} from 'lucide-react';
import { PresenceNotification, Resident, Room } from '@/types/presence';

interface NotificationSystemProps {
  notifications: PresenceNotification[];
  residents: Resident[];
  rooms: Room[];
  onAcknowledge?: (notificationId: string, acknowledgedBy: string) => void;
  maxVisible?: number;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  residents,
  rooms,
  onAcknowledge,
  maxVisible = 10
}) => {
  const [showAll, setShowAll] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const getResident = (residentId?: string) => {
    return residentId ? residents.find(r => r.id === residentId) : null;
  };

  const getRoom = (roomId?: string) => {
    return roomId ? rooms.find(r => r.id === roomId) : null;
  };

  const getNotificationIcon = (type: PresenceNotification['type']) => {
    switch (type) {
      case 'room_entry':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'room_exit':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'no_movement':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'unusual_activity':
        return <Activity className="w-4 h-4 text-orange-500" />;
      case 'fall_detected':
        return <Zap className="w-4 h-4 text-red-500" />;
      case 'system_alert':
        return <Shield className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: PresenceNotification['priority']) => {
    switch (priority) {
      case 'low':
        return 'border-gray-200 bg-gray-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'high':
        return 'border-orange-200 bg-orange-50';
      case 'critical':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadgeVariant = (priority: PresenceNotification['priority']) => {
    switch (priority) {
      case 'low':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'high':
        return 'destructive';
      case 'critical':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterPriority === 'all') return true;
    return notification.priority === filterPriority;
  });

  const displayNotifications = showAll 
    ? filteredNotifications 
    : filteredNotifications.slice(0, maxVisible);

  const unacknowledgedCount = notifications.filter(n => !n.acknowledged).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.acknowledged).length;

  // Play sound for new critical notifications
  useEffect(() => {
    if (soundEnabled && criticalCount > 0) {
      // In a real implementation, you would play an actual sound
      console.log('🔔 Critical notification sound would play here');
    }
  }, [criticalCount, soundEnabled]);

  const handleAcknowledge = (notificationId: string) => {
    if (onAcknowledge) {
      onAcknowledge(notificationId, 'Caregiver');
    }
  };

  const handleAcknowledgeAll = () => {
    if (onAcknowledge) {
      const unacknowledged = notifications.filter(n => !n.acknowledged);
      unacknowledged.forEach(n => {
        onAcknowledge(n.id, 'Caregiver');
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Notification Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unacknowledgedCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs text-white font-bold">
                      {unacknowledgedCount > 99 ? '99+' : unacknowledgedCount}
                    </span>
                  </motion.div>
                )}
              </div>
              <span>Notifications & Alerts</span>
              {criticalCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {criticalCount} Critical
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={soundEnabled ? 'text-green-600' : 'text-gray-400'}
              >
                <BellRing className="w-4 h-4" />
              </Button>
              
              {unacknowledgedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcknowledgeAll}
                >
                  Acknowledge All
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-gray-600">Filter:</span>
            <div className="flex space-x-2">
              {['all', 'critical', 'high', 'medium', 'low'].map(priority => (
                <Button
                  key={priority}
                  variant={filterPriority === priority ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterPriority(priority)}
                  className="text-xs"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Notification List */}
          <ScrollArea className="h-96">
            <div className="space-y-3">
              <AnimatePresence>
                {displayNotifications.map((notification) => {
                  const resident = getResident(notification.residentId);
                  const room = getRoom(notification.roomId);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`border rounded-lg p-4 ${getPriorityColor(notification.priority)} ${
                        notification.acknowledged ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{notification.title}</span>
                              <Badge 
                                variant={getPriorityBadgeVariant(notification.priority)}
                                className="text-xs"
                              >
                                {notification.priority}
                              </Badge>
                              {notification.acknowledged && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Acknowledged
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(notification.timestamp)}</span>
                              </div>
                              
                              {resident && (
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{resident.name}</span>
                                </div>
                              )}
                              
                              {room && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{room.name}</span>
                                </div>
                              )}
                              
                              {notification.acknowledgedBy && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>by {notification.acknowledgedBy}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.acknowledged && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAcknowledge(notification.id)}
                              className="text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {displayNotifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                  <p className="text-sm">All caught up!</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Show More/Less */}
          {filteredNotifications.length > maxVisible && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `Show All (${filteredNotifications.length})`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">WebSocket: Connected</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Sensors: Active</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">AI Processing: Running</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Database: Synced</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Update:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Active Residents:</span>
              <span>{residents.filter(r => r.status === 'active').length}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Active Alerts:</span>
              <span className={criticalCount > 0 ? 'text-red-600 font-medium' : ''}>
                {criticalCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;