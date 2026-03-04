'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  Phone, 
  Clock, 
  MapPin, 
  User, 
  Brain,
  Wind,
  Thermometer,
  Timer,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Zap,
  TrendingUp,
  Users,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';

import type { ImmobilityAlert } from '@/types/fallDetection';

interface ImmobilityDetectionProps {
  immobilityAlerts: ImmobilityAlert[];
  onCheckResident?: (alertId: string) => void;
  onEmergencyCall?: (alertId: string) => void;
  onAcknowledge?: (alertId: string) => void;
}

const ImmobilityDetection: React.FC<ImmobilityDetectionProps> = ({
  immobilityAlerts,
  onCheckResident,
  onEmergencyCall,
  onAcknowledge
}) => {
  const [selectedAlert, setSelectedAlert] = useState<ImmobilityAlert | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Update current time for duration calculations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate active and resolved alerts
  const { activeAlerts, resolvedAlerts, criticalAlerts } = useMemo(() => {
    const active = immobilityAlerts.filter(alert => !alert.resolved);
    const resolved = immobilityAlerts.filter(alert => alert.resolved);
    const critical = active.filter(alert => alert.severity === 'critical');
    
    return { activeAlerts: active, resolvedAlerts: resolved, criticalAlerts: critical };
  }, [immobilityAlerts]);

  // Calculate duration for active alerts
  const getDuration = (startTime: Date) => {
    const diff = currentTime.getTime() - new Date(startTime).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { minutes, seconds, totalSeconds: Math.floor(diff / 1000) };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImmobilityLevel = (level: number) => {
    if (level >= 0.9) return { text: 'Very High', color: 'red' };
    if (level >= 0.7) return { text: 'High', color: 'orange' };
    if (level >= 0.5) return { text: 'Medium', color: 'yellow' };
    return { text: 'Low', color: 'blue' };
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

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
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {criticalAlerts.length} critical immobility alert{criticalAlerts.length > 1 ? 's' : ''} requiring immediate attention
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => criticalAlerts.forEach(alert => onEmergencyCall?.(alert.id))}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Emergency All
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                  <p className="text-xl font-bold text-red-600">{activeAlerts.length}</p>
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
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Critical</p>
                  <p className="text-xl font-bold text-orange-600">{criticalAlerts.length}</p>
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
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                  <p className="text-xl font-bold text-green-600">
                    {resolvedAlerts.filter(r => 
                      new Date(r.resolvedAt!).toDateString() === new Date().toDateString()
                    ).length}
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
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Duration</p>
                  <p className="text-xl font-bold text-blue-600">
                    {activeAlerts.length > 0 
                      ? formatDuration(Math.round(
                          activeAlerts.reduce((acc, alert) => 
                            acc + getDuration(alert.startTime).totalSeconds, 0
                          ) / activeAlerts.length
                        ))
                      : '0s'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Active Alerts</span>
              {activeAlerts.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {activeAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Resolved</span>
              <Badge variant="secondary" className="text-xs">
                {resolvedAlerts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Monitoring</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {autoRefresh ? 'Pause' : 'Resume'}
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <AnimatePresence>
            {activeAlerts.map((alert, index) => {
              const duration = getDuration(alert.startTime);
              const immobilityLevel = getImmobilityLevel(alert.immobilityLevel);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-l-4 ${
                    alert.severity === 'critical' ? 'border-l-red-500' :
                    alert.severity === 'high' ? 'border-l-orange-500' :
                    alert.severity === 'medium' ? 'border-l-yellow-500' :
                    'border-l-blue-500'
                  }`}>
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500' :
                            alert.severity === 'high' ? 'bg-orange-500' :
                            alert.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          } animate-pulse`}></div>
                          <div>
                            <h3 className="text-lg font-semibold">{alert.residentName}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              <Badge variant="outline">
                                {immobilityLevel.text} Immobility
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {alert.roomName} • {alert.expectedActivity}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">
                            {formatDuration(duration.totalSeconds)}
                          </div>
                          <p className="text-sm text-gray-600">Duration</p>
                        </div>
                      </div>

                      {/* Progress bar for duration */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Immobility Duration</span>
                          <span>{Math.min(duration.totalSeconds, 600)}s / 10min</span>
                        </div>
                        <Progress 
                          value={Math.min((duration.totalSeconds / 600) * 100, 100)} 
                          className={`h-2 ${
                            duration.totalSeconds > 300 ? 'bg-red-100' :
                            duration.totalSeconds > 180 ? 'bg-orange-100' :
                            'bg-blue-100'
                          }`}
                        />
                      </div>

                      {/* Vital Signs */}
                      {alert.vitalSigns && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                            <Heart className="w-4 h-4 text-red-600" />
                            <div>
                              <p className="text-xs text-gray-600">Heart Rate</p>
                              <p className="font-semibold">{alert.vitalSigns.heartRate} bpm</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                            <Wind className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-600">Respiration</p>
                              <p className="font-semibold">{alert.vitalSigns.respiration} /min</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                            <Activity className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-600">Movement</p>
                              <p className="font-semibold">{alert.vitalSigns.movement}%</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-600">Breathing</p>
                              <p className="font-semibold">
                                {alert.breathingDetected ? 'Detected' : 'Not Detected'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Started at {alert.startTime.toLocaleTimeString()}</span>
                          {alert.lastMovement && (
                            <>
                              <span>•</span>
                              <span>Last movement: {alert.lastMovement.toLocaleTimeString()}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCheckResident?.(alert.id)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Check Resident
                          </Button>
                          {alert.responseRequired && (
                            <Button
                              size="sm"
                              variant={alert.severity === 'critical' ? 'destructive' : 'default'}
                              onClick={() => onEmergencyCall?.(alert.id)}
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              {alert.severity === 'critical' ? 'Emergency' : 'Contact'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {activeAlerts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Immobility Alerts</h3>
                <p className="text-gray-600">All residents are showing normal movement patterns</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <div>
                        <h4 className="font-medium">{alert.residentName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">{alert.severity}</Badge>
                          <span className="text-sm text-gray-600">{alert.roomName}</span>
                          <span className="text-sm text-gray-600">
                            Duration: {formatDuration(alert.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {alert.resolution?.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.resolvedAt?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {resolvedAlerts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Resolved Alerts</h3>
                <p className="text-gray-600">No immobility alerts have been resolved yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monitoring Status</span>
                  <Badge className={autoRefresh ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'}>
                    {autoRefresh ? 'Active' : 'Paused'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Residents Monitored</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Detection Sensitivity</span>
                  <span className="font-medium">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Update</span>
                  <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Alert Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Today's Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {activeAlerts.length}
                    </p>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {resolvedAlerts.filter(r => 
                        new Date(r.resolvedAt!).toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                    <p className="text-sm text-gray-600">Resolved Today</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Response Time</span>
                    <span className="font-medium">2.5 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">False Alarm Rate</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">System Accuracy</span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImmobilityDetection;