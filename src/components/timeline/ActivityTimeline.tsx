'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  RefreshCw,
  User,
  Home,
  Activity,
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  Eye,
  MapPin,
  TrendingUp,
  TrendingDown,
  Pause,
  Play,
  ArrowLeft,
  ArrowRight,
  Moon
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
  EmergencyResponse 
} from '@/types/fallDetection';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'presence' | 'vital' | 'fall' | 'immobility' | 'emergency' | 'sleep';
  eventType: string;
  title: string;
  description: string;
  residentId: string;
  residentName: string;
  location?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'pending' | 'acknowledged';
  details?: any;
  icon: React.ReactNode;
  color: string;
}

interface ActivityTimelineProps {
  residents: Resident[];
  vitalSignsReadings: VitalSignsReading[];
  breathingPatterns: BreathingPattern[];
  sleepSessions: SleepSession[];
  vitalSignsAlerts: VitalSignsAlert[];
  fallEvents: FallEvent[];
  immobilityAlerts: ImmobilityAlert[];
  emergencyResponses: EmergencyResponse[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  residents,
  vitalSignsReadings,
  breathingPatterns,
  sleepSessions,
  vitalSignsAlerts,
  fallEvents,
  immobilityAlerts,
  emergencyResponses
}) => {
  const [selectedResident, setSelectedResident] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const eventsPerPage = 20;

  // Generate comprehensive timeline events
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    const now = new Date();

    // Helper function to get resident name
    const getResidentName = (residentId: string) => {
      return residents.find(r => r.id === residentId)?.name || 'Unknown Resident';
    };

    // Add presence events (mock data for demonstration)
    residents.forEach(resident => {
      for (let i = 0; i < 5; i++) {
        const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
        events.push({
          id: `presence-${resident.id}-${i}`,
          timestamp,
          type: 'presence',
          eventType: 'room_change',
          title: `Room Change`,
          description: `Moved from ${['Bedroom', 'Living Room', 'Kitchen', 'Bathroom'][Math.floor(Math.random() * 4)]} to ${['Bedroom', 'Living Room', 'Kitchen', 'Bathroom'][Math.floor(Math.random() * 4)]}`,
          residentId: resident.id,
          residentName: resident.name,
          location: 'Various',
          severity: 'low',
          status: 'active',
          icon: <Home className="w-4 h-4" />,
          color: 'blue'
        });
      }
    });

    // Add vital sign events
    vitalSignsReadings.forEach(reading => {
      events.push({
        id: `vital-${reading.id}`,
        timestamp: reading.timestamp,
        type: 'vital',
        eventType: 'vital_reading',
        title: `Vital Sign Reading`,
        description: `${reading.type}: ${reading.value} ${reading.unit}`,
        residentId: reading.residentId,
        residentName: getResidentName(reading.residentId),
        severity: reading.status === 'normal' ? 'low' : 
                  reading.status === 'warning' ? 'medium' : 'high',
        status: 'active',
        details: reading,
        icon: <Heart className="w-4 h-4" />,
        color: reading.status === 'normal' ? 'green' : 
               reading.status === 'warning' ? 'yellow' : 'red'
      });
    });

    // Add vital sign alerts
    vitalSignsAlerts.forEach(alert => {
      events.push({
        id: `alert-${alert.id}`,
        timestamp: alert.timestamp,
        type: 'vital',
        eventType: 'vital_alert',
        title: `Vital Sign Alert`,
        description: alert.message,
        residentId: alert.residentId,
        residentName: getResidentName(alert.residentId),
        severity: alert.severity,
        status: alert.acknowledged ? 'acknowledged' : 'pending',
        details: alert,
        icon: <AlertTriangle className="w-4 h-4" />,
        color: alert.severity === 'critical' ? 'red' : 
               alert.severity === 'high' ? 'orange' : 'yellow'
      });
    });

    // Add fall events
    fallEvents.forEach(event => {
      events.push({
        id: `fall-${event.id}`,
        timestamp: event.timestamp,
        type: 'fall',
        eventType: 'fall_detected',
        title: `Fall Detected`,
        description: `Fall detected in ${event.location}`,
        residentId: event.residentId,
        residentName: getResidentName(event.residentId),
        location: event.location,
        severity: event.severity,
        status: event.responseStatus,
        details: event,
        icon: <Shield className="w-4 h-4" />,
        color: event.severity === 'critical' ? 'red' : 'orange'
      });
    });

    // Add immobility alerts
    immobilityAlerts.forEach(alert => {
      events.push({
        id: `immobility-${alert.id}`,
        timestamp: alert.startTime,
        type: 'immobility',
        eventType: 'immobility_alert',
        title: `Immobility Alert`,
        description: `No movement detected for ${alert.duration}`,
        residentId: alert.residentId,
        residentName: getResidentName(alert.residentId),
        severity: 'high',
        status: alert.resolved ? 'resolved' : 'active',
        details: alert,
        icon: <Pause className="w-4 h-4" />,
        color: 'orange'
      });
    });

    // Add sleep sessions
    sleepSessions.forEach(session => {
      events.push({
        id: `sleep-${session.id}`,
        timestamp: session.startTime,
        type: 'sleep',
        eventType: 'sleep_session',
        title: `Sleep Session`,
        description: `Sleep quality: ${session.quality}`,
        residentId: session.residentId,
        residentName: getResidentName(session.residentId),
        location: 'Bedroom',
        severity: 'low',
        status: session.endTime ? 'completed' : 'active',
        details: session,
        icon: <Moon className="w-4 h-4" />,
        color: session.quality === 'excellent' ? 'green' : 
               session.quality === 'good' ? 'blue' : 'yellow'
      });
    });

    // Sort events by timestamp (most recent first)
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [residents, vitalSignsReadings, breathingPatterns, sleepSessions, vitalSignsAlerts, fallEvents, immobilityAlerts]);

  // Filter events based on selected criteria
  const filteredEvents = useMemo(() => {
    let filtered = [...timelineEvents];

    // Filter by resident
    if (selectedResident !== 'all') {
      filtered = filtered.filter(event => event.residentId === selectedResident);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    // Filter by time range
    const now = new Date();
    const timeRangeHours = {
      '1h': 1,
      '6h': 6,
      '24h': 24,
      '7d': 168,
      '30d': 720
    }[selectedTimeRange] || 24;

    const cutoffTime = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);
    filtered = filtered.filter(event => event.timestamp >= cutoffTime);

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.residentName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [timelineEvents, selectedResident, selectedType, selectedTimeRange, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  // Auto-play functionality
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPage(prev => {
        if (prev >= totalPages) return 1;
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, totalPages]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3 text-green-600" />;
      case 'resolved': return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'pending': return <Clock className="w-3 h-3 text-yellow-600" />;
      case 'acknowledged': return <Eye className="w-3 h-3 text-blue-600" />;
      default: return <XCircle className="w-3 h-3 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Activity Timeline & History</span>
              <Badge variant="secondary">{filteredEvents.length} events</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Resident</label>
              <Select value={selectedResident} onValueChange={setSelectedResident}>
                <SelectTrigger>
                  <SelectValue placeholder="All residents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Residents</SelectItem>
                  {residents.map(resident => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="presence">Presence</SelectItem>
                  <SelectItem value="vital">Vital Signs</SelectItem>
                  <SelectItem value="fall">Fall Detection</SelectItem>
                  <SelectItem value="immobility">Immobility</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{filteredEvents.length}</p>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {filteredEvents.filter(e => e.severity === 'critical').length}
              </p>
              <p className="text-sm text-gray-600">Critical Events</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {filteredEvents.filter(e => e.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {filteredEvents.filter(e => e.status === 'resolved').length}
              </p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Events */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {paginatedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* Event Icon */}
                  <div className={`p-2 rounded-full bg-${event.color}-100`}>
                    {event.icon}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={`text-xs ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(event.status)}
                          <span className="text-xs text-gray-500">{event.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{event.timestamp.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{event.residentName}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{event.description}</p>
                    {event.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * eventsPerPage) + 1} to {Math.min(currentPage * eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityTimeline;