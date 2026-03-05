'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Settings, 
  Eye, 
  EyeOff, 
  Signal, 
  SignalHigh, 
  SignalLow, 
  SignalMedium, 
  Zap, 
  Target, 
  Users, 
  Home, 
  Heart, 
  BarChart3, 
  FileText, 
  Smartphone, 
  Cloud, 
  Database, 
  Lock, 
  Unlock, 
  Key, 
  CreditCard, 
  DollarSign, 
  Package, 
  Server, 
  Cpu, 
  HardDrive, 
  Battery, 
  Thermometer, 
  Wind, 
  Globe, 
  MapPin, 
  Navigation, 
  Compass, 
  Route, 
  Map, 
  Layers, 
  Grid, 
  List, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Send, 
  Share2, 
  Link, 
  Link2, 
  ExternalLink, 
  HelpCircle, 
  QuestionMark, 
  Lightbulb, 
  Bulb, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Wind, 
  Gauge, 
  Speed, 
  Timer, 
  Stopwatch, 
  AlarmClock, 
  Clock1, 
  Clock2, 
  Clock3, 
  Clock4, 
  Clock5, 
  Clock6, 
  Clock7, 
  Clock8, 
  Clock9, 
  Clock10, 
  Clock11, 
  Clock12
} from 'lucide-react';

// Import types
import { Resident } from '@/types/presence';
import type { 
  VitalSignsReading, 
  BreathingPattern, 
  SleepSession, 
  VitalSignsAlert 
} from '@/types/vitalSigns';
import type { 
  FallEvent, 
  ImmobilityAlert, 
  FallRiskAssessment 
} from '@/types/fallDetection';

interface RuViewSensor {
  id: string;
  name: string;
  type: 'esp32' | 'router' | 'access_point';
  zone: string;
  status: 'online' | 'offline' | 'error';
  lastSeen: Date;
  signalStrength: number;
  csiAvailable: boolean;
  macAddress: string;
  ipAddress: string;
  firmware: string;
  capabilities: string[];
}

interface RuViewPoseData {
  timestamp: string;
  frameId: string;
  persons: Array<{
    personId: string;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    keypoints: Array<{
      x: number;
      y: number;
      confidence: number;
      name: string;
    }>;
    zoneId: string;
    activity: string;
  }>;
  zoneSummary: Record<string, number>;
  processingTimeMs: number;
  metadata: Record<string, any>;
}

interface RuViewZone {
  id: string;
  name: string;
  type: 'bedroom' | 'living_room' | 'kitchen' | 'bathroom' | 'hallway' | 'office';
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  maxOccupancy: number;
  sensors: string[];
  active: boolean;
}

interface RuViewIntegrationProps {
  residents: Resident[];
  vitalSignsReadings: VitalSignsReading[];
  breathingPatterns: BreathingPattern[];
  sleepSessions: SleepSession[];
  vitalSignsAlerts: VitalSignsAlert[];
  fallEvents: FallEvent[];
  immobilityAlerts: ImmobilityAlert[];
  riskAssessments: FallRiskAssessment[];
}

const RuViewIntegration: React.FC<RuViewIntegrationProps> = ({
  residents,
  vitalSignsReadings,
  breathingPatterns,
  sleepSessions,
  vitalSignsAlerts,
  fallEvents,
  immobilityAlerts,
  riskAssessments
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [apiKey, setApiKey] = useState('');
  const [sensors, setSensors] = useState<RuViewSensor[]>([]);
  const [zones, setZones] = useState<RuViewZone[]>([]);
  const [currentPoseData, setCurrentPoseData] = useState<RuViewPoseData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock RuView sensors (in real implementation, these would come from the API)
  const mockSensors: RuViewSensor[] = [
    {
      id: 'sensor-1',
      name: 'Bedroom Sensor',
      type: 'esp32',
      zone: 'bedroom-1',
      status: 'online',
      lastSeen: new Date(),
      signalStrength: 85,
      csiAvailable: true,
      macAddress: '24:6F:28:7C:12:34',
      ipAddress: '192.168.1.100',
      firmware: 'v2.1.0',
      capabilities: ['pose_estimation', 'vital_signs', 'fall_detection', 'presence_detection']
    },
    {
      id: 'sensor-2',
      name: 'Living Room Sensor',
      type: 'esp32',
      zone: 'living-room-1',
      status: 'online',
      lastSeen: new Date(),
      signalStrength: 92,
      csiAvailable: true,
      macAddress: '24:6F:28:7C:12:35',
      ipAddress: '192.168.1.101',
      firmware: 'v2.1.0',
      capabilities: ['pose_estimation', 'vital_signs', 'fall_detection', 'presence_detection']
    },
    {
      id: 'sensor-3',
      name: 'Kitchen Sensor',
      type: 'esp32',
      zone: 'kitchen-1',
      status: 'online',
      lastSeen: new Date(),
      signalStrength: 78,
      csiAvailable: true,
      macAddress: '24:6F:28:7C:12:36',
      ipAddress: '192.168.1.102',
      firmware: 'v2.1.0',
      capabilities: ['pose_estimation', 'vital_signs', 'fall_detection', 'presence_detection']
    }
  ];

  // Mock zones
  const mockZones: RuViewZone[] = [
    {
      id: 'bedroom-1',
      name: 'Master Bedroom',
      type: 'bedroom',
      coordinates: { x: 50, y: 50, width: 200, height: 180 },
      maxOccupancy: 2,
      sensors: ['sensor-1'],
      active: true
    },
    {
      id: 'living-room-1',
      name: 'Living Room',
      type: 'living_room',
      coordinates: { x: 280, y: 50, width: 220, height: 180 },
      maxOccupancy: 4,
      sensors: ['sensor-2'],
      active: true
    },
    {
      id: 'kitchen-1',
      name: 'Kitchen',
      type: 'kitchen',
      coordinates: { x: 50, y: 280, width: 180, height: 150 },
      maxOccupancy: 3,
      sensors: ['sensor-3'],
      active: true
    }
  ];

  // Initialize mock data
  useEffect(() => {
    setSensors(mockSensors);
    setZones(mockZones);
  }, []);

  // Simulate real-time pose data updates
  useEffect(() => {
    if (!realTimeMode || !isConnected) return;

    const interval = setInterval(() => {
      // Generate mock pose data that simulates RuView API responses
      const mockPoseData: RuViewPoseData = {
        timestamp: new Date().toISOString(),
        frameId: `frame-${Date.now()}`,
        persons: [
          {
            personId: 'person-1',
            confidence: 0.92,
            boundingBox: { x: 100, y: 150, width: 60, height: 120 },
            keypoints: [
              { x: 130, y: 180, confidence: 0.95, name: 'nose' },
              { x: 125, y: 200, confidence: 0.88, name: 'left_eye' },
              { x: 135, y: 200, confidence: 0.91, name: 'right_eye' },
              { x: 120, y: 220, confidence: 0.87, name: 'left_shoulder' },
              { x: 140, y: 220, confidence: 0.89, name: 'right_shoulder' },
              { x: 115, y: 250, confidence: 0.85, name: 'left_elbow' },
              { x: 145, y: 250, confidence: 0.86, name: 'right_elbow' },
              { x: 110, y: 280, confidence: 0.83, name: 'left_wrist' },
              { x: 150, y: 280, confidence: 0.84, name: 'right_wrist' },
              { x: 125, y: 310, confidence: 0.88, name: 'left_hip' },
              { x: 135, y: 310, confidence: 0.90, name: 'right_hip' },
              { x: 120, y: 340, confidence: 0.82, name: 'left_knee' },
              { x: 140, y: 340, confidence: 0.84, name: 'right_knee' },
              { x: 115, y: 370, confidence: 0.80, name: 'left_ankle' },
              { x: 145, y: 370, confidence: 0.81, name: 'right_ankle' }
            ],
            zoneId: 'living-room-1',
            activity: 'sitting'
          }
        ],
        zoneSummary: {
          'bedroom-1': 0,
          'living-room-1': 1,
          'kitchen-1': 0
        },
        processingTimeMs: 45.2,
        metadata: {
          sensorId: 'sensor-2',
          csiQuality: 0.94,
          signalStrength: 92,
          modelVersion: 'v2.1.0'
        }
      };

      setCurrentPoseData(mockPoseData);
      setLastUpdate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [realTimeMode, isConnected]);

  // Connect to RuView API
  const connectToRuView = useCallback(async () => {
    setConnectionStatus('connecting');
    setError(null);

    try {
      // Test connection to RuView API
      const response = await fetch(`${apiUrl}/health`);
      
      if (response.ok) {
        const healthData = await response.json();
        console.log('RuView API Health:', healthData);
        
        // In a real implementation, we would fetch sensors and zones from the API
        // For now, we'll simulate the connection
        setTimeout(() => {
          setIsConnected(true);
          setConnectionStatus('connected');
        }, 1000);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Failed to connect to RuView API:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnectionStatus('error');
      setIsConnected(false);
    }
  }, [apiUrl]);

  // Disconnect from RuView API
  const disconnectFromRuView = useCallback(() => {
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setCurrentPoseData(null);
    setLastUpdate(null);
  }, []);

  // Fetch current pose data from RuView
  const fetchCurrentPose = useCallback(async () => {
    if (!isConnected) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/pose/current`, {
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
      });

      if (response.ok) {
        const poseData = await response.json();
        setCurrentPoseData(poseData);
        setLastUpdate(new Date());
      } else {
        console.error('Failed to fetch pose data:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching pose data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pose data');
    }
  }, [apiUrl, apiKey, isConnected]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'connecting': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  const getSignalColor = (strength: number) => {
    if (strength > 80) return 'text-green-600';
    if (strength > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSignalIcon = (strength: number) => {
    if (strength > 80) return <SignalHigh className="w-4 h-4" />;
    if (strength > 60) return <SignalMedium className="w-4 h-4" />;
    return <SignalLow className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5" />
              <span>RuView Sensor Integration</span>
              <Badge variant={isConnected ? 'default' : 'secondary'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={realTimeMode}
                  onCheckedChange={setRealTimeMode}
                  disabled={!isConnected}
                />
                <span className="text-sm">Real-time</span>
              </div>
              <Button
                variant={isConnected ? 'destructive' : 'default'}
                onClick={isConnected ? disconnectFromRuView : connectToRuView}
                disabled={connectionStatus === 'connecting'}
              >
                {isConnected ? (
                  <>
                    <WifiOff className="w-4 h-4 mr-2" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${getConnectionStatusColor(connectionStatus)}`}>
                {getConnectionStatusIcon(connectionStatus)}
              </div>
              <div>
                <p className="font-medium">RuView API Connection</p>
                <p className="text-sm text-gray-600">
                  {connectionStatus === 'connected' ? `Connected to ${apiUrl}` : 
                   connectionStatus === 'connecting' ? 'Connecting...' :
                   connectionStatus === 'error' ? `Error: ${error}` :
                   'Disconnected'}
                </p>
              </div>
            </div>
            <div className="text-right">
              {lastUpdate && (
                <p className="text-sm text-gray-600">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">API URL</label>
                    <Input
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="http://localhost:8000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">API Key</label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Optional API key"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setShowSettings(false);
                    if (isConnected) {
                      disconnectFromRuView();
                    }
                  }}>
                    Save & Reconnect
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Server className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{sensors.length}</p>
              <p className="text-sm text-gray-600">Active Sensors</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{zones.length}</p>
              <p className="text-sm text-gray-600">Monitored Zones</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">
                {currentPoseData ? currentPoseData.persons.length : 0}
              </p>
              <p className="text-sm text-gray-600">Detected Persons</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">
                {currentPoseData ? Math.round(currentPoseData.processingTimeMs) : 0}ms
              </p>
              <p className="text-sm text-gray-600">Processing Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensors Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="w-5 h-5" />
            <span>Sensor Status</span>
            <Badge variant="secondary">{sensors.length} sensors</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sensors.map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${getStatusColor(sensor.status)}`}>
                    {getStatusIcon(sensor.status)}
                  </div>
                  <div>
                    <h4 className="font-medium">{sensor.name}</h4>
                    <p className="text-sm text-gray-600">{sensor.type.toUpperCase()} • {sensor.zone}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{sensor.ipAddress}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{sensor.macAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Signal:</span>
                      <div className="flex items-center space-x-1">
                        {getSignalIcon(sensor.signalStrength)}
                        <span className={`text-sm font-medium ${getSignalColor(sensor.signalStrength)}`}>
                          {sensor.signalStrength}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">CSI:</span>
                      <Badge variant={sensor.csiAvailable ? 'default' : 'secondary'} className="text-xs">
                        {sensor.csiAvailable ? 'Available' : 'Limited'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {sensor.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Pose Data */}
      {currentPoseData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Current Pose Detection</span>
              <Badge variant="secondary">
                {currentPoseData.persons.length} persons
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Detection Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Frame ID:</span>
                      <span className="text-sm font-medium">{currentPoseData.frameId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Processing Time:</span>
                      <span className="text-sm font-medium">{currentPoseData.processingTimeMs}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Timestamp:</span>
                      <span className="text-sm font-medium">
                        {new Date(currentPoseData.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Zone Occupancy</h4>
                  <div className="space-y-2">
                    {Object.entries(currentPoseData.zoneSummary).map(([zoneId, count]) => (
                      <div key={zoneId} className="flex justify-between">
                        <span className="text-sm text-gray-600">{zoneId}:</span>
                        <span className="text-sm font-medium">{count} persons</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">System Metadata</h4>
                  <div className="space-y-2">
                    {Object.entries(currentPoseData.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600">{key}:</span>
                        <span className="text-sm font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Person Details */}
              <div>
                <h4 className="font-medium mb-2">Detected Persons</h4>
                <div className="space-y-3">
                  {currentPoseData.persons.map((person, index) => (
                    <div key={person.personId} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">Person {index + 1}</h5>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            Confidence: {Math.round(person.confidence * 100)}%
                          </Badge>
                          <Badge variant="secondary">
                            {person.activity}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-sm font-medium mb-2">Bounding Box</h6>
                          <div className="text-sm space-y-1">
                            <div>X: {person.boundingBox.x}, Y: {person.boundingBox.y}</div>
                            <div>Width: {person.boundingBox.width}, Height: {person.boundingBox.height}</div>
                          </div>
                        </div>
                        <div>
                          <h6 className="text-sm font-medium mb-2">Key Points ({person.keypoints.length})</h6>
                          <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
                            {person.keypoints.slice(0, 5).map((keypoint, kpIndex) => (
                              <div key={kpIndex} className="flex justify-between">
                                <span>{keypoint.name}:</span>
                                <span>({Math.round(keypoint.x)}, {Math.round(keypoint.y)})</span>
                              </div>
                            ))}
                            {person.keypoints.length > 5 && (
                              <div className="text-gray-500">... and {person.keypoints.length - 5} more</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RuViewIntegration;