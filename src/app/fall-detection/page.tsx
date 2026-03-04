'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Phone, 
  Bell,
  Users,
  Clock,
  Heart,
  Brain,
  Zap,
  Eye,
  RefreshCw,
  Settings,
  Download,
  Play,
  Pause
} from 'lucide-react';

// Import fall detection components
import FallDetectionDashboard from '@/components/fallDetection/FallDetectionDashboard';
import FallEventTimeline from '@/components/fallDetection/FallEventTimeline';
import FallRiskAssessmentComponent from '@/components/fallDetection/FallRiskAssessment';
import EmergencyResponseWorkflow from '@/components/fallDetection/EmergencyResponseWorkflow';
import ImmobilityDetection from '@/components/fallDetection/ImmobilityDetection';
import CaregiverNotificationSystem from '@/components/fallDetection/CaregiverNotificationSystem';

// Import types and mock data
import { MockDataGenerator } from '@/lib/mockData';
import type { 
  FallEvent, 
  FallRiskAssessment, 
  ImmobilityAlert,
  EmergencyResponse,
  FallDetectionStats 
} from '@/types/fallDetection';
import { Resident } from '@/types/presence';

const FallDetectionMonitoringInterface: React.FC = () => {
  const [data, setData] = useState<{
    residents: Resident[];
    fallEvents: FallEvent[];
    riskAssessments: FallRiskAssessment[];
    immobilityAlerts: ImmobilityAlert[];
    emergencyResponses: EmergencyResponse[];
    stats: FallDetectionStats;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      try {
        const residents = MockDataGenerator.generateResidents(8);
        const rooms = MockDataGenerator.generateRooms();
        const fallDetectionData = MockDataGenerator.generateCompleteFallDetectionData(residents, rooms);
        
        setData({
          residents,
          ...fallDetectionData
        });
      } catch (error) {
        console.error('Error initializing fall detection data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh || !data) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate real-time updates
      if (Math.random() > 0.8) {
        setData(prevData => {
          if (!prevData) return prevData;
          
          // Update stats
          const updatedStats = {
            ...prevData.stats,
            activeAlerts: Math.max(0, prevData.stats.activeAlerts + (Math.random() > 0.5 ? 1 : -1)),
            fallsDetected: prevData.stats.fallsDetected + (Math.random() > 0.7 ? 1 : 0)
          };

          return {
            ...prevData,
            stats: updatedStats
          };
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, data]);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    if (data) {
      const residents = MockDataGenerator.generateResidents(8);
      const rooms = MockDataGenerator.generateRooms();
      const fallDetectionData = MockDataGenerator.generateCompleteFallDetectionData(residents, rooms);
      
      setData({
        residents,
        ...fallDetectionData
      });
    }
  };

  const handleEventSelect = (event: FallEvent) => {
    console.log('Selected fall event:', event);
  };

  const handleEmergencyCall = (event: FallEvent) => {
    console.log('Emergency call for event:', event);
  };

  const handleCheckResident = (alertId: string) => {
    console.log('Checking resident for alert:', alertId);
  };

  const handleEmergencyCallAlert = (alertId: string) => {
    console.log('Emergency call for alert:', alertId);
  };

  const handleAssessmentUpdate = (assessmentId: string) => {
    console.log('Updating assessment:', assessmentId);
  };

  const handleExportReport = (assessmentId: string) => {
    console.log('Exporting report for assessment:', assessmentId);
  };

  const handleInitiateResponse = (fallEventId: string) => {
    console.log('Initiating response for fall:', fallEventId);
  };

  const handleUpdateStatus = (responseId: string, status: string) => {
    console.log('Updating response status:', responseId, status);
  };

  const handleContactEmergency = (responseId: string) => {
    console.log('Contacting emergency services for:', responseId);
  };

  const handleAddNote = (responseId: string, note: string) => {
    console.log('Adding note to response:', responseId, note);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">Loading Fall Detection System...</h2>
          <p className="text-gray-500 mt-2">Initializing WeCare Living monitoring interface</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">System Error</h2>
          <p className="text-gray-500 mt-2">Unable to load fall detection data</p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { residents, fallEvents, riskAssessments, immobilityAlerts, emergencyResponses, stats } = data;
  const criticalAlerts = fallEvents.filter(f => f.severity === 'critical' && f.responseStatus === 'pending');
  const activeImmobilityAlerts = immobilityAlerts.filter(a => !a.resolved);
  const activeEmergencies = emergencyResponses.filter(r => 
    fallEvents.find(f => f.id === r.fallEventId)?.responseStatus === 'responding'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">WeCare Living</h1>
                  <p className="text-sm text-gray-500">Fall Detection Monitoring System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Critical Alerts Banner */}
              <AnimatePresence>
                {(criticalAlerts.length > 0 || activeImmobilityAlerts.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Alert className="border-red-200 bg-red-50 py-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 text-sm">
                        {criticalAlerts.length > 0 && `${criticalAlerts.length} critical fall${criticalAlerts.length > 1 ? 's' : ''}`}
                        {criticalAlerts.length > 0 && activeImmobilityAlerts.length > 0 && ' • '}
                        {activeImmobilityAlerts.length > 0 && `${activeImmobilityAlerts.length} immobility alert${activeImmobilityAlerts.length > 1 ? 's' : ''}`}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

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
        </div>
      </div>

      {/* System Status Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${stats.systemStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">System Status: {stats.systemStatus}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{stats.residentsMonitored} Residents Monitored</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Detection Accuracy: {Math.round(stats.detectionAccuracy * 100)}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Last Update: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <Badge variant={autoRefresh ? 'default' : 'secondary'}>
              {autoRefresh ? 'Live' : 'Paused'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Timeline</span>
              {fallEvents.filter(f => f.responseStatus === 'pending').length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {fallEvents.filter(f => f.responseStatus === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Risk Assessment</span>
            </TabsTrigger>
            <TabsTrigger value="immobility" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Immobility</span>
              {activeImmobilityAlerts.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {activeImmobilityAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Emergency</span>
              {activeEmergencies.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {activeEmergencies.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {criticalAlerts.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {criticalAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <FallDetectionDashboard
              residents={residents}
              fallEvents={fallEvents}
              riskAssessments={riskAssessments}
              immobilityAlerts={immobilityAlerts}
              emergencyResponses={emergencyResponses}
              stats={stats}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <FallEventTimeline
              fallEvents={fallEvents}
              onEventSelect={handleEventSelect}
              onEmergencyCall={handleEmergencyCall}
            />
          </TabsContent>

          <TabsContent value="risk">
            <FallRiskAssessmentComponent
              riskAssessments={riskAssessments}
              onAssessmentUpdate={handleAssessmentUpdate}
              onExportReport={handleExportReport}
            />
          </TabsContent>

          <TabsContent value="immobility">
            <ImmobilityDetection
              immobilityAlerts={immobilityAlerts}
              onCheckResident={handleCheckResident}
              onEmergencyCall={handleEmergencyCallAlert}
              onAcknowledge={handleAlertId => console.log('Acknowledging alert:', alertId)}
            />
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyResponseWorkflow
              emergencyResponses={emergencyResponses}
              fallEvents={fallEvents}
              activeEmergencies={activeEmergencies}
              onInitiateResponse={handleInitiateResponse}
              onUpdateStatus={handleUpdateStatus}
              onContactEmergency={handleContactEmergency}
              onAddNote={handleAddNote}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <CaregiverNotificationSystem
              fallEvents={fallEvents}
              immobilityAlerts={immobilityAlerts}
              onNotificationSend={(notification) => console.log('Notification sent:', notification)}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Analytics Header */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Fall Detection Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats.fallsDetected}</p>
                      <p className="text-sm text-gray-600">Falls (24h)</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.successfulInterventions}</p>
                      <p className="text-sm text-gray-600">Interventions</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{stats.falseAlarms}</p>
                      <p className="text-sm text-gray-600">False Alarms</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{Math.round(stats.averageResponseTime)}s</p>
                      <p className="text-sm text-gray-600">Avg Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pattern Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fall Pattern Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Weekly Trend</span>
                        <div className="flex items-center space-x-2">
                          {stats.weeklyTrend === 'increasing' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {stats.weeklyTrend === 'decreasing' && <Activity className="w-4 h-4 text-green-500" />}
                          {stats.weeklyTrend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                          <span className="text-sm font-medium">{stats.weeklyTrend}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Monthly Trend</span>
                        <div className="flex items-center space-x-2">
                          {stats.monthlyTrend === 'increasing' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {stats.monthlyTrend === 'decreasing' && <Activity className="w-4 h-4 text-green-500" />}
                          {stats.monthlyTrend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                          <span className="text-sm font-medium">{stats.monthlyTrend}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.riskLevelDistribution).map(([level, count]) => (
                        <div key={level} className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{level}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  level === 'critical' ? 'bg-red-500' :
                                  level === 'high' ? 'bg-orange-500' :
                                  level === 'medium' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${(count / residents.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FallDetectionMonitoringInterface;