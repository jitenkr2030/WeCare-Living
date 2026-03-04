'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  User, 
  MapPin, 
  Filter,
  Activity,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { PresenceEvent, Resident } from '@/types/presence';

interface MovementTimelineProps {
  events: PresenceEvent[];
  residents: Resident[];
  maxEvents?: number;
}

const MovementTimeline: React.FC<MovementTimelineProps> = ({
  events,
  residents,
  maxEvents = 50
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterResident, setFilterResident] = useState<string>('all');
  const [showDetails, setShowDetails] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('1h');

  const getResident = (residentId: string) => {
    return residents.find(r => r.id === residentId);
  };

  const getEventIcon = (eventType: PresenceEvent['eventType']) => {
    switch (eventType) {
      case 'enter':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'exit':
        return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case 'movement_detected':
        return <Activity className="w-4 h-4 text-orange-500" />;
      case 'no_movement':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventColor = (eventType: PresenceEvent['eventType']) => {
    switch (eventType) {
      case 'enter':
        return 'border-green-200 bg-green-50';
      case 'exit':
        return 'border-blue-200 bg-blue-50';
      case 'movement_detected':
        return 'border-orange-200 bg-orange-50';
      case 'no_movement':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    if (confidence >= 0.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getTimeRangeFilter = (range: string) => {
    const now = new Date();
    const cutoffTime = new Date();
    
    switch (range) {
      case '15m':
        cutoffTime.setMinutes(now.getMinutes() - 15);
        break;
      case '1h':
        cutoffTime.setHours(now.getHours() - 1);
        break;
      case '6h':
        cutoffTime.setHours(now.getHours() - 6);
        break;
      case '24h':
        cutoffTime.setDate(now.getDate() - 1);
        break;
      case '7d':
        cutoffTime.setDate(now.getDate() - 7);
        break;
      default:
        return null;
    }
    
    return cutoffTime;
  };

  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    
    // Time range filter
    const cutoffTime = getTimeRangeFilter(timeRange);
    if (cutoffTime) {
      filtered = filtered.filter(event => event.timestamp >= cutoffTime);
    }
    
    // Event type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.eventType === filterType);
    }
    
    // Resident filter
    if (filterResident !== 'all') {
      filtered = filtered.filter(event => event.residentId === filterResident);
    }
    
    return filtered.slice(0, maxEvents);
  }, [events, filterType, filterResident, timeRange, maxEvents]);

  const eventStats = useMemo(() => {
    const stats = {
      total: filteredEvents.length,
      enter: 0,
      exit: 0,
      movement: 0,
      noMovement: 0,
      uniqueResidents: new Set<string>(),
      uniqueRooms: new Set<string>()
    };
    
    filteredEvents.forEach(event => {
      switch (event.eventType) {
        case 'enter':
          stats.enter++;
          break;
        case 'exit':
          stats.exit++;
          break;
        case 'movement_detected':
          stats.movement++;
          break;
        case 'no_movement':
          stats.noMovement++;
          break;
      }
      stats.uniqueResidents.add(event.residentId);
      stats.uniqueRooms.add(event.roomId);
    });
    
    return stats;
  }, [filteredEvents]);

  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: PresenceEvent[] } = {};
    
    filteredEvents.forEach(event => {
      const timeKey = event.timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(event);
    });
    
    return groups;
  }, [filteredEvents]);

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{eventStats.total}</div>
              <div className="text-xs text-gray-500">Total Events</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{eventStats.enter}</div>
              <div className="text-xs text-gray-500">Entries</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{eventStats.exit}</div>
              <div className="text-xs text-gray-500">Exits</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">{eventStats.movement}</div>
              <div className="text-xs text-gray-500">Movement</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold">{eventStats.noMovement}</div>
              <div className="text-xs text-gray-500">No Movement</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Movement Timeline</span>
              <Badge variant="secondary">{filteredEvents.length} events</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filters:</span>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">Last 15m</SelectItem>
                <SelectItem value="1h">Last 1h</SelectItem>
                <SelectItem value="6h">Last 6h</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="enter">Entries</SelectItem>
                <SelectItem value="exit">Exits</SelectItem>
                <SelectItem value="movement_detected">Movement</SelectItem>
                <SelectItem value="no_movement">No Movement</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterResident} onValueChange={setFilterResident}>
              <SelectTrigger className="w-40">
                <SelectValue />
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

          {/* Timeline */}
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {Object.entries(groupedEvents).map(([timeGroup, groupEvents]) => (
                <div key={timeGroup}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{timeGroup}</span>
                    <Badge variant="outline" className="text-xs">
                      {groupEvents.length} events
                    </Badge>
                  </div>
                  
                  <div className="ml-4 space-y-2">
                    {groupEvents.map((event) => {
                      const resident = getResident(event.residentId);
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`border-l-2 pl-4 py-2 ${getEventColor(event.eventType)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getEventIcon(event.eventType)}
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">
                                    {resident?.name || 'Unknown'}
                                  </span>
                                  <span className="text-gray-600">
                                    {event.eventType.replace('_', ' ')}
                                  </span>
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-blue-600 text-sm">
                                    {event.roomName}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatTime(event.timestamp)} • {formatRelativeTime(event.timestamp)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getConfidenceColor(event.confidence)}`}
                              >
                                {Math.round(event.confidence * 100)}%
                              </Badge>
                            </div>
                          </div>

                          <AnimatePresence>
                            {showDetails && event.sensorData && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 pt-2 border-t border-gray-200"
                              >
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">Signal:</span>
                                    <span className="ml-1">{event.sensorData.signalStrength}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Motion:</span>
                                    <span className="ml-1">{event.sensorData.motionLevel}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Devices:</span>
                                    <span className="ml-1">{event.sensorData.deviceCount}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No events found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovementTimeline;