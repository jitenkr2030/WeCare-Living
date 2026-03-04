'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Activity, 
  Bell, 
  MapPin, 
  Clock,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

import { usePresenceDetection } from '@/hooks/usePresenceDetection';
import RoomVisualization from '@/components/presence/RoomVisualization';
import MovementPathTracking from '@/components/presence/MovementPathTracking';
import MovementTimeline from '@/components/presence/MovementTimeline';
import OccupancyHeatmap from '@/components/presence/OccupancyHeatmap';
import NotificationSystem from '@/components/presence/NotificationSystem';
import { Room, Resident, PresenceEvent } from '@/types/presence';

const PresenceDashboard: React.FC = () => {
  const {
    isConnected,
    residents,
    rooms,
    events,
    notifications,
    currentPaths,
    stats,
    acknowledgeNotification,
    triggerManualScan
  } = usePresenceDetection();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate mock data for demonstration
  useEffect(() => {
    if (!isConnected && (rooms.length === 0 || residents.length === 0)) {
      generateMockData();
    }
  }, [isConnected, rooms.length, residents.length]);

  const generateMockData = () => {
    // Mock rooms data
    const mockRooms: Room[] = [
      {
        id: 'bedroom-1',
        name: 'Master Bedroom',
        type: 'bedroom',
        coordinates: { x: 0, y: 0, width: 100, height: 100 },
        currentOccupancy: 1,
        maxOccupancy: 2,
        lastOccupied: new Date(Date.now() - 5 * 60 * 1000),
        sensors: ['wifi-1', 'motion-1']
      },
      {
        id: 'bathroom-1',
        name: 'Main Bathroom',
        type: 'bathroom',
        coordinates: { x: 100, y: 0, width: 60, height: 80 },
        currentOccupancy: 0,
        maxOccupancy: 1,
        lastOccupied: new Date(Date.now() - 30 * 60 * 1000),
        sensors: ['wifi-2', 'motion-2']
      },
      {
        id: 'kitchen-1',
        name: 'Kitchen',
        type: 'kitchen',
        coordinates: { x: 0, y: 100, width: 120, height: 90 },
        currentOccupancy: 1,
        maxOccupancy: 3,
        lastOccupied: new Date(Date.now() - 2 * 60 * 1000),
        sensors: ['wifi-3', 'motion-3']
      },
      {
        id: 'living-room-1',
        name: 'Living Room',
        type: 'living_room',
        coordinates: { x: 120, y: 100, width: 140, height: 110 },
        currentOccupancy: 0,
        maxOccupancy: 4,
        lastOccupied: new Date(Date.now() - 15 * 60 * 1000),
        sensors: ['wifi-4', 'motion-4']
      },
      {
        id: 'hallway-1',
        name: 'Main Hallway',
        type: 'hallway',
        coordinates: { x: 60, y: 80, width: 60, height: 120 },
        currentOccupancy: 0,
        maxOccupancy: 2,
        lastOccupied: new Date(Date.now() - 1 * 60 * 1000),
        sensors: ['wifi-5', 'motion-5']
      }
    ];

    // Mock residents data
    const mockResidents: Resident[] = [
      {
        id: 'resident-1',
        name: 'John Smith',
        roomId: 'bedroom-1',
        roomName: 'Master Bedroom',
        lastSeen: new Date(),
        status: 'resting',
        movementLevel: 'low',
        riskLevel: 'normal'
      },
      {
        id: 'resident-2',
        name: 'Mary Johnson',
        roomId: 'kitchen-1',
        roomName: 'Kitchen',
        lastSeen: new Date(),
        status: 'active',
        movementLevel: 'medium',
        riskLevel: 'caution'
      }
    ];

    // In a real implementation, these would come from the WebSocket
    // For now, we'll update the state through mock data
    console.log('Mock data generated:', { mockRooms, mockResidents });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      triggerManualScan();
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsRefreshing(false);
    }
  };

  const getActiveResidents = () => residents.filter(r => r.status === 'active');
  const getHighRiskResidents = () => residents.filter(r => 
    r.riskLevel === 'warning' || r.riskLevel === 'critical'
  );
  const getOccupiedRooms = () => rooms.filter(r => r.currentOccupancy > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WeCare Living</h1>
            <p className="text-gray-600 mt-1">Real-time Presence Detection & Monitoring</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Residents</p>
                  <p className="text-2xl font-bold">{residents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Now</p>
                  <p className="text-2xl font-bold">{getActiveResidents().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Home className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Occupied Rooms</p>
                  <p className="text-2xl font-bold">{getOccupiedRooms().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold">{getHighRiskResidents().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Rooms</span>
          </TabsTrigger>
          <TabsTrigger value="movement" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Movement</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Alerts</span>
            {notifications.filter(n => !n.acknowledged).length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {notifications.filter(n => !n.acknowledged).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Room Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RoomVisualization 
                  rooms={rooms} 
                  residents={residents}
                  onRoomClick={setSelectedRoom}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Active Movement Paths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MovementPathTracking 
                  paths={currentPaths}
                  residents={residents}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Room Visualization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RoomVisualization 
                rooms={rooms} 
                residents={residents}
                onRoomClick={setSelectedRoom}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement">
          <MovementPathTracking 
            paths={currentPaths}
            residents={residents}
          />
        </TabsContent>

        <TabsContent value="timeline">
          <MovementTimeline 
            events={events}
            residents={residents}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <OccupancyHeatmap 
            rooms={rooms}
            occupancyData={[]} // Will use mock data
          />
        </TabsContent>

        <TabsContent value="alerts">
          <NotificationSystem 
            notifications={notifications}
            residents={residents}
            rooms={rooms}
            onAcknowledge={acknowledgeNotification}
          />
        </TabsContent>
      </Tabs>

      {/* Selected Room Modal */}
      {selectedRoom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedRoom(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedRoom.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRoom(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{selectedRoom.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupancy:</span>
                <span className="font-medium">
                  {selectedRoom.currentOccupancy}/{selectedRoom.maxOccupancy}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sensors:</span>
                <span className="font-medium">{selectedRoom.sensors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Occupied:</span>
                <span className="font-medium">
                  {selectedRoom.lastOccupied?.toLocaleString() || 'Never'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PresenceDashboard;