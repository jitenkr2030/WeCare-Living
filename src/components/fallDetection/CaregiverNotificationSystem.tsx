'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Phone, 
  MessageSquare, 
  Mail, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  User,
  Settings,
  Send,
  Volume2,
  VolumeX,
  Smartphone,
  Radio,
  Eye,
  Filter,
  Search,
  Calendar,
  MapPin,
  Zap,
  RefreshCw
} from 'lucide-react';

import type { FallEvent, ImmobilityAlert } from '@/types/fallDetection';

interface Caregiver {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  department: string;
  onDuty: boolean;
  lastActive: Date;
  notificationPreferences: {
    phone: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
    criticalOnly: boolean;
  };
}

interface Notification {
  id: string;
  type: 'fall' | 'immobility' | 'system' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  recipientId: string;
  recipientName: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  method: 'phone' | 'email' | 'sms' | 'push' | 'in_app';
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed';
  responseRequired: boolean;
  responded: boolean;
  metadata?: {
    fallEventId?: string;
    immobilityAlertId?: string;
    location?: string;
    residentName?: string;
  };
}

interface NotificationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: {
    eventType: 'fall' | 'immobility' | 'system';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    conditions?: string[];
  };
  recipients: string[];
  methods: ('phone' | 'email' | 'sms' | 'push')[];
  escalation: {
    enabled: boolean;
    delay: number; // minutes
    escalateTo: string[];
  };
  schedule: {
    active: boolean;
    startTime: string;
    endTime: string;
    days: number[]; // 0-6, Sunday = 0
  };
}

interface CaregiverNotificationSystemProps {
  fallEvents: FallEvent[];
  immobilityAlerts: ImmobilityAlert[];
  onNotificationSend?: (notification: Notification) => void;
}

const CaregiverNotificationSystem: React.FC<CaregiverNotificationSystemProps> = ({
  fallEvents,
  immobilityAlerts,
  onNotificationSend
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [selectedTab, setSelectedTab] = useState('notifications');
  const [filter, setFilter] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    recipient: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize mock data
  useEffect(() => {
    const mockCaregivers: Caregiver[] = [
      {
        id: 'cg-1',
        name: 'Sarah Johnson',
        role: 'Lead Nurse',
        phone: '+1-555-0123',
        email: 'sarah.j@wecare.com',
        department: 'Medical',
        onDuty: true,
        lastActive: new Date(Date.now() - 10 * 60 * 1000),
        notificationPreferences: {
          phone: true,
          email: true,
          sms: true,
          push: true,
          criticalOnly: false
        }
      },
      {
        id: 'cg-2',
        name: 'Michael Chen',
        role: 'Caregiver',
        phone: '+1-555-0124',
        email: 'michael.c@wecare.com',
        department: 'Care',
        onDuty: true,
        lastActive: new Date(Date.now() - 5 * 60 * 1000),
        notificationPreferences: {
          phone: true,
          email: false,
          sms: true,
          push: true,
          criticalOnly: true
        }
      },
      {
        id: 'cg-3',
        name: 'Emily Davis',
        role: 'Medical Assistant',
        phone: '+1-555-0125',
        email: 'emily.d@wecare.com',
        department: 'Medical',
        onDuty: false,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        notificationPreferences: {
          phone: false,
          email: true,
          sms: false,
          push: true,
          criticalOnly: false
        }
      },
      {
        id: 'cg-4',
        name: 'Robert Wilson',
        role: 'Emergency Responder',
        phone: '+1-555-0126',
        email: 'robert.w@wecare.com',
        department: 'Emergency',
        onDuty: true,
        lastActive: new Date(Date.now() - 15 * 60 * 1000),
        notificationPreferences: {
          phone: true,
          email: true,
          sms: true,
          push: true,
          criticalOnly: false
        }
      }
    ];

    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'fall',
        priority: 'critical',
        title: 'Critical Fall Detected',
        message: 'John Smith fell in Master Bedroom - Immediate attention required',
        recipientId: 'cg-1',
        recipientName: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        acknowledged: false,
        method: 'phone',
        deliveryStatus: 'delivered',
        responseRequired: true,
        responded: false,
        metadata: {
          fallEventId: 'fall-1',
          location: 'Master Bedroom',
          residentName: 'John Smith'
        }
      },
      {
        id: 'notif-2',
        type: 'immobility',
        priority: 'high',
        title: 'Immobility Alert',
        message: 'Mary Johnson has been immobile for 5 minutes in Bathroom',
        recipientId: 'cg-2',
        recipientName: 'Michael Chen',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        acknowledged: true,
        acknowledgedBy: 'Michael Chen',
        acknowledgedAt: new Date(Date.now() - 3 * 60 * 1000),
        method: 'push',
        deliveryStatus: 'delivered',
        responseRequired: true,
        responded: true,
        metadata: {
          immobilityAlertId: 'immobility-1',
          location: 'Bathroom',
          residentName: 'Mary Johnson'
        }
      },
      {
        id: 'notif-3',
        type: 'system',
        priority: 'medium',
        title: 'System Maintenance',
        message: 'Scheduled system maintenance in 2 hours',
        recipientId: 'cg-3',
        recipientName: 'Emily Davis',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        acknowledged: true,
        acknowledgedBy: 'Emily Davis',
        acknowledgedAt: new Date(Date.now() - 25 * 60 * 1000),
        method: 'email',
        deliveryStatus: 'delivered',
        responseRequired: false,
        responded: false
      }
    ];

    const mockRules: NotificationRule[] = [
      {
        id: 'rule-1',
        name: 'Critical Falls - All Medical Staff',
        enabled: true,
        trigger: {
          eventType: 'fall',
          severity: 'critical'
        },
        recipients: ['cg-1', 'cg-3', 'cg-4'],
        methods: ['phone', 'sms', 'push'],
        escalation: {
          enabled: true,
          delay: 5,
          escalateTo: ['cg-4']
        },
        schedule: {
          active: true,
          startTime: '00:00',
          endTime: '23:59',
          days: [0, 1, 2, 3, 4, 5, 6]
        }
      },
      {
        id: 'rule-2',
        name: 'Immobilify Alerts - On-Duty Caregivers',
        enabled: true,
        trigger: {
          eventType: 'immobility',
          severity: 'high'
        },
        recipients: ['cg-1', 'cg-2'],
        methods: ['push', 'sms'],
        escalation: {
          enabled: true,
          delay: 10,
          escalateTo: ['cg-4']
        },
        schedule: {
          active: true,
          startTime: '00:00',
          endTime: '23:59',
          days: [0, 1, 2, 3, 4, 5, 6]
        }
      }
    ];

    setCaregivers(mockCaregivers);
    setNotifications(mockNotifications);
    setRules(mockRules);
  }, []);

  // Generate notifications based on fall events and immobility alerts
  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Process fall events
    fallEvents.forEach(fall => {
      if (fall.responseStatus === 'pending') {
        const onDutyCaregivers = caregivers.filter(cg => cg.onDuty);
        
        onDutyCaregivers.forEach(caregiver => {
          const shouldNotify = caregiver.notificationPreferences.criticalOnly 
            ? fall.severity === 'critical' 
            : true;

          if (shouldNotify && !notifications.some(n => 
            n.metadata?.fallEventId === fall.id && n.recipientId === caregiver.id
          )) {
            newNotifications.push({
              id: `notif-fall-${fall.id}-${caregiver.id}`,
              type: 'fall',
              priority: fall.severity,
              title: `${fall.severity === 'critical' ? 'Critical' : 'Fall'} Detected`,
              message: `${fall.residentName} fell in ${fall.roomName} - ${fall.severity} priority`,
              recipientId: caregiver.id,
              recipientName: caregiver.name,
              timestamp: new Date(fall.timestamp),
              acknowledged: false,
              method: caregiver.notificationPreferences.phone ? 'phone' : 'push',
              deliveryStatus: 'pending',
              responseRequired: true,
              responded: false,
              metadata: {
                fallEventId: fall.id,
                location: fall.roomName,
                residentName: fall.residentName
              }
            });
          }
        });
      }
    });

    // Process immobility alerts
    immobilityAlerts.forEach(alert => {
      if (!alert.resolved) {
        const onDutyCaregivers = caregivers.filter(cg => cg.onDuty);
        
        onDutyCaregivers.forEach(caregiver => {
          const shouldNotify = caregiver.notificationPreferences.criticalOnly 
            ? alert.severity === 'critical' 
            : true;

          if (shouldNotify && !notifications.some(n => 
            n.metadata?.immobilityAlertId === alert.id && n.recipientId === caregiver.id
          )) {
            newNotifications.push({
              id: `notif-immobility-${alert.id}-${caregiver.id}`,
              type: 'immobility',
              priority: alert.severity,
              title: 'Immobility Alert',
              message: `${alert.residentName} has been immobile for ${Math.round(alert.duration / 60)} minutes in ${alert.roomName}`,
              recipientId: caregiver.id,
              recipientName: caregiver.name,
              timestamp: new Date(alert.startTime),
              acknowledged: false,
              method: 'push',
              deliveryStatus: 'pending',
              responseRequired: true,
              responded: false,
              metadata: {
                immobilityAlertId: alert.id,
                location: alert.roomName,
                residentName: alert.residentName
              }
            });
          }
        });
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
      onNotificationSend?.(newNotifications[0]);
    }
  }, [fallEvents, immobilityAlerts, caregivers, notifications, onNotificationSend]);

  const handleAcknowledge = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { 
            ...n, 
            acknowledged: true, 
            acknowledgedAt: new Date(),
            acknowledgedBy: 'Current User'
          }
        : n
    ));
  };

  const handleSendNotification = (recipientId: string, message: string) => {
    const newNotification: Notification = {
      id: `notif-custom-${Date.now()}`,
      type: 'reminder',
      priority: 'medium',
      title: 'Custom Notification',
      message,
      recipientId,
      recipientName: caregivers.find(cg => cg.id === recipientId)?.name || 'Unknown',
      timestamp: new Date(),
      acknowledged: false,
      method: 'push',
      deliveryStatus: 'sent',
      responseRequired: false,
      responded: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter.status !== 'all' && 
        ((filter.status === 'acknowledged' && !n.acknowledged) ||
         (filter.status === 'unacknowledged' && n.acknowledged))) {
      return false;
    }
    if (filter.type !== 'all' && n.type !== filter.type) return false;
    if (filter.priority !== 'all' && n.priority !== filter.priority) return false;
    if (filter.recipient !== 'all' && n.recipientId !== filter.recipient) return false;
    if (searchTerm && !n.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !n.message.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !n.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const onDutyCaregivers = caregivers.filter(cg => cg.onDuty);
  const pendingNotifications = notifications.filter(n => !n.acknowledged);
  const criticalNotifications = pendingNotifications.filter(n => n.priority === 'critical');

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      <AnimatePresence>
        {criticalNotifications.length > 0 && (
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
                    {criticalNotifications.length} critical notification{criticalNotifications.length > 1 ? 's' : ''} require immediate attention
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Sound {soundEnabled ? 'On' : 'Off'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => criticalNotifications.forEach(n => handleAcknowledge(n.id))}
                    >
                      Acknowledge All
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">On Duty</p>
                <p className="text-xl font-bold text-blue-600">{onDutyCaregivers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-orange-600">{pendingNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-xl font-bold text-red-600">{criticalNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Acknowledged</p>
                <p className="text-xl font-bold text-green-600">
                  {notifications.filter(n => n.acknowledged).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {pendingNotifications.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {pendingNotifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="caregivers" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Caregivers</span>
              <Badge variant="secondary" className="text-xs">
                {onDutyCaregivers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Rules</span>
              <Badge variant="secondary" className="text-xs">
                {rules.filter(r => r.enabled).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center space-x-2">
              <Radio className="w-4 h-4" />
              <span>Channels</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Select value={filter.status} onValueChange={(value) => setFilter({...filter, status: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filter.type} onValueChange={(value) => setFilter({...filter, type: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fall">Fall</SelectItem>
                    <SelectItem value="immobility">Immobility</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filter.priority} onValueChange={(value) => setFilter({...filter, priority: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filter.recipient} onValueChange={(value) => setFilter({...filter, recipient: value})}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Caregivers</SelectItem>
                    {caregivers.map(cg => (
                      <SelectItem key={cg.id} value={cg.id}>{cg.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={notification.acknowledged ? 'opacity-75' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(notification.deliveryStatus)}
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold">{notification.title}</h4>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {notification.acknowledged && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Acknowledged
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                {notification.recipientName}
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                {notification.timestamp.toLocaleString()}
                              </span>
                              <span className="flex items-center space-x-1">
                                {notification.method === 'phone' && <Phone className="w-3 h-3" />}
                                {notification.method === 'email' && <Mail className="w-3 h-3" />}
                                {notification.method === 'sms' && <MessageSquare className="w-3 h-3" />}
                                {notification.method === 'push' && <Smartphone className="w-3 h-3" />}
                                {notification.method}
                              </span>
                              {notification.metadata?.location && (
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  {notification.metadata.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.acknowledged && (
                            <Button
                              size="sm"
                              onClick={() => handleAcknowledge(notification.id)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filter.status !== 'all' || filter.type !== 'all' 
                      ? 'Try adjusting your filters or search terms' 
                      : 'No notifications have been sent yet'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="caregivers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caregivers.map((caregiver) => (
              <Card key={caregiver.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${caregiver.onDuty ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <h3 className="font-semibold">{caregiver.name}</h3>
                        <p className="text-sm text-gray-600">{caregiver.role} • {caregiver.department}</p>
                      </div>
                    </div>
                    <Badge variant={caregiver.onDuty ? 'default' : 'secondary'}>
                      {caregiver.onDuty ? 'On Duty' : 'Off Duty'}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Phone</span>
                      <span>{caregiver.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Email</span>
                      <span>{caregiver.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Active</span>
                      <span>{caregiver.lastActive.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Notification Preferences</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>Phone: {caregiver.notificationPreferences.phone ? 'On' : 'Off'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3" />
                        <span>Email: {caregiver.notificationPreferences.email ? 'On' : 'Off'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-3 h-3" />
                        <span>SMS: {caregiver.notificationPreferences.sms ? 'On' : 'Off'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-3 h-3" />
                        <span>Push: {caregiver.notificationPreferences.push ? 'On' : 'Off'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Send Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={rule.enabled} />
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Trigger</p>
                      <p className="text-gray-600">
                        {rule.trigger.eventType === 'fall' ? 'Fall' : 'Immobility'} Events
                        {rule.trigger.severity && ` - ${rule.trigger.severity} severity`}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Recipients</p>
                      <p className="text-gray-600">
                        {rule.recipients.length} caregiver{rule.recipients.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Methods</p>
                      <p className="text-gray-600">
                        {rule.methods.join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Escalation</p>
                      <p className="text-gray-600">
                        {rule.escalation.enabled 
                          ? `After ${rule.escalation.delay} minutes` 
                          : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Voice Calls</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Automated Messages</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Critical Only</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>SMS Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SMS Enabled</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Include Location</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Delivery Confirmation</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Enabled</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Include Attachments</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">HTML Format</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Push Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Push Enabled</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sound Alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vibration</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaregiverNotificationSystem;