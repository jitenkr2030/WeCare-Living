'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Laptop, 
  Watch, 
  Bell, 
  Settings, 
  Download, 
  Upload, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryCharging, 
  Signal, 
  SignalHigh, 
  SignalLow, 
  SignalMedium, 
  MapPin, 
  Navigation, 
  QrCode, 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Users, 
  Home, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  Search, 
  Filter, 
  RefreshCw,
  Zap,
  Target,
  Award,
  Star,
  Globe,
  Cloud,
  CloudDownload,
  CloudUpload,
  SmartphoneNfc,
  Fingerprint,
  UserCheck
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

interface MobileDevice {
  id: string;
  name: string;
  type: 'ios' | 'android' | 'tablet' | 'web' | 'wearable';
  model: string;
  osVersion: string;
  appVersion: string;
  status: 'online' | 'offline' | 'charging' | 'low_battery';
  batteryLevel: number;
  signalStrength: number;
  lastSync: Date;
  userId: string;
  userName: string;
  permissions: {
    location: boolean;
    notifications: boolean;
    camera: boolean;
    microphone: boolean;
    contacts: boolean;
  };
  features: {
    pushNotifications: boolean;
    biometricAuth: boolean;
    offlineMode: boolean;
    realTimeUpdates: boolean;
    darkMode: boolean;
  };
  usage: {
    lastActive: Date;
    sessionDuration: number;
    screenTime: number;
    dataUsage: number;
    notifications: number;
  };
}

interface MobileAppProps {
  residents: Resident[];
  vitalSignsReadings: VitalSignsReading[];
  breathingPatterns: BreathingPattern[];
  sleepSessions: SleepSession[];
  vitalSignsAlerts: VitalSignsAlert[];
  fallEvents: FallEvent[];
  immobilityAlerts: ImmobilityAlert[];
  riskAssessments: FallRiskAssessment[];
}

const MobileAppInterface: React.FC<MobileAppProps> = ({
  residents,
  vitalSignsReadings,
  breathingPatterns,
  sleepSessions,
  vitalSignsAlerts,
  fallEvents,
  immobilityAlerts,
  riskAssessments
}) => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [appSettings, setAppSettings] = useState({
    pushNotifications: true,
    offlineMode: true,
    realTimeUpdates: true,
    darkMode: false,
    biometricAuth: true,
    locationServices: true,
    autoSync: true
  });

  // Generate mock mobile devices
  const mobileDevices: MobileDevice[] = useMemo(() => [
    {
      id: 'device-1',
      name: 'Sarah\'s iPhone',
      type: 'ios',
      model: 'iPhone 14 Pro',
      osVersion: 'iOS 17.2',
      appVersion: '2.1.0',
      status: 'online',
      batteryLevel: 87,
      signalStrength: 95,
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      userId: 'user-1',
      userName: 'Sarah Johnson',
      permissions: {
        location: true,
        notifications: true,
        camera: false,
        microphone: false,
        contacts: true
      },
      features: {
        pushNotifications: true,
        biometricAuth: true,
        offlineMode: true,
        realTimeUpdates: true,
        darkMode: false
      },
      usage: {
        lastActive: new Date(Date.now() - 5 * 60 * 1000),
        sessionDuration: 240,
        screenTime: 480,
        dataUsage: 125.6,
        notifications: 47
      }
    },
    {
      id: 'device-2',
      name: 'Michael\'s Android',
      type: 'android',
      model: 'Samsung Galaxy S23',
      osVersion: 'Android 14',
      appVersion: '2.1.0',
      status: 'online',
      batteryLevel: 65,
      signalStrength: 88,
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      userId: 'user-2',
      userName: 'Michael Chen',
      permissions: {
        location: true,
        notifications: true,
        camera: false,
        microphone: false,
        contacts: true
      },
      features: {
        pushNotifications: true,
        biometricAuth: true,
        offlineMode: true,
        realTimeUpdates: true,
        darkMode: true
      },
      usage: {
        lastActive: new Date(Date.now() - 2 * 60 * 1000),
        sessionDuration: 180,
        screenTime: 320,
        dataUsage: 98.4,
        notifications: 32
      }
    },
    {
      id: 'device-3',
      name: 'Emily\'s iPad',
      type: 'tablet',
      model: 'iPad Air',
      osVersion: 'iPadOS 17.2',
      appVersion: '2.1.0',
      status: 'charging',
      batteryLevel: 92,
      signalStrength: 100,
      lastSync: new Date(Date.now() - 1 * 60 * 1000),
      userId: 'user-3',
      userName: 'Emily Rodriguez',
      permissions: {
        location: true,
        notifications: true,
        camera: false,
        microphone: false,
        contacts: true
      },
      features: {
        pushNotifications: true,
        biometricAuth: true,
        offlineMode: true,
        realTimeUpdates: true,
        darkMode: false
      },
      usage: {
        lastActive: new Date(Date.now() - 10 * 60 * 1000),
        sessionDuration: 420,
        screenTime: 680,
        dataUsage: 234.8,
        notifications: 28
      }
    },
    {
      id: 'device-4',
      name: 'David\'s Apple Watch',
      type: 'wearable',
      model: 'Apple Watch Series 9',
      osVersion: 'watchOS 10.2',
      appVersion: '2.0.5',
      status: 'online',
      batteryLevel: 78,
      signalStrength: 92,
      lastSync: new Date(Date.now() - 30 * 1000),
      userId: 'user-4',
      userName: 'David Kim',
      permissions: {
        location: true,
        notifications: true,
        camera: false,
        microphone: false,
        contacts: false
      },
      features: {
        pushNotifications: true,
        biometricAuth: true,
        offlineMode: true,
        realTimeUpdates: true,
        darkMode: false
      },
      usage: {
        lastActive: new Date(Date.now() - 1 * 60 * 1000),
        sessionDuration: 1440,
        screenTime: 180,
        dataUsage: 45.2,
        notifications: 156
      }
    },
    {
      id: 'device-5',
      name: 'Web Dashboard',
      type: 'web',
      model: 'Chrome Browser',
      osVersion: 'Windows 11',
      appVersion: '2.1.0',
      status: 'online',
      batteryLevel: 100,
      signalStrength: 100,
      lastSync: new Date(Date.now() - 10 * 1000),
      userId: 'user-5',
      userName: 'Jennifer Wilson',
      permissions: {
        location: true,
        notifications: true,
        camera: false,
        microphone: false,
        contacts: false
      },
      features: {
        pushNotifications: false,
        biometricAuth: false,
        offlineMode: true,
        realTimeUpdates: true,
        darkMode: true
      },
      usage: {
        lastActive: new Date(Date.now() - 5 * 60 * 1000),
        sessionDuration: 360,
        screenTime: 360,
        dataUsage: 89.3,
        notifications: 12
      }
    }
  ], []);

  // Filter devices based on selected criteria
  const filteredDevices = useMemo(() => {
    let filtered = [...mobileDevices];

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(device => device.type === selectedPlatform);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(device => device.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(query) ||
        device.userName.toLowerCase().includes(query) ||
        device.model.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.lastSync.getTime() - a.lastSync.getTime());
  }, [mobileDevices, selectedPlatform, selectedStatus, searchQuery]);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeMode) return;

    const interval = setInterval(() => {
      // Update random device statuses
      mobileDevices.forEach(device => {
        const random = Math.random();
        if (random > 0.8) {
          // Update battery level
          device.batteryLevel = Math.max(0, device.batteryLevel - Math.random() * 2);
          
          // Update signal strength
          device.signalStrength = Math.max(0, Math.min(100, device.signalStrength + (Math.random() - 0.5) * 10));
          
          // Update last sync
          device.lastSync = new Date();
          
          // Update usage
          device.usage.lastActive = new Date();
          device.usage.screenTime += Math.random() * 5;
          device.usage.dataUsage += Math.random() * 2;
        }
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [realTimeMode, mobileDevices]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'ios': return <Smartphone className="w-5 h-5" />;
      case 'android': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      case 'wearable': return <Watch className="w-5 h-5" />;
      case 'web': return <Monitor className="w-5 h-5" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'charging': return 'bg-blue-100 text-blue-800';
      case 'low_battery': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <SignalLow className="w-4 h-4" />;
      case 'charging': return <BatteryCharging className="w-4 h-4" />;
      case 'low_battery': return <Battery className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSignalIcon = (strength: number) => {
    if (strength > 80) return <SignalHigh className="w-4 h-4" />;
    if (strength > 50) return <SignalMedium className="w-4 h-4" />;
    return <SignalLow className="w-4 h-4" />;
  };

  const getSignalColor = (strength: number) => {
    if (strength > 80) return 'text-green-600';
    if (strength > 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const selectedDeviceData = mobileDevices.find(device => device.id === selectedDevice);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Mobile App & Responsive Design</span>
              <Badge variant="secondary">{filteredDevices.length} devices</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={realTimeMode}
                  onCheckedChange={setRealTimeMode}
                />
                <span className="text-sm">Real-time</span>
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
          {/* Device Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{filteredDevices.length}</p>
              <p className="text-sm text-gray-600">Total Devices</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {filteredDevices.filter(d => d.status === 'online').length}
              </p>
              <p className="text-sm text-gray-600">Online</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Battery className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">
                {filteredDevices.filter(d => d.batteryLevel < 30).length}
              </p>
              <p className="text-sm text-gray-600">Low Battery</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(filteredDevices.reduce((acc, d) => acc + d.usage.screenTime, 0) / filteredDevices.length)}
              </p>
              <p className="text-sm text-gray-600">Avg Screen Time</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="ios">iOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="wearable">Wearable</SelectItem>
                <SelectItem value="web">Web</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="charging">Charging</SelectItem>
                <SelectItem value="low_battery">Low Battery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Responsive Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Mobile Responsive Preview</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </Button>
              <Button variant="outline" size="sm">
                <Tablet className="w-4 h-4 mr-2" />
                Tablet
              </Button>
              <Button variant="outline" size="sm">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mobile Phone Preview */}
            <div className="space-y-4">
              <h4 className="font-medium">Mobile Phone View</h4>
              <div className="bg-gray-900 rounded-3xl p-4 mx-auto" style={{ width: '280px' }}>
                <div className="bg-white rounded-2xl overflow-hidden" style={{ height: '500px' }}>
                  {/* Status Bar */}
                  <div className="bg-gray-100 px-3 py-1 flex justify-between items-center text-xs">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <SignalHigh className="w-3 h-3" />
                      <Wifi className="w-3 h-3" />
                      <Battery className="w-3 h-3" />
                    </div>
                  </div>
                  
                  {/* App Header */}
                  <div className="bg-blue-600 text-white p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">WeCare Living</h3>
                      <Bell className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Navigation Tabs */}
                  <div className="bg-gray-50 px-2 py-2 flex justify-around text-xs">
                    <div className="text-center">
                      <Home className="w-4 h-4 mx-auto mb-1" />
                      <span>Home</span>
                    </div>
                    <div className="text-center">
                      <Users className="w-4 h-4 mx-auto mb-1" />
                      <span>Residents</span>
                    </div>
                    <div className="text-center">
                      <Activity className="w-4 h-4 mx-auto mb-1" />
                      <span>Vitals</span>
                    </div>
                    <div className="text-center">
                      <BarChart3 className="w-4 h-4 mx-auto mb-1" />
                      <span>Reports</span>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-3 space-y-3">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Active Residents</span>
                        <span className="text-xs font-bold">12</span>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">System Status</span>
                        <span className="text-xs font-bold text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Active Alerts</span>
                        <span className="text-xs font-bold text-red-600">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-2 py-2 flex justify-around">
                    <Home className="w-4 h-4 text-blue-600" />
                    <Users className="w-4 h-4 text-gray-400" />
                    <Activity className="w-4 h-4 text-gray-400" />
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tablet Preview */}
            <div className="space-y-4">
              <h4 className="font-medium">Tablet View</h4>
              <div className="bg-gray-900 rounded-2xl p-4 mx-auto" style={{ width: '400px' }}>
                <div className="bg-white rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  {/* Status Bar */}
                  <div className="bg-gray-100 px-3 py-1 flex justify-between items-center text-xs">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <SignalHigh className="w-3 h-3" />
                      <Wifi className="w-3 h-3" />
                      <Battery className="w-3 h-3" />
                    </div>
                  </div>
                  
                  {/* App Header */}
                  <div className="bg-blue-600 text-white p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">WeCare Living</h3>
                      <div className="flex space-x-3">
                        <Bell className="w-4 h-4" />
                        <Settings className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Residents</span>
                        </div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-gray-600">Active Now</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Vitals</span>
                        </div>
                        <p className="text-2xl font-bold">248</p>
                        <p className="text-xs text-gray-600">Readings</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">Alerts</span>
                        </div>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-xs text-gray-600">Active</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Home className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Rooms</span>
                        </div>
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-xs text-gray-600">Occupied</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Preview */}
            <div className="space-y-4">
              <h4 className="font-medium">Desktop View</h4>
              <div className="bg-gray-900 rounded-lg p-4 mx-auto" style={{ width: '500px' }}>
                <div className="bg-white rounded overflow-hidden" style={{ height: '500px' }}>
                  {/* Browser Header */}
                  <div className="bg-gray-100 px-3 py-1 flex justify-between items-center text-xs">
                    <span>WeCare Living Dashboard</span>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">WeCare Living Dashboard</h3>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Refresh</Button>
                        <Button size="sm" variant="outline">Settings</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-blue-50 rounded p-2 text-center">
                        <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-lg font-bold">12</p>
                        <p className="text-xs text-gray-600">Residents</p>
                      </div>
                      <div className="bg-green-50 rounded p-2 text-center">
                        <Activity className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-lg font-bold">248</p>
                        <p className="text-xs text-gray-600">Vitals</p>
                      </div>
                      <div className="bg-red-50 rounded p-2 text-center">
                        <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                        <p className="text-lg font-bold">3</p>
                        <p className="text-xs text-gray-600">Alerts</p>
                      </div>
                      <div className="bg-purple-50 rounded p-2 text-center">
                        <Home className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                        <p className="text-lg font-bold">5</p>
                        <p className="text-xs text-gray-600">Rooms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredDevices.map((device) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedDevice(device.id === selectedDevice ? null : device.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(device.status)}`}>
                        {getStatusIcon(device.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getDeviceIcon(device.type)}
                          <h3 className="font-semibold">{device.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {device.type}
                          </Badge>
                          <Badge className={getStatusColor(device.status)} className="text-xs">
                            {device.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <UserCheck className="w-4 h-4 text-gray-400" />
                              <span>{device.userName}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Smartphone className="w-4 h-4 text-gray-400" />
                              <span>{device.model}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <span>{device.osVersion}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Battery className={`w-4 h-4 ${getBatteryColor(device.batteryLevel)}`} />
                              <span>{device.batteryLevel}%</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              {getSignalIcon(device.signalStrength)}
                              <span className={getSignalColor(device.signalStrength)}>
                                {device.signalStrength}%
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>Last sync: {device.lastSync.toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Activity className="w-4 h-4 text-gray-400" />
                              <span>Screen time: {device.usage.screenTime}m</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <CloudDownload className="w-4 h-4 text-gray-400" />
                              <span>Data: {device.usage.dataUsage}MB</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Bell className="w-4 h-4 text-gray-400" />
                              <span>{device.usage.notifications} notifications</span>
                            </div>
                          </div>
                        </div>

                        {/* Permissions */}
                        <div className="flex flex-wrap gap-2">
                          {device.permissions.location && (
                            <Badge variant="secondary" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              Location
                            </Badge>
                          )}
                          {device.permissions.notifications && (
                            <Badge variant="secondary" className="text-xs">
                              <Bell className="w-3 h-3 mr-1" />
                              Notifications
                            </Badge>
                          )}
                          {device.permissions.camera && (
                            <Badge variant="secondary" className="text-xs">
                              <Camera className="w-3 h-3 mr-1" />
                              Camera
                            </Badge>
                          )}
                          {device.permissions.microphone && (
                            <Badge variant="secondary" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              Microphone
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Device Details */}
      {selectedDeviceData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getDeviceIcon(selectedDeviceData.type)}
                <span>{selectedDeviceData.name}</span>
                <Badge variant="outline">{selectedDeviceData.type}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDevice(null)}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Device Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Device Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Model:</span>
                    <span className="text-sm font-medium">{selectedDeviceData.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">OS Version:</span>
                    <span className="text-sm font-medium">{selectedDeviceData.osVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">App Version:</span>
                    <span className="text-sm font-medium">{selectedDeviceData.appVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">User:</span>
                    <span className="text-sm font-medium">{selectedDeviceData.userName}</span>
                  </div>
                </div>
              </div>

              {/* Status & Performance */}
              <div className="space-y-4">
                <h4 className="font-medium">Status & Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className={getStatusColor(selectedDeviceData.status)}>
                      {selectedDeviceData.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Battery:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedDeviceData.batteryLevel} className="w-20 h-2" />
                      <span className={`text-sm font-medium ${getBatteryColor(selectedDeviceData.batteryLevel)}`}>
                        {selectedDeviceData.batteryLevel}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Signal:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedDeviceData.signalStrength} className="w-20 h-2" />
                      <span className={`text-sm font-medium ${getSignalColor(selectedDeviceData.signalStrength)}`}>
                        {selectedDeviceData.signalStrength}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Sync:</span>
                    <span className="text-sm font-medium">
                      {selectedDeviceData.lastSync.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="space-y-4">
                <h4 className="font-medium">Usage Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Screen Time:</span>
                    <span className="text-sm font-medium">{selectedDeviceData.usage.screenTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Usage:</span>
                    <span className="text-sm font-medium">{selectedDeviceData.usage.dataUsage} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Notifications:</span>
                    <span className="text-sm font-medium">{selectedDeviceData.usage.notifications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Session Duration:</span>
                    <span className="text-sm font-medium">{selectedDeviceData.usage.sessionDuration} minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Device Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedDeviceData.features.pushNotifications ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedDeviceData.features.biometricAuth ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Biometric Auth</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedDeviceData.features.offlineMode ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Offline Mode</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedDeviceData.features.realTimeUpdates ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Real-time Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedDeviceData.features.darkMode ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Dark Mode</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Mobile App Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">General Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive real-time alerts on mobile devices</p>
                  </div>
                  <Switch
                    checked={appSettings.pushNotifications}
                    onCheckedChange={(checked) => setAppSettings({...appSettings, pushNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Offline Mode</p>
                    <p className="text-sm text-gray-600">Access data without internet connection</p>
                  </div>
                  <Switch
                    checked={appSettings.offlineMode}
                    onCheckedChange={(checked) => setAppSettings({...appSettings, offlineMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Real-time Updates</p>
                    <p className="text-sm text-gray-600">Live data synchronization</p>
                  </div>
                  <Switch
                    checked={appSettings.realTimeUpdates}
                    onCheckedChange={(checked) => setAppSettings({...appSettings, realTimeUpdates: checked})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Security Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Biometric Authentication</p>
                    <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
                  </div>
                  <Switch
                    checked={appSettings.biometricAuth}
                    onCheckedChange={(checked) => setAppSettings({...appSettings, biometricAuth: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Location Services</p>
                    <p className="text-sm text-gray-600">Access device location for monitoring</p>
                  </div>
                  <Switch
                    checked={appSettings.locationServices}
                    onCheckedChange={(checked) => setAppSettings({...appSettings, locationServices: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-sync</p>
                    <p className="text-sm text-gray-600">Automatic data synchronization</p>
                  </div>
                  <Switch
                    checked={appSettings.autoSync}
                    onCheckedChange={(checked) => setAppSettings({...appSettings, autoSync: checked})}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAppInterface;