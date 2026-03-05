'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  Bell,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Settings,
  Download,
  RefreshCw,
  Moon,
  Wind,
  Shield,
  Pause,
  Play,
  Lungs
} from 'lucide-react';

// Import components
import BreathingRateMonitor from './BreathingRateMonitor';
import HeartRateMonitor from './HeartRateMonitor';
import SleepTracking from './SleepTracking';
import IrregularBreathingDetection from './IrregularBreathingDetection';

// Import types and mock data
import { 
  VitalSignsReading,
  BreathingPattern,
  SleepSession,
  VitalSignsAlert,
  VitalSignsStats,
  ResidentVitalProfile,
  WellnessIndicator
} from '@/types/vitalSigns';
import { MockDataGenerator } from '@/lib/mockData';
import { Resident } from '@/types/presence';

interface VitalSignsDashboardProps {
  residents: Resident[];
  vitalSignsReadings: VitalSignsReading[];
  breathingPatterns: BreathingPattern[];
  sleepSessions: SleepSession[];
  vitalSignsAlerts: VitalSignsAlert[];
  stats: VitalSignsStats;
  residentProfiles: ResidentVitalProfile[];
  wellnessIndicators: WellnessIndicator[];
  onRefresh?: () => void;
}

const VitalSignsDashboard: React.FC<VitalSignsDashboardProps> = ({
  residents,
  vitalSignsReadings,
  breathingPatterns,
  sleepSessions,
  vitalSignsAlerts,
  stats,
  residentProfiles,
  wellnessIndicators,
  onRefresh
}) => {
  const [selectedResident, setSelectedResident] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Get current readings for each resident
  const getCurrentReading = (residentId: string): VitalSignsReading | undefined => {
    return vitalSignsReadings.find(reading => 
      reading.residentId === residentId
    );
  };

  // Get resident profile
  const getResidentProfile = (residentId: string): ResidentVitalProfile | undefined => {
    return residentProfiles.find(profile => profile.residentId === residentId);
  };

  // Get wellness indicator
  const getWellnessIndicator = (residentId: string): WellnessIndicator | undefined => {
    return wellnessIndicators.find(indicator => indicator.residentId === residentId);
  };

  // Calculate trends
  const calculateTrend = (readings: VitalSignsReading[]): 'up' | 'down' | 'stable' => {
    if (readings.length < 2) return 'stable';
    
    const recent = readings.slice(0, 5);
    const older = readings.slice(5, 10);
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, r) => sum + r.breathingRate, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.breathingRate, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    if (Math.abs(diff) < 1) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      onRefresh?.();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  const criticalAlerts = vitalSignsAlerts.filter(alert => 
    alert.severity === 'critical' && !alert.acknowledged
  );
  const activeAlerts = vitalSignsAlerts.filter(alert => !alert.acknowledged);

  const handleAcknowledgeAlert = (alertId: string) => {
    console.log('Acknowledging alert:', alertId);
    // In a real app, this would call an API
  };

  // Get the selected resident's data or the first resident
  const displayResidentId = selectedResident || residents[0]?.id || '';
  const currentReading = getCurrentReading(displayResidentId);
  const residentProfile = getResidentProfile(displayResidentId);
  const wellnessIndicator = getWellnessIndicator(displayResidentId);
  const residentSleepSessions = sleepSessions.filter(session => 
    session.residentId === displayResidentId
  );
  const residentBreathingPatterns = breathingPatterns.filter(pattern => 
    pattern.residentId === displayResidentId
  );
  const residentAlerts = vitalSignsAlerts.filter(alert => 
    alert.residentId === displayResidentId
  );

  const breathingTrend = calculateTrend(vitalSignsReadings.filter(r => r.residentId === displayResidentId));
  const heartTrend = calculateTrend(vitalSignsReadings.filter(r => r.residentId === displayResidentId));

  if (!currentReading) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Vital Signs Data</h3>
        <p className="text-gray-600">No vital signs readings available for monitoring.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      <AnimatePresence>
        {criticalAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {criticalAlerts.length} critical vital sign{criticalAlerts.length > 1 ? 's' : ''} require immediate attention
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Vital Signs Monitoring</h2>
              <p className="text-sm text-gray-500">Real-time wellness tracking for caregivers</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>{stats.residentsMonitored} Residents</span>
            <span>•</span>
            <span>{activeAlerts.length} Active Alerts</span>
            <span>•</span>
            <span>Last: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {autoRefresh ? 'Pause' : 'Resume'}
            </Button>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center space-x-2">
            <Lungs className="w-4 h-4" />
            <span>Breathing</span>
            {residentBreathingPatterns.filter(p => p.severity !== 'normal').length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {residentBreathingPatterns.filter(p => p.severity !== 'normal').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="heart" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Heart Rate</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center space-x-2">
            <Moon className="w-4 h-4" />
            <span>Sleep</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Alerts</span>
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="wellness" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Wellness</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BreathingRateMonitor
              currentReading={currentReading}
              residentProfile={residentProfile}
              trend={breathingTrend}
              showDetails={true}
            />
            <HeartRateMonitor
              currentReading={currentReading}
              residentProfile={residentProfile}
              trend={heartTrend}
              showDetails={true}
            />
            <SleepTracking
              sleepSessions={residentSleepSessions}
              currentSession={residentSleepSessions.find(s => !s.endTime)}
              showDetails={true}
            />
            <IrregularBreathingDetection
              breathingPatterns={residentBreathingPatterns}
              alerts={residentAlerts}
              showDetails={true}
              onAcknowledgeAlert={handleAcknowledgeAlert}
            />
          </div>
        </TabsContent>

        <TabsContent value="breathing">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BreathingRateMonitor
                currentReading={currentReading}
                residentProfile={residentProfile}
                trend={breathingTrend}
                showDetails={true}
              />
            </div>
            <IrregularBreathingDetection
              breathingPatterns={residentBreathingPatterns}
              alerts={residentAlerts.filter(a => a.type === 'breathing_rate' || a.type === 'irregular_breathing')}
              showDetails={true}
              onAcknowledgeAlert={handleAcknowledgeAlert}
            />
          </div>
        </TabsContent>

        <TabsContent value="heart">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HeartRateMonitor
              currentReading={currentReading}
              residentProfile={residentProfile}
              trend={heartTrend}
              showDetails={true}
            />
            {/* Additional heart rate analytics could go here */}
          </div>
        </TabsContent>

        <TabsContent value="sleep">
          <SleepTracking
            sleepSessions={residentSleepSessions}
            currentSession={residentSleepSessions.find(s => !s.endTime)}
            showDetails={true}
          />
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
                  <p className="text-gray-600">All vital signs are within normal ranges.</p>
                </CardContent>
              </Card>
            ) : (
              activeAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'high' ? 'border-l-orange-500' :
                  alert.severity === 'medium' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{alert.message}</p>
                        <div className="text-sm text-gray-500">
                          {alert.timestamp.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="wellness">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wellnessIndicators.map((indicator) => (
              <Card key={indicator.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Wellness Score</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        indicator.overall === 'excellent' ? 'bg-green-500' :
                        indicator.overall === 'good' ? 'bg-blue-500' :
                        indicator.overall === 'fair' ? 'bg-yellow-500' :
                        indicator.overall === 'poor' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`} />
                      <Badge variant="outline">{indicator.score}/100</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overall Status</span>
                      <Badge className={getWellnessColor(indicator.overall)}>
                        {indicator.overall}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Breathing:</span>
                        <div className="font-medium capitalize">{indicator.breathing}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Heart:</span>
                        <div className="font-medium capitalize">{indicator.heart}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Sleep:</span>
                        <div className="font-medium capitalize">{indicator.sleep}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Activity:</span>
                        <div className="font-medium capitalize">{indicator.activity}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function for wellness colors
const getWellnessColor = (status: string): string => {
  switch (status) {
    case 'excellent': return 'bg-green-500';
    case 'good': return 'bg-blue-500';
    case 'fair': return 'bg-yellow-500';
    case 'poor': return 'bg-orange-500';
    case 'critical': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export default VitalSignsDashboard;