'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shield,
  Heart,
  Brain,
  Eye,
  Phone,
  Settings,
  Download,
  UserCheck,
  Wifi,
  Battery,
  Thermometer,
  Moon,
  Sun,
  Zap,
  BarChart3,
  Calendar,
  FileText,
  Smartphone,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';

// Import existing components
import PresenceDashboard from '@/components/presence/PresenceDashboard';
import VitalSignsDashboard from '@/components/vitalSigns/VitalSignsDashboard';
import FallDetectionDashboard from '@/components/fallDetection/FallDetectionDashboard';
import ActivityTimeline from '@/components/timeline/ActivityTimeline';
import AIAnomalyDetection from '@/components/ai/AIAnomalyDetection';
import CaregiverDashboard from '@/components/caregiver/CaregiverDashboard';
import RoomVisualization from '@/components/rooms/RoomVisualization';
import ReportsInterface from '@/components/reports/ReportsInterface';
import MobileAppInterface from '@/components/mobile/MobileAppInterface';
import ProductTiering from '@/components/tiering/ProductTiering';
import RuViewIntegration from '@/components/ruview/RuViewIntegration';

// Import mock data
import { MockDataGenerator } from '@/lib/mockData';
import { Resident } from '@/types/presence';
import type {
  VitalSignsReading,
  BreathingPattern,
  SleepSession,
  VitalSignsAlert,
  VitalSignsStats,
  ResidentVitalProfile,
  WellnessIndicator
} from '@/types/vitalSigns';
import type {
  FallEvent,
  FallRiskAssessment,
  ImmobilityAlert,
  EmergencyResponse,
  FallDetectionStats
} from '@/types/fallDetection';

interface SystemStats {
  totalResidents: number;
  activeResidents: number;
  occupiedRooms: number;
  criticalAlerts: number;
  systemStatus: 'active' | 'warning' | 'critical' | 'offline';
  uptime: number;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  lastUpdate: Date;
  batteryLevel: number;
  signalStrength: number;
  temperature: number;
  humidity: number;
}

interface AlertSummary {
  id: string;
  type: 'fall' | 'vital' | 'immobility' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  residentId?: string;
  acknowledged: boolean;
}

const WeCareLivingDashboard: React.FC = () => {
  const [systemData, setSystemData] = useState<{
    residents: Resident[];
    vitalSignsReadings: VitalSignsReading[];
    breathingPatterns: BreathingPattern[];
    sleepSessions: SleepSession[];
    vitalSignsAlerts: VitalSignsAlert[];
    vitalSignsStats: VitalSignsStats;
    residentProfiles: ResidentVitalProfile[];
    wellnessIndicators: WellnessIndicator[];
    fallEvents: FallEvent[];
    riskAssessments: FallRiskAssessment[];
    immobilityAlerts: ImmobilityAlert[];
    emergencyResponses: EmergencyResponse[];
    fallDetectionStats: FallDetectionStats;
    systemStats: SystemStats;
    alertSummaries: AlertSummary[];
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'overview' | 'presence' | 'vital' | 'fall' | 'analytics'>('overview');

  // Initialize comprehensive data
  useEffect(() => {
    const initializeData = () => {
      try {
        const residents = MockDataGenerator.generateResidents(12);
        const rooms = MockDataGenerator.generateRooms();
        
        // Generate all types of data
        const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);
        const fallDetectionData = MockDataGenerator.generateCompleteFallDetectionData(residents, rooms);
        
        // System stats
        const systemStats: SystemStats = {
          totalResidents: residents.length,
          activeResidents: residents.filter(r => r.status === 'active').length,
          occupiedRooms: rooms.filter(r => r.currentOccupancy > 0).length,
          criticalAlerts: fallDetectionData.fallEvents.filter(f => f.severity === 'critical').length + 
                         vitalSignsData.vitalSignsAlerts.filter(a => a.severity === 'critical').length,
          systemStatus: 'active',
          uptime: 99.8,
          dataQuality: 'excellent',
          lastUpdate: new Date(),
          batteryLevel: 87,
          signalStrength: 92,
          temperature: 22.5,
          humidity: 45
        };

        // Alert summaries
        const alertSummaries: AlertSummary[] = [
          ...fallDetectionData.fallEvents.slice(0, 3).map(event => ({
            id: event.id,
            type: 'fall' as const,
            severity: event.severity as any,
            title: `Fall Detected - ${residents.find(r => r.id === event.residentId)?.name || 'Unknown'}`,
            description: `Fall detected in ${event.location}`,
            timestamp: event.timestamp,
            residentId: event.residentId,
            acknowledged: event.responseStatus !== 'pending'
          })),
          ...vitalSignsData.vitalSignsAlerts.slice(0, 2).map(alert => ({
            id: alert.id,
            type: 'vital' as const,
            severity: alert.severity as any,
            title: `Vital Sign Alert - ${alert.type}`,
            description: alert.message,
            timestamp: alert.timestamp,
            residentId: alert.residentId,
            acknowledged: alert.acknowledged
          })),
          ...fallDetectionData.immobilityAlerts.slice(0, 1).map(alert => ({
            id: alert.id,
            type: 'immobility' as const,
            severity: 'high' as const,
            title: `Immobility Alert - ${residents.find(r => r.id === alert.residentId)?.name || 'Unknown'}`,
            description: `No movement detected for ${alert.duration}`,
            timestamp: alert.startTime,
            residentId: alert.residentId,
            acknowledged: alert.resolved
          }))
        ];

        setSystemData({
          residents,
          ...vitalSignsData,
          ...fallDetectionData,
          systemStats,
          alertSummaries
        });
      } catch (error) {
        console.error('Error initializing WeCare Living data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh || !systemData) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate real-time updates
      if (Math.random() > 0.7) {
        setSystemData(prevData => {
          if (!prevData) return prevData;
          
          // Update system stats
          const updatedStats = {
            ...prevData.systemStats,
            uptime: Math.max(95, prevData.systemStats.uptime + (Math.random() - 0.5) * 0.1),
            batteryLevel: Math.max(20, prevData.systemStats.batteryLevel - 0.1),
            signalStrength: 85 + Math.random() * 15,
            lastUpdate: new Date()
          };

          return {
            ...prevData,
            systemStats: updatedStats
          };
        });
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, systemData]);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Re-initialize data
    if (systemData) {
      const residents = MockDataGenerator.generateResidents(12);
      const rooms = MockDataGenerator.generateRooms();
      const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);
      const fallDetectionData = MockDataGenerator.generateCompleteFallDetectionData(residents, rooms);
      
      setSystemData({
        ...systemData,
        residents,
        ...vitalSignsData,
        ...fallDetectionData
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">WeCare Living</h2>
          <p className="text-gray-600">Initializing comprehensive care monitoring system...</p>
        </div>
      </div>
    );
  }

  if (!systemData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">System Error</h2>
          <p className="text-gray-600 mb-4">Unable to load WeCare Living dashboard</p>
          <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const {
    residents,
    vitalSignsReadings,
    breathingPatterns,
    sleepSessions,
    vitalSignsAlerts,
    vitalSignsStats,
    residentProfiles,
    wellnessIndicators,
    fallEvents,
    riskAssessments,
    immobilityAlerts,
    emergencyResponses,
    fallDetectionStats,
    systemStats,
    alertSummaries
  } = systemData;

  const unacknowledgedAlerts = alertSummaries.filter(a => !a.acknowledged);
  const criticalAlerts = alertSummaries.filter(a => a.severity === 'critical');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">WeCare Living</h1>
                  <p className="text-sm text-gray-600">Comprehensive Elderly Care Monitoring System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Critical Alerts Banner */}
              <AnimatePresence>
                {criticalAlerts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Alert className="border-red-200 bg-red-50 py-3 px-4">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <AlertDescription className="text-red-800 font-medium">
                        {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* System Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    systemStats.systemStatus === 'active' ? 'bg-green-500' :
                    systemStats.systemStatus === 'warning' ? 'bg-yellow-500' :
                    systemStats.systemStatus === 'critical' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="text-sm font-medium capitalize">
                    {systemStats.systemStatus}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{systemStats.signalStrength}%</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{systemStats.batteryLevel}%</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {autoRefresh ? 'Pause' : 'Resume'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{systemStats.totalResidents} Residents</span>
                <span className="text-sm text-gray-500">({systemStats.activeResidents} active)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{systemStats.occupiedRooms} Rooms Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{vitalSignsStats.totalReadings} Vital Readings</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{fallDetectionStats.fallsDetected} Falls Detected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{systemStats.temperature}°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">Uptime: {systemStats.uptime}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Last Update:</span>
                <span className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <Badge variant={autoRefresh ? 'default' : 'secondary'} className="px-3 py-1">
              {autoRefresh ? 'LIVE' : 'PAUSED'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-11 h-14">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span className="font-medium">Overview</span>
              {unacknowledgedAlerts.length > 0 && (
                <Badge variant="destructive" className="text-xs ml-2">
                  {unacknowledgedAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="presence" className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Presence</span>
            </TabsTrigger>
            <TabsTrigger value="vital" className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Vital Signs</span>
              {vitalSignsAlerts.filter(a => !a.acknowledged).length > 0 && (
                <Badge variant="destructive" className="text-xs ml-2">
                  {vitalSignsAlerts.filter(a => !a.acknowledged).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="fall" className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Fall Detection</span>
              {fallEvents.filter(f => f.responseStatus === 'pending').length > 0 && (
                <Badge variant="destructive" className="text-xs ml-2">
                  {fallEvents.filter(f => f.responseStatus === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="caregivers" className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">Caregivers</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span className="font-medium">Room Zones</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="tiering" className="flex items-center space-x-2">
              <Crown className="w-5 h-5" />
              <span className="font-medium">Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="ruview" className="flex items-center space-x-2">
              <Wifi className="w-5 h-5" />
              <span className="font-medium">RuView</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Residents</p>
                        <p className="text-3xl font-bold">{systemStats.totalResidents}</p>
                        <p className="text-blue-100 text-sm mt-1">{systemStats.activeResidents} Active Now</p>
                      </div>
                      <Users className="w-10 h-10 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">System Health</p>
                        <p className="text-3xl font-bold">{systemStats.uptime.toFixed(1)}%</p>
                        <p className="text-green-100 text-sm mt-1">Uptime</p>
                      </div>
                      <CheckCircle className="w-10 h-10 text-green-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Active Alerts</p>
                        <p className="text-3xl font-bold">{unacknowledgedAlerts.length}</p>
                        <p className="text-orange-100 text-sm mt-1">{criticalAlerts.length} Critical</p>
                      </div>
                      <AlertTriangle className="w-10 h-10 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Data Quality</p>
                        <p className="text-3xl font-bold capitalize">{systemStats.dataQuality}</p>
                        <p className="text-purple-100 text-sm mt-1">{vitalSignsStats.totalReadings} Readings</p>
                      </div>
                      <Brain className="w-10 h-10 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Recent Alerts</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View All Alerts
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertSummaries.slice(0, 5).map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-gray-600 text-xs">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                        <Badge variant={alert.acknowledged ? 'secondary' : 'destructive'} className="text-xs">
                          {alert.acknowledged ? 'Acknowledged' : 'Pending'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>Mobile App</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Monitor residents on-the-go with our mobile app
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Smartphone className="w-4 h-4 mr-2" />
                        iOS
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Android
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Reports</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Generate comprehensive care reports
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>System Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Configure monitoring parameters and alerts
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="presence">
            <PresenceDashboard />
          </TabsContent>

          <TabsContent value="vital">
            <VitalSignsDashboard
              residents={residents}
              vitalSignsReadings={vitalSignsReadings}
              breathingPatterns={breathingPatterns}
              sleepSessions={sleepSessions}
              vitalSignsAlerts={vitalSignsAlerts}
              stats={vitalSignsStats}
              residentProfiles={residentProfiles}
              wellnessIndicators={wellnessIndicators}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="fall">
            <FallDetectionDashboard
              residents={residents}
              fallEvents={fallEvents}
              riskAssessments={riskAssessments}
              immobilityAlerts={immobilityAlerts}
              emergencyResponses={emergencyResponses}
              stats={fallDetectionStats}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="caregivers">
            <CaregiverDashboard residents={residents} />
          </TabsContent>

          <TabsContent value="rooms">
            <RoomVisualization residents={residents} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsInterface
              residents={residents}
              vitalSignsReadings={vitalSignsReadings}
              breathingPatterns={breathingPatterns}
              sleepSessions={sleepSessions}
              vitalSignsAlerts={vitalSignsAlerts}
              fallEvents={fallEvents}
              immobilityAlerts={immobilityAlerts}
              riskAssessments={riskAssessments}
            />
          </TabsContent>

          <TabsContent value="mobile">
            <MobileAppInterface
              residents={residents}
              vitalSignsReadings={vitalSignsReadings}
              breathingPatterns={breathingPatterns}
              sleepSessions={sleepSessions}
              vitalSignsAlerts={vitalSignsAlerts}
              fallEvents={fallEvents}
              immobilityAlerts={immobilityAlerts}
              riskAssessments={riskAssessments}
            />
          </TabsContent>

          <TabsContent value="tiering">
            <ProductTiering
              residents={residents}
              vitalSignsReadings={vitalSignsReadings}
              breathingPatterns={breathingPatterns}
              sleepSessions={sleepSessions}
              vitalSignsAlerts={vitalSignsAlerts}
              fallEvents={fallEvents}
              immobilityAlerts={immobilityAlerts}
              riskAssessments={riskAssessments}
            />
          </TabsContent>

          <TabsContent value="ruview">
            <RuViewIntegration
              residents={residents}
              vitalSignsReadings={vitalSignsReadings}
              breathingPatterns={breathingPatterns}
              sleepSessions={sleepSessions}
              vitalSignsAlerts={vitalSignsAlerts}
              fallEvents={fallEvents}
              immobilityAlerts={immobilityAlerts}
              riskAssessments={riskAssessments}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
                  <TabsTrigger value="anomaly">AI Anomaly Detection</TabsTrigger>
                  <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5" />
                        <span>System Analytics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{vitalSignsStats.totalReadings}</p>
                          <p className="text-sm text-gray-600">Total Vital Readings</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{fallDetectionStats.successfulInterventions}</p>
                          <p className="text-sm text-gray-600">Successful Interventions</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{fallDetectionStats.falseAlarms}</p>
                          <p className="text-sm text-gray-600">False Alarms</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{Math.round(fallDetectionStats.detectionAccuracy * 100)}%</p>
                          <p className="text-sm text-gray-600">Detection Accuracy</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional analytics components would go here */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resident Activity Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Advanced analytics and pattern recognition coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline">
                  <ActivityTimeline
                    residents={residents}
                    vitalSignsReadings={vitalSignsReadings}
                    breathingPatterns={breathingPatterns}
                    sleepSessions={sleepSessions}
                    vitalSignsAlerts={vitalSignsAlerts}
                    fallEvents={fallEvents}
                    immobilityAlerts={immobilityAlerts}
                    emergencyResponses={emergencyResponses}
                  />
                </TabsContent>

                <TabsContent value="anomaly">
                  <AIAnomalyDetection
                    residents={residents}
                    vitalSignsReadings={vitalSignsReadings}
                    breathingPatterns={breathingPatterns}
                    sleepSessions={sleepSessions}
                    vitalSignsAlerts={vitalSignsAlerts}
                    fallEvents={fallEvents}
                    immobilityAlerts={immobilityAlerts}
                    riskAssessments={riskAssessments}
                  />
                </TabsContent>

                <TabsContent value="patterns">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pattern Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">AI-powered pattern detection and anomaly analysis coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WeCareLivingDashboard;