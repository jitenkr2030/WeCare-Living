'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Activity, 
  Users, 
  Bed, 
  Bath, 
  Sofa, 
  Utensils, 
  DoorOpen, 
  Thermometer, 
  Wifi, 
  WifiOff, 
  Eye, 
  EyeOff, 
  Settings, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Download, 
  Filter, 
  Maximize2, 
  Minimize2,
  Wind,
  Sun,
  Moon,
  Shield,
  Bell,
  Camera,
  CameraOff
} from 'lucide-react';

// Import types
import { Resident } from '@/types/presence';

interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living_room' | 'dining_room' | 'hallway' | 'office' | 'storage';
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  currentOccupancy: number;
  maxOccupancy: number;
  lastOccupied: Date;
  sensors: string[];
  motionLevel: 'none' | 'low' | 'medium' | 'high';
  temperature: number;
  humidity: number;
  airQuality: 'good' | 'moderate' | 'poor';
  lightLevel: number;
  noiseLevel: number;
  privacyLevel: 'public' | 'private' | 'restricted';
  lastMotion: Date;
  motionHistory: {
    timestamp: Date;
    level: 'none' | 'low' | 'medium' | 'high';
    duration: number;
  }[];
  alerts: {
    type: 'motion' | 'temperature' | 'humidity' | 'air_quality' | 'privacy' | 'occupancy';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
    acknowledged: boolean;
  }[];
}

interface MotionZone {
  id: string;
  name: string;
  roomId: string;
  type: 'entry' | 'exit' | 'bed' | 'desk' | 'chair' | 'door' | 'window' | 'general';
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sensitivity: number;
  isActive: boolean;
  lastTriggered: Date;
  triggerCount: number;
  threshold: {
    motion: number;
    duration: number;
  };
}

interface RoomVisualizationProps {
  residents: Resident[];
}

const RoomVisualization: React.FC<RoomVisualizationProps> = ({ residents }) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [showMotionHistory, setShowMotionHistory] = useState(false);
  const [showPrivacyZones, setShowPrivacyZones] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [motionThreshold, setMotionThreshold] = useState([50]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Generate mock rooms
  const rooms: Room[] = useMemo(() => [
    {
      id: 'bedroom-1',
      name: 'Master Bedroom',
      type: 'bedroom',
      coordinates: { x: 50, y: 50, width: 200, height: 180 },
      currentOccupancy: 1,
      maxOccupancy: 2,
      lastOccupied: new Date(Date.now() - 5 * 60 * 1000),
      sensors: ['wifi-1', 'motion-1', 'temp-1'],
      motionLevel: 'low',
      temperature: 22.5,
      humidity: 45,
      airQuality: 'good',
      lightLevel: 80,
      noiseLevel: 35,
      privacyLevel: 'private',
      lastMotion: new Date(Date.now() - 2 * 60 * 1000),
      motionHistory: [
        { timestamp: new Date(Date.now() - 10 * 60 * 1000), level: 'medium', duration: 300 },
        { timestamp: new Date(Date.now() - 30 * 60 * 1000), level: 'low', duration: 180 },
        { timestamp: new Date(Date.now() - 60 * 60 * 1000), level: 'high', duration: 120 }
      ],
      alerts: [
        {
          type: 'motion',
          severity: 'low',
          message: 'Unusual nighttime activity detected',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          acknowledged: true
        }
      ]
    },
    {
      id: 'bathroom-1',
      name: 'Main Bathroom',
      type: 'bathroom',
      coordinates: { x: 300, y: 50, width: 120, height: 100 },
      currentOccupancy: 0,
      maxOccupancy: 1,
      lastOccupied: new Date(Date.now() - 30 * 60 * 1000),
      sensors: ['wifi-2', 'motion-2', 'humidity-1'],
      motionLevel: 'none',
      temperature: 23.0,
      humidity: 65,
      airQuality: 'moderate',
      lightLevel: 100,
      noiseLevel: 45,
      privacyLevel: 'restricted',
      lastMotion: new Date(Date.now() - 30 * 60 * 1000),
      motionHistory: [
        { timestamp: new Date(Date.now() - 45 * 60 * 1000), level: 'high', duration: 600 },
        { timestamp: new Date(Date.now() - 90 * 60 * 1000), level: 'medium', duration: 300 }
      ],
      alerts: [
        {
          type: 'humidity',
          severity: 'medium',
          message: 'High humidity level detected',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          acknowledged: false
        }
      ]
    },
    {
      id: 'kitchen-1',
      name: 'Kitchen',
      type: 'kitchen',
      coordinates: { x: 50, y: 280, width: 180, height: 150 },
      currentOccupancy: 1,
      maxOccupancy: 4,
      lastOccupied: new Date(Date.now() - 3 * 60 * 1000),
      sensors: ['wifi-3', 'motion-3', 'temp-2'],
      motionLevel: 'medium',
      temperature: 21.8,
      humidity: 40,
      airQuality: 'good',
      lightLevel: 90,
      noiseLevel: 55,
      privacyLevel: 'public',
      lastMotion: new Date(Date.now() - 1 * 60 * 1000),
      motionHistory: [
        { timestamp: new Date(Date.now() - 5 * 60 * 1000), level: 'high', duration: 180 },
        { timestamp: new Date(Date.now() - 20 * 60 * 1000), level: 'medium', duration: 240 }
      ],
      alerts: []
    },
    {
      id: 'living-room-1',
      name: 'Living Room',
      type: 'living_room',
      coordinates: { x: 280, y: 280, width: 220, height: 180 },
      currentOccupancy: 2,
      maxOccupancy: 6,
      lastOccupied: new Date(Date.now() - 1 * 60 * 1000),
      sensors: ['wifi-4', 'motion-4', 'temp-3'],
      motionLevel: 'high',
      temperature: 22.2,
      humidity: 42,
      airQuality: 'good',
      lightLevel: 75,
      noiseLevel: 40,
      privacyLevel: 'public',
      lastMotion: new Date(Date.now() - 30 * 1000),
      motionHistory: [
        { timestamp: new Date(Date.now() - 2 * 60 * 1000), level: 'high', duration: 300 },
        { timestamp: new Date(Date.now() - 10 * 60 * 1000), level: 'medium', duration: 420 }
      ],
      alerts: []
    },
    {
      id: 'hallway-1',
      name: 'Main Hallway',
      type: 'hallway',
      coordinates: { x: 230, y: 180, width: 60, height: 200 },
      currentOccupancy: 0,
      maxOccupancy: 3,
      lastOccupied: new Date(Date.now() - 5 * 60 * 1000),
      sensors: ['wifi-5', 'motion-5'],
      motionLevel: 'low',
      temperature: 22.0,
      humidity: 43,
      airQuality: 'good',
      lightLevel: 60,
      noiseLevel: 30,
      privacyLevel: 'public',
      lastMotion: new Date(Date.now() - 5 * 60 * 1000),
      motionHistory: [
        { timestamp: new Date(Date.now() - 8 * 60 * 1000), level: 'medium', duration: 120 },
        { timestamp: new Date(Date.now() - 25 * 60 * 1000), level: 'low', duration: 180 }
      ],
      alerts: []
    }
  ], []);

  // Generate motion zones
  const motionZones: MotionZone[] = useMemo(() => {
    const zones: MotionZone[] = [];
    
    rooms.forEach(room => {
      // Add entry/exit zones
      zones.push({
        id: `${room.id}-entry`,
        name: `${room.name} Entry`,
        roomId: room.id,
        type: 'entry',
        coordinates: {
          x: room.coordinates.x - 10,
          y: room.coordinates.y + room.coordinates.height / 2 - 20,
          width: 20,
          height: 40
        },
        sensitivity: 80,
        isActive: true,
        lastTriggered: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        triggerCount: Math.floor(Math.random() * 20),
        threshold: { motion: 60, duration: 5000 }
      });

      // Add bed zones for bedrooms
      if (room.type === 'bedroom') {
        zones.push({
          id: `${room.id}-bed`,
          name: `${room.name} Bed`,
          roomId: room.id,
          type: 'bed',
          coordinates: {
            x: room.coordinates.x + 20,
            y: room.coordinates.y + 20,
            width: 80,
            height: 60
          },
          sensitivity: 90,
          isActive: true,
          lastTriggered: new Date(Date.now() - Math.random() * 120 * 60 * 1000),
          triggerCount: Math.floor(Math.random() * 10),
          threshold: { motion: 30, duration: 10000 }
        });
      }

      // Add desk zones for offices
      if (room.type === 'office') {
        zones.push({
          id: `${room.id}-desk`,
          name: `${room.name} Desk`,
          roomId: room.id,
          type: 'desk',
          coordinates: {
            x: room.coordinates.x + 30,
            y: room.coordinates.y + 30,
            width: 60,
            height: 40
          },
          sensitivity: 70,
          isActive: true,
          lastTriggered: new Date(Date.now() - Math.random() * 90 * 60 * 1000),
          triggerCount: Math.floor(Math.random() * 15),
          threshold: { motion: 50, duration: 3000 }
        });
      }
    });

    return zones;
  }, [rooms]);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeMode || !autoRefresh) return;

    const interval = setInterval(() => {
      // Update random room motion levels
      rooms.forEach(room => {
        const random = Math.random();
        if (random > 0.7) {
          const levels: ('none' | 'low' | 'medium' | 'high')[] = ['none', 'low', 'medium', 'high'];
          const newLevel = levels[Math.floor(Math.random() * levels.length)];
          room.motionLevel = newLevel;
          room.lastMotion = new Date();
          
          // Add to motion history
          room.motionHistory.unshift({
            timestamp: new Date(),
            level: newLevel,
            duration: Math.floor(Math.random() * 300) + 60
          });
          
          // Keep only last 10 entries
          if (room.motionHistory.length > 10) {
            room.motionHistory = room.motionHistory.slice(0, 10);
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeMode, autoRefresh, rooms]);

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'bedroom': return <Bed className="w-4 h-4" />;
      case 'bathroom': return <Bath className="w-4 h-4" />;
      case 'kitchen': return <Utensils className="w-4 h-4" />;
      case 'living_room': return <Sofa className="w-4 h-4" />;
      case 'dining_room': return <Utensils className="w-4 h-4" />;
      case 'hallway': return <DoorOpen className="w-4 h-4" />;
      case 'office': return <Home className="w-4 h-4" />;
      case 'storage': return <Home className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  const getMotionColor = (level: string) => {
    switch (level) {
      case 'none': return 'bg-gray-100';
      case 'low': return 'bg-green-100';
      case 'medium': return 'bg-yellow-100';
      case 'high': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'public': return 'border-green-200';
      case 'private': return 'border-orange-200';
      case 'restricted': return 'border-red-200';
      default: return 'border-gray-200';
    }
  };

  const getAirQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const selectedRoomData = rooms.find(room => room.id === selectedRoom);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Room-Level Motion Zones</span>
              <Badge variant="secondary">{rooms.length} rooms</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={realTimeMode}
                  onCheckedChange={setRealTimeMode}
                />
                <span className="text-sm">Real-time</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                  disabled={!realTimeMode}
                />
                <span className="text-sm">Auto-refresh</span>
              </div>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Floor Plan Visualization */}
          <div className="relative bg-gray-50 rounded-lg p-4 mb-6" style={{ height: '500px' }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 600 500"
              className="border border-gray-300 rounded"
            >
              {/* Render rooms */}
              {rooms.map((room) => (
                <g key={room.id}>
                  {/* Room rectangle */}
                  <rect
                    x={room.coordinates.x}
                    y={room.coordinates.y}
                    width={room.coordinates.width}
                    height={room.coordinates.height}
                    fill={getMotionColor(room.motionLevel)}
                    stroke={showPrivacyZones ? getPrivacyColor(room.privacyLevel).replace('border-', '').replace('200', '') : '#9CA3AF'}
                    strokeWidth={showPrivacyZones ? 3 : 1}
                    className={`cursor-pointer transition-all hover:opacity-80 ${
                      selectedRoom === room.id ? 'stroke-blue-500 stroke-2' : ''
                    }`}
                    onClick={() => setSelectedRoom(room.id === selectedRoom ? null : room.id)}
                  />
                  
                  {/* Room icon */}
                  <text
                    x={room.coordinates.x + room.coordinates.width / 2}
                    y={room.coordinates.y + room.coordinates.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-600 text-xs pointer-events-none"
                  >
                    {getRoomIcon(room.type)}
                  </text>
                  
                  {/* Room name */}
                  <text
                    x={room.coordinates.x + room.coordinates.width / 2}
                    y={room.coordinates.y + room.coordinates.height / 2 + 15}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-700 text-xs font-medium pointer-events-none"
                  >
                    {room.name}
                  </text>
                  
                  {/* Occupancy indicator */}
                  <circle
                    cx={room.coordinates.x + 10}
                    cy={room.coordinates.y + 10}
                    r="6"
                    fill={room.currentOccupancy > 0 ? '#10B981' : '#9CA3AF'}
                    className="pointer-events-none"
                  />
                  
                  {/* Motion indicator */}
                  {room.motionLevel !== 'none' && (
                    <circle
                      cx={room.coordinates.x + room.coordinates.width - 10}
                      cy={room.coordinates.y + 10}
                      r="4"
                      fill={room.motionLevel === 'high' ? '#EF4444' : room.motionLevel === 'medium' ? '#F59E0B' : '#10B981'}
                      className="pointer-events-none animate-pulse"
                    />
                  )}
                </g>
              ))}
              
              {/* Render motion zones */}
              {showPrivacyZones && motionZones.map((zone) => (
                <g key={zone.id}>
                  <rect
                    x={zone.coordinates.x}
                    y={zone.coordinates.y}
                    width={zone.coordinates.width}
                    height={zone.coordinates.height}
                    fill={zone.isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(156, 163, 175, 0.1)'}
                    stroke={zone.isActive ? '#3B82F6' : '#9CA3AF'}
                    strokeWidth={1}
                    strokeDasharray="5,5"
                    className="pointer-events-none"
                  />
                  <text
                    x={zone.coordinates.x + zone.coordinates.width / 2}
                    y={zone.coordinates.y + zone.coordinates.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-blue-600 text-xs pointer-events-none"
                  >
                    {zone.type}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Room Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
              <p className="text-sm text-gray-600">Total Rooms</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {rooms.reduce((acc, room) => acc + room.currentOccupancy, 0)}
              </p>
              <p className="text-sm text-gray-600">Occupied</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">
                {rooms.filter(room => room.motionLevel === 'high').length}
              </p>
              <p className="text-sm text-gray-600">High Motion</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">
                {rooms.reduce((acc, room) => acc + room.alerts.filter(a => !a.acknowledged).length, 0)}
              </p>
              <p className="text-sm text-gray-600">Active Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Details */}
      {selectedRoomData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getRoomIcon(selectedRoomData.type)}
                <span>{selectedRoomData.name}</span>
                <Badge variant="outline">{selectedRoomData.type}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRoom(null)}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Basic Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Occupancy:</span>
                    <span className="text-sm font-medium">
                      {selectedRoomData.currentOccupancy}/{selectedRoomData.maxOccupancy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Privacy Level:</span>
                    <Badge variant="secondary" className="text-xs">
                      {selectedRoomData.privacyLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Occupied:</span>
                    <span className="text-sm font-medium">
                      {selectedRoomData.lastOccupied.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Motion:</span>
                    <span className="text-sm font-medium">
                      {selectedRoomData.lastMotion.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental Data */}
              <div className="space-y-4">
                <h4 className="font-medium">Environmental Data</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Temperature:</span>
                    <span className="text-sm font-medium">{selectedRoomData.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Humidity:</span>
                    <span className="text-sm font-medium">{selectedRoomData.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Air Quality:</span>
                    <span className={`text-sm font-medium ${getAirQualityColor(selectedRoomData.airQuality)}`}>
                      {selectedRoomData.airQuality}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Light Level:</span>
                    <span className="text-sm font-medium">{selectedRoomData.lightLevel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Noise Level:</span>
                    <span className="text-sm font-medium">{selectedRoomData.noiseLevel} dB</span>
                  </div>
                </div>
              </div>

              {/* Motion Analysis */}
              <div className="space-y-4">
                <h4 className="font-medium">Motion Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Level:</span>
                    <Badge className={getMotionColor(selectedRoomData.motionLevel)}>
                      {selectedRoomData.motionLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Motion Threshold:</span>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={motionThreshold}
                        onValueChange={setMotionThreshold}
                        max={100}
                        step={1}
                        className="w-24"
                      />
                      <span className="text-sm font-medium">{motionThreshold[0]}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Motion History */}
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Recent Motion History</h5>
                  <div className="space-y-2">
                    {selectedRoomData.motionHistory.slice(0, 5).map((history, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {history.timestamp.toLocaleTimeString()}
                        </span>
                        <Badge className={getMotionColor(history.level)} variant="outline">
                          {history.level}
                        </Badge>
                        <span className="text-gray-500">{history.duration}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {selectedRoomData.alerts.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Active Alerts</h4>
                <div className="space-y-2">
                  {selectedRoomData.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {alert.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={alert.acknowledged ? 'secondary' : 'destructive'}>
                          {alert.acknowledged ? 'Acknowledged' : 'Pending'}
                        </Badge>
                        <Badge variant="outline">{alert.severity}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Motion Zones Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Motion Zones Configuration</span>
              <Badge variant="secondary">{motionZones.length} zones</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivacyZones(!showPrivacyZones)}
              >
                {showPrivacyZones ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPrivacyZones ? 'Hide Zones' : 'Show Zones'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {motionZones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${zone.isActive ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-sm text-gray-600">
                      Type: {zone.type} • Sensitivity: {zone.sensitivity}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{zone.triggerCount} triggers</Badge>
                  <Badge variant="secondary">
                    {zone.lastTriggered.toLocaleTimeString()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomVisualization;