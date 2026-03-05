'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Activity, 
  Users, 
  Clock, 
  Shield, 
  TrendingUp,
  Phone,
  MapPin,
  Heart,
  Brain,
  Eye,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  RefreshCw
} from 'lucide-react';

import type { 
  FallEvent, 
  FallRiskAssessment, 
  ImmobilityAlert,
  EmergencyResponse,
  FallDetectionStats 
} from '@/types/fallDetection';
import { Resident } from '@/types/presence';

interface FallDetectionDashboardProps {
  residents: Resident[];
  fallEvents: FallEvent[];
  riskAssessments: FallRiskAssessment[];
  immobilityAlerts: ImmobilityAlert[];
  emergencyResponses: EmergencyResponse[];
  stats: FallDetectionStats;
  onRefresh?: () => void;
}

const FallDetectionDashboard: React.FC<FallDetectionDashboardProps> = ({
  residents,
  fallEvents,
  riskAssessments,
  immobilityAlerts,
  emergencyResponses,
  stats,
  onRefresh
}) => {
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<ImmobilityAlert[]>([]);

  // Filter active immobility alerts
  useEffect(() => {
    setActiveAlerts(immobilityAlerts.filter(alert => !alert.resolved));
  }, [immobilityAlerts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      onRefresh?.();
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate metrics
  const criticalFalls = fallEvents.filter(f => f.severity === 'critical' && f.responseStatus === 'pending');
  const highRiskResidents = residents.filter(r => (r.fallRiskScore || 0) > 70);
  const recentFalls = fallEvents.filter(f => 
    new Date(f.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
  );
  const averageResponseTime = emergencyResponses.length > 0 
    ? emergencyResponses.reduce((acc, r) => acc + (r.responseTime || 0), 0) / emergencyResponses.length 
    : 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      <AnimatePresence>
        {(criticalFalls.length > 0 || activeAlerts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <span>
                    {criticalFalls.length > 0 && `${criticalFalls.length} critical fall${criticalFalls.length > 1 ? 's' : ''} requiring immediate attention`}
                    {criticalFalls.length > 0 && activeAlerts.length > 0 && ' • '}
                    {activeAlerts.length > 0 && `${activeAlerts.length} active immobility alert${activeAlerts.length > 1 ? 's' : ''}`}
                  </span>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    className="ml-4"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Response
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{criticalFalls.length + activeAlerts.length}</p>
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
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">High Risk Residents</p>
                  <p className="text-2xl font-bold text-orange-600">{highRiskResidents.length}</p>
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
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(averageResponseTime)}s
                  </p>
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
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Detection Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((stats?.detectionAccuracy || 0.95) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="falls" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Fall Events</span>
              {fallEvents.filter(f => f.responseStatus === 'pending').length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {fallEvents.filter(f => f.responseStatus === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Risk Assessment</span>
            </TabsTrigger>
            <TabsTrigger value="immobility" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Immobility</span>
              {activeAlerts.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {activeAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="response" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Fall Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Recent Fall Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFalls.slice(0, 5).map((fall, index) => (
                    <motion.div
                      key={fall.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(fall.severity)}`} />
                        <div>
                          <p className="font-medium">{fall.residentName}</p>
                          <p className="text-sm text-gray-600">{fall.roomName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(fall.timestamp).toLocaleTimeString()}
                        </p>
                        <Badge variant={fall.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {fall.severity}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                  {recentFalls.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent fall events</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* High Risk Residents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>High Risk Residents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {highRiskResidents.slice(0, 5).map((resident, index) => (
                    <motion.div
                      key={resident.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{resident.name}</p>
                          <p className="text-sm text-gray-600">{resident.roomName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getRiskLevelColor(resident.fallRiskScore || 0)}>
                          {resident.fallRiskScore}% Risk
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {resident.fallCount || 0} falls/30d
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {highRiskResidents.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No high risk residents</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>System Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Detection Accuracy</span>
                    <span className="text-sm font-medium">{Math.round((stats?.detectionAccuracy || 0.95) * 100)}%</span>
                  </div>
                  <Progress value={(stats?.detectionAccuracy || 0.95) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">False Alarm Rate</span>
                    <span className="text-sm font-medium">{Math.round((stats?.falseAlarmRate || 0.05) * 100)}%</span>
                  </div>
                  <Progress value={(stats?.falseAlarmRate || 0.05) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">System Uptime</span>
                    <span className="text-sm font-medium">{(stats?.systemUptime || 95).toFixed(1)}%</span>
                  </div>
                  <Progress value={stats?.systemUptime || 95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="falls">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>All Fall Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fallEvents.map((fall, index) => (
                  <motion.div
                    key={fall.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      fall.severity === 'critical' ? 'border-red-200 bg-red-50' :
                      fall.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                      fall.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${getSeverityColor(fall.severity)}`} />
                        <div>
                          <p className="font-semibold">{fall.residentName}</p>
                          <p className="text-sm text-gray-600">
                            {fall.roomName} • {fall.preFallActivity} • {fall.fallType} fall
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(fall.timestamp).toLocaleString()} • Confidence: {Math.round(fall.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={fall.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {fall.severity}
                          </Badge>
                          {fall.responseStatus === 'pending' && (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Pending
                            </Badge>
                          )}
                        </div>
                        {fall.responseTime && (
                          <p className="text-xs text-gray-600">
                            Response: {fall.responseTime}s
                          </p>
                        )}
                        {fall.postFallImmobility.detected && (
                          <div className="flex items-center space-x-1 text-xs text-orange-600">
                            <Heart className="w-3 h-3" />
                            <span>Immobility: {fall.postFallImmobility.duration}s</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Fall Risk Assessments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskAssessments.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{assessment.residentName}</h3>
                        <p className="text-sm text-gray-600">
                          Last reviewed: {new Date(assessment.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getRiskLevelColor(assessment.overallRiskScore)}>
                          {assessment.overallRiskScore}% Risk
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Next review: {new Date(assessment.reviewDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <Eye className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <p className="text-xs text-gray-600">Vision</p>
                        <p className="font-semibold">{assessment.riskFactors.visionProblems}/10</p>
                      </div>
                      <div className="text-center">
                        <Brain className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <p className="text-xs text-gray-600">Cognitive</p>
                        <p className="font-semibold">{assessment.riskFactors.cognitiveImpairment}/10</p>
                      </div>
                      <div className="text-center">
                        <Zap className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <p className="text-xs text-gray-600">Mobility</p>
                        <p className="font-semibold">{assessment.riskFactors.mobilityIssues}/10</p>
                      </div>
                      <div className="text-center">
                        <Activity className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <p className="text-xs text-gray-600">Balance</p>
                        <p className="font-semibold">{assessment.movementPatterns.balanceIssues}/10</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Top Recommendations:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {assessment.recommendations.slice(0, 3).map((rec, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="immobility">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Immobility Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {immobilityAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      !alert.resolved ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          !alert.resolved ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <p className="font-semibold">{alert.residentName}</p>
                          <p className="text-sm text-gray-600">
                            {alert.roomName} • {alert.expectedActivity}
                          </p>
                          <p className="text-xs text-gray-500">
                            Duration: {Math.round(alert.duration / 60)}m {alert.duration % 60}s
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={!alert.resolved ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                          {!alert.resolved && (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Active
                            </Badge>
                          )}
                        </div>
                        {alert.breathingDetected && (
                          <div className="flex items-center space-x-1 text-xs text-green-600">
                            <Heart className="w-3 h-3" />
                            <span>Breathing detected</span>
                          </div>
                        )}
                        {alert.responseRequired && !alert.resolved && (
                          <Button size="sm" variant="destructive">
                            <Phone className="w-3 h-3 mr-1" />
                            Check Resident
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Emergency Response History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyResponses.map((response, index) => (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold">{response.primaryResponder}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(response.triggeredAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          response.outcome === 'no_injury' ? 'secondary' :
                          response.outcome === 'minor_injury' ? 'default' :
                          response.outcome === 'major_injury' ? 'destructive' :
                          'destructive'
                        }>
                          {response.outcome.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Detection</p>
                        <p className="font-medium">{response.detectionTime.toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Response</p>
                        <p className="font-medium">
                          {response.firstResponseTime?.toLocaleTimeString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Arrival</p>
                        <p className="font-medium">
                          {response.arrivalTime?.toLocaleTimeString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Response Time</p>
                        <p className="font-medium">{response.responseTime}s</p>
                      </div>
                    </div>

                    {response.medicalAssessment.injuries.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Injuries:</p>
                        <div className="flex flex-wrap gap-2">
                          {response.medicalAssessment.injuries.map((injury, i) => (
                            <Badge key={i} variant="outline">{injury}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fall Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Fall Pattern Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats?.fallsDetected || 0}</p>
                      <p className="text-sm text-gray-600">Falls (24h)</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats?.successfulInterventions || 0}</p>
                      <p className="text-sm text-gray-600">Interventions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Weekly Trend</span>
                      <div className="flex items-center space-x-2">
                        {(stats?.weeklyTrend === 'increasing') && <TrendingUp className="w-4 h-4 text-red-500" />}
                        {(stats?.weeklyTrend === 'decreasing') && <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />}
                        {(stats?.weeklyTrend === 'stable') && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                        <span className="text-sm font-medium">{stats?.weeklyTrend || 'stable'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Trend</span>
                      <div className="flex items-center space-x-2">
                        {(stats?.monthlyTrend === 'increasing') && <TrendingUp className="w-4 h-4 text-red-500" />}
                        {(stats?.monthlyTrend === 'decreasing') && <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />}
                        {(stats?.monthlyTrend === 'stable') && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                        <span className="text-sm font-medium">{stats?.monthlyTrend || 'stable'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Risk Level Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats?.riskLevelDistribution || {}).map(([level, count]) => (
                    <div key={level} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">{level}</span>
                        <span className="text-sm text-gray-600">{count} residents</span>
                      </div>
                      <Progress 
                        value={(count / residents.length) * 100} 
                        className={`h-2 ${
                          level === 'critical' ? 'bg-red-100' :
                          level === 'high' ? 'bg-orange-100' :
                          level === 'medium' ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FallDetectionDashboard;