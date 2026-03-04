'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Ambulance, 
  Clock, 
  MapPin, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Users,
  Activity,
  Heart,
  Brain,
  Timer,
  Shield,
  Zap,
  FileText,
  MessageSquare,
  Video,
  Radio,
  Bell,
  Play,
  Pause,
  RefreshCw,
  Send,
  UserCheck,
  Stethoscope,
  AlertCircle
} from 'lucide-react';

import type { EmergencyResponse, FallEvent } from '@/types/fallDetection';

interface EmergencyResponseWorkflowProps {
  emergencyResponses: EmergencyResponse[];
  fallEvents: FallEvent[];
  activeEmergencies?: EmergencyResponse[];
  onInitiateResponse?: (fallEventId: string) => void;
  onUpdateStatus?: (responseId: string, status: string) => void;
  onContactEmergency?: (responseId: string) => void;
  onAddNote?: (responseId: string, note: string) => void;
}

const EmergencyResponseWorkflow: React.FC<EmergencyResponseWorkflowProps> = ({
  emergencyResponses,
  fallEvents,
  activeEmergencies = [],
  onInitiateResponse,
  onUpdateStatus,
  onContactEmergency,
  onAddNote
}) => {
  const [selectedResponse, setSelectedResponse] = useState<EmergencyResponse | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workflowStep, setWorkflowStep] = useState<string>('detection');

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate response metrics
  const metrics = {
    activeResponses: activeEmergencies.length,
    averageResponseTime: emergencyResponses.length > 0 
      ? Math.round(emergencyResponses.reduce((acc, r) => acc + (r.responseTime || 0), 0) / emergencyResponses.length)
      : 0,
    todayResponses: emergencyResponses.filter(r => 
      new Date(r.triggeredAt).toDateString() === new Date().toDateString()
    ).length,
    criticalResponses: emergencyResponses.filter(r => {
      const fallEvent = fallEvents.find(f => f.id === r.fallEventId);
      return fallEvent?.severity === 'critical';
    }).length
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'no_injury': return 'text-green-600 bg-green-50';
      case 'minor_injury': return 'text-yellow-600 bg-yellow-50';
      case 'major_injury': return 'text-orange-600 bg-orange-50';
      case 'hospitalization': return 'text-red-600 bg-red-50';
      case 'fatal': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-red-600 bg-red-50';
      case 'acknowledged': return 'text-yellow-600 bg-yellow-50';
      case 'responding': return 'text-blue-600 bg-blue-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getWorkflowProgress = (response: EmergencyResponse) => {
    const steps = [
      { key: 'detection', label: 'Detection', completed: true, time: response.detectionTime },
      { key: 'notification', label: 'Notification', completed: !!response.notificationTime, time: response.notificationTime },
      { key: 'response', label: 'Response', completed: !!response.firstResponseTime, time: response.firstResponseTime },
      { key: 'arrival', label: 'Arrival', completed: !!response.arrivalTime, time: response.arrivalTime },
      { key: 'resolved', label: 'Resolved', completed: !!response.resolvedTime, time: response.resolvedTime }
    ];
    return steps;
  };

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || currentTime;
    const diff = endTime.getTime() - new Date(start).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Active Emergency Alert */}
      <AnimatePresence>
        {activeEmergencies.length > 0 && (
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
                    {activeEmergencies.length} active emergency response{activeEmergencies.length > 1 ? 's' : ''} in progress
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="destructive">
                      <Ambulance className="w-4 h-4 mr-2" />
                      Contact All
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="w-4 h-4 mr-2" />
                      Live View
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
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-xl font-bold text-red-600">{metrics.activeResponses}</p>
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
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-xl font-bold text-blue-600">{metrics.averageResponseTime}s</p>
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
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-xl font-bold text-green-600">{metrics.todayResponses}</p>
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
                <div className="p-2 bg-orange-100 rounded-full">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Critical</p>
                  <p className="text-xl font-bold text-orange-600">{metrics.criticalResponses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Active</span>
            {activeEmergencies.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {activeEmergencies.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Workflow</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Response Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeEmergencies.map((response, index) => {
            const fallEvent = fallEvents.find(f => f.id === response.fallEventId);
            const workflowSteps = getWorkflowProgress(response);
            
            return (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-red-200">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {fallEvent?.residentName || 'Unknown Resident'}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="destructive">Emergency</Badge>
                            <span className="text-sm text-gray-600">
                              {fallEvent?.roomName} • {fallEvent?.severity} fall
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Video className="w-4 h-4 mr-2" />
                          Camera
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Comms
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </div>
                    </div>

                    {/* Workflow Progress */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Response Progress</h4>
                      <div className="space-y-3">
                        {workflowSteps.map((step, stepIndex) => (
                          <div key={step.key} className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {step.completed ? <CheckCircle className="w-4 h-4" /> : stepIndex + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                                  {step.label}
                                </span>
                                {step.time && (
                                  <span className="text-sm text-gray-600">
                                    {step.time.toLocaleTimeString()}
                                  </span>
                                )}
                              </div>
                              {step.completed && step.time && (
                                <span className="text-xs text-gray-500">
                                  Duration: {formatDuration(step.time, stepIndex < workflowSteps.length - 1 ? workflowSteps[stepIndex + 1].time : undefined)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Response Team */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Primary Responder</span>
                        </div>
                        <p className="font-semibold">{response.primaryResponder}</p>
                        <p className="text-sm text-gray-600">
                          {response.firstResponseTime ? 
                            `Responded in ${response.responseTime}s` : 
                            'En route'
                          }
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Backup Team</span>
                        </div>
                        <p className="font-semibold">
                          {response.backupResponders.length > 0 ? 
                            response.backupResponders.join(', ') : 
                            'On standby'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Emergency Services */}
                    {response.emergencyServices.contacted && (
                      <div className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Ambulance className="w-4 h-4 text-red-600" />
                            <span className="font-medium">Emergency Services</span>
                            <Badge variant="outline" className="text-red-600">
                              {response.emergencyServices.serviceType}
                            </Badge>
                          </div>
                          <div className="text-right">
                            {response.emergencyServices.arrivalTime ? (
                              <span className="text-sm font-medium">
                                Arrived {response.emergencyServices.arrivalTime.toLocaleTimeString()}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-600">En route</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {activeEmergencies.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Emergencies</h3>
                <p className="text-gray-600">All emergency responses have been completed</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Emergency Workflow</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Fall Detection', desc: 'AI detects fall pattern', icon: Brain, time: '< 1s' },
                    { step: 2, title: 'Alert Notification', desc: 'Notify response team', icon: Bell, time: '< 5s' },
                    { step: 3, title: 'First Response', desc: 'Team acknowledges', icon: UserCheck, time: '< 2min' },
                    { step: 4, title: 'On-site Arrival', desc: 'Reach resident location', icon: MapPin, time: '< 5min' },
                    { step: 5, title: 'Medical Assessment', desc: 'Evaluate condition', icon: Stethoscope, time: '< 10min' },
                    { step: 6, title: 'Resolution', desc: 'Complete response', icon: CheckCircle, time: 'Variable' }
                  ].map((item, index) => (
                    <div key={item.step} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{item.title}</h4>
                          <span className="text-sm text-gray-600">{item.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="w-4 h-4" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Detection to Response</span>
                      <span className="text-sm font-bold">{metrics.averageResponseTime}s</span>
                    </div>
                    <Progress value={Math.min((metrics.averageResponseTime / 120) * 100, 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Response to Arrival</span>
                      <span className="text-sm font-bold">3.2min</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Total Resolution Time</span>
                      <span className="text-sm font-bold">8.5min</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">95%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">4.2</p>
                    <p className="text-sm text-gray-600">Avg Team Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {emergencyResponses.slice(0, 10).map((response, index) => {
            const fallEvent = fallEvents.find(f => f.id === response.fallEventId);
            
            return (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <div>
                          <h4 className="font-medium">
                            {fallEvent?.residentName || 'Unknown Resident'}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getOutcomeColor(response.outcome)}>
                              {response.outcome.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(response.triggeredAt).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600">
                              Response: {response.responseTime}s
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{response.primaryResponder}</p>
                        <p className="text-sm text-gray-600">
                          {response.medicalAssessment.injuries.length} injuries
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="team">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Response Team</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Dr. Sarah Johnson', role: 'Medical Lead', status: 'Available', avatar: 'SJ' },
                    { name: 'Nurse Michael Chen', role: 'Primary Responder', status: 'On Duty', avatar: 'MC' },
                    { name: 'Caregiver Emily Davis', role: 'Assistant', status: 'Available', avatar: 'ED' },
                    { name: 'Paramedic Tom Wilson', role: 'Emergency Services', status: 'Standby', avatar: 'TW' }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-blue-600">{member.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <Badge variant={member.status === 'Available' ? 'secondary' : 'default'}>
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Radio className="w-4 h-4" />
                  <span>Communication Channels</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Emergency Line</span>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Direct emergency response line</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Team Chat</span>
                      </div>
                      <Badge variant="secondary">5 Online</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Real-time team coordination</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Video Conference</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Video consultation with medical team</p>
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

export default EmergencyResponseWorkflow;