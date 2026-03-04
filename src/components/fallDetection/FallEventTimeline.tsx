'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Filter,
  Search,
  User,
  Activity,
  Heart,
  Zap,
  Eye,
  ChevronDown,
  ChevronUp,
  Phone,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';

import type { FallEvent } from '@/types/fallDetection';

interface FallEventTimelineProps {
  fallEvents: FallEvent[];
  onEventSelect?: (event: FallEvent) => void;
  onEmergencyCall?: (event: FallEvent) => void;
}

const FallEventTimeline: React.FC<FallEventTimelineProps> = ({
  fallEvents,
  onEventSelect,
  onEmergencyCall
}) => {
  const [filter, setFilter] = useState({
    severity: 'all',
    status: 'all',
    resident: 'all',
    timeRange: '24h'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  // Get unique residents for filter
  const residents = useMemo(() => {
    const uniqueResidents = Array.from(new Set(fallEvents.map(f => f.residentName)));
    return uniqueResidents.sort();
  }, [fallEvents]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...fallEvents];

    // Apply severity filter
    if (filter.severity !== 'all') {
      filtered = filtered.filter(f => f.severity === filter.severity);
    }

    // Apply status filter
    if (filter.status !== 'all') {
      filtered = filtered.filter(f => f.responseStatus === filter.status);
    }

    // Apply resident filter
    if (filter.resident !== 'all') {
      filtered = filtered.filter(f => f.residentName === filter.resident);
    }

    // Apply time range filter
    const now = new Date();
    const timeLimit = new Date();
    switch (filter.timeRange) {
      case '1h':
        timeLimit.setHours(now.getHours() - 1);
        break;
      case '24h':
        timeLimit.setDate(now.getDate() - 1);
        break;
      case '7d':
        timeLimit.setDate(now.getDate() - 7);
        break;
      case '30d':
        timeLimit.setDate(now.getDate() - 30);
        break;
    }
    filtered = filtered.filter(f => new Date(f.timestamp) >= timeLimit);

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(f => 
        f.residentName.toLowerCase().includes(term) ||
        f.roomName.toLowerCase().includes(term) ||
        f.preFallActivity.toLowerCase().includes(term) ||
        f.fallType.toLowerCase().includes(term)
      );
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [fallEvents, filter, searchTerm]);

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'false_alarm': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Fall Event Timeline</span>
            <Badge variant="secondary">{filteredEvents.length} events</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by resident, room, activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <Select value={filter.severity} onValueChange={(value) => setFilter({...filter, severity: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filter.status} onValueChange={(value) => setFilter({...filter, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="responding">Responding</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="false_alarm">False Alarm</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filter.resident} onValueChange={(value) => setFilter({...filter, resident: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Resident" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Residents</SelectItem>
                  {residents.map(resident => (
                    <SelectItem key={resident} value={resident}>{resident}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filter.timeRange} onValueChange={(value) => setFilter({...filter, timeRange: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Events */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full border-2 border-white ${getSeverityColor(event.severity)}`}></div>

                {/* Event card */}
                <Card className={`ml-16 ${
                  event.severity === 'critical' ? 'border-red-200 bg-red-50' :
                  event.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                  event.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}>
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="font-semibold">{event.residentName}</span>
                        </div>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(event.responseStatus)}>
                          {event.responseStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{getTimeAgo(event.timestamp)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEventExpansion(event.id)}
                        >
                          {expandedEvents.has(event.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Basic info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">{event.roomName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">{event.preFallActivity} → {event.fallType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Critical alerts */}
                    {event.responseStatus === 'pending' && event.severity === 'critical' && (
                      <div className="mb-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-red-800">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium">Critical fall requiring immediate attention</span>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onEmergencyCall?.(event)}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Emergency
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Expanded details */}
                    <AnimatePresence>
                      {expandedEvents.has(event.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 border-t space-y-3">
                            {/* Detection details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Detected by:</span>
                                <p className="font-medium">{event.detectedBy.replace('_', ' ')}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Confidence:</span>
                                <p className="font-medium">{Math.round(event.confidence * 100)}%</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Impact Force:</span>
                                <p className="font-medium">{event.impactForce}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Fall Height:</span>
                                <p className="font-medium">{event.fallHeight}cm</p>
                              </div>
                            </div>

                            {/* Sensor data */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm font-medium mb-2">Sensor Data:</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Zap className="w-3 h-3 text-gray-600" />
                                  <span>Acceleration: {event.sensorData.accelerationPeak} m/s²</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Activity className="w-3 h-3 text-gray-600" />
                                  <span>Motion: {event.sensorData.motionLevel}%</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Timer className="w-3 h-3 text-gray-600" />
                                  <span>Duration: {event.sensorData.duration}ms</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Eye className="w-3 h-3 text-gray-600" />
                                  <span>Pattern Match: {Math.round(event.sensorData.patternMatch * 100)}%</span>
                                </div>
                              </div>
                            </div>

                            {/* Post-fall immobility */}
                            {event.postFallImmobility.detected && (
                              <div className="bg-orange-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 text-orange-800 mb-2">
                                  <Heart className="w-4 h-4" />
                                  <span className="font-medium">Post-Fall Immobility Detected</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Duration:</span>
                                    <p className="font-medium">{formatDuration(event.postFallImmobility.duration)}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Still Immobile:</span>
                                    <p className="font-medium">{event.postFallImmobility.stillImmobile ? 'Yes' : 'No'}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Response information */}
                            {(event.acknowledgedBy || event.responseTime) && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm font-medium mb-2">Response Information:</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  {event.acknowledgedBy && (
                                    <div>
                                      <span className="text-gray-600">Acknowledged by:</span>
                                      <p className="font-medium">{event.acknowledgedBy}</p>
                                    </div>
                                  )}
                                  {event.responseTime && (
                                    <div>
                                      <span className="text-gray-600">Response Time:</span>
                                      <p className="font-medium">{event.responseTime}s</p>
                                    </div>
                                  )}
                                  {event.acknowledgedAt && (
                                    <div>
                                      <span className="text-gray-600">Acknowledged at:</span>
                                      <p className="font-medium">{event.acknowledgedAt.toLocaleTimeString()}</p>
                                    </div>
                                  )}
                                  {event.resolvedAt && (
                                    <div>
                                      <span className="text-gray-600">Resolved at:</span>
                                      <p className="font-medium">{event.resolvedAt.toLocaleTimeString()}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center space-x-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEventSelect?.(event)}
                              >
                                View Details
                              </Button>
                              {event.responseStatus === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => onEmergencyCall?.(event)}
                                >
                                  <Phone className="w-3 h-3 mr-1" />
                                  Contact
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No fall events found</h3>
                <p className="text-gray-600">
                  {searchTerm || filter.severity !== 'all' || filter.status !== 'all' || filter.resident !== 'all'
                    ? 'Try adjusting your filters or search terms'
                    : 'No fall events have been recorded in the selected time range'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FallEventTimeline;