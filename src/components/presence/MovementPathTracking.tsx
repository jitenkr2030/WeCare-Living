'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  User, 
  Play, 
  Pause,
  RotateCcw,
  Eye
} from 'lucide-react';
import { MovementPath, Resident } from '@/types/presence';

interface MovementPathTrackingProps {
  paths: MovementPath[];
  residents: Resident[];
  selectedResidentId?: string;
  onResidentSelect?: (residentId: string) => void;
}

const MovementPathTracking: React.FC<MovementPathTrackingProps> = ({
  paths,
  residents,
  selectedResidentId,
  onResidentSelect
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const getResident = (residentId: string) => {
    return residents.find(r => r.id === residentId);
  };

  const getActivePaths = () => {
    return paths.filter(path => path.isActive);
  };

  const getCompletedPaths = () => {
    return paths.filter(path => !path.isActive);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTotalPathDuration = (path: MovementPath) => {
    if (path.endTime) {
      return (path.endTime.getTime() - path.startTime.getTime()) / 1000;
    }
    return (new Date().getTime() - path.startTime.getTime()) / 1000;
  };

  const getRoomTransitionIcon = (fromRoom: string, toRoom: string) => {
    return (
      <div className="flex items-center space-x-1 text-xs">
        <span className="text-blue-600">{fromRoom}</span>
        <ArrowRight className="w-3 h-3 text-gray-400" />
        <span className="text-green-600">{toRoom}</span>
      </div>
    );
  };

  const getPathSummary = (path: MovementPath) => {
    const uniqueRooms = new Set(path.path.map(p => p.roomId));
    const totalDuration = getTotalPathDuration(path);
    
    return {
      roomCount: uniqueRooms.size,
      totalDuration,
      averageRoomTime: path.path.length > 0 ? totalDuration / path.path.length : 0,
      lastRoom: path.path[path.path.length - 1]?.roomName || 'Unknown'
    };
  };

  const activePaths = getActivePaths();
  const completedPaths = getCompletedPaths().slice(0, 10); // Show last 10 completed paths

  return (
    <div className="space-y-6">
      {/* Active Paths */}
      {activePaths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active Movement Paths</span>
              <Badge variant="secondary">{activePaths.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePaths.map((path) => {
                const resident = getResident(path.residentId);
                const summary = getPathSummary(path);
                
                return (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 bg-green-50 border-green-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{resident?.name || 'Unknown'}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(summary.totalDuration)}</span>
                      </div>
                    </div>

                    {/* Current Location */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Currently in:</span>
                        <span className="text-blue-600 font-semibold">
                          {summary.lastRoom}
                        </span>
                      </div>
                    </div>

                    {/* Path Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Path Progress</span>
                        <span>{summary.roomCount} rooms visited</span>
                      </div>
                      
                      <ScrollArea className="h-20 w-full">
                        <div className="flex space-x-2 pb-2">
                          {path.path.map((point, index) => (
                            <motion.div
                              key={`${point.roomId}-${point.timestamp.getTime()}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full border-2 ${
                                  index === path.path.length - 1 
                                    ? 'bg-green-500 border-green-600' 
                                    : 'bg-blue-500 border-blue-600'
                                }`}></div>
                                <span className="text-xs mt-1 text-gray-600 max-w-16 truncate">
                                  {point.roomName}
                                </span>
                              </div>
                              {index < path.path.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Path Details */}
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPathId(
                          selectedPathId === path.id ? null : path.id
                        )}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {selectedPathId === path.id ? 'Hide' : 'Show'} Details
                      </Button>
                    </div>

                    <AnimatePresence>
                      {selectedPathId === path.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-green-200"
                        >
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Room Transitions:</div>
                            {path.path.slice(-5).map((point, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                  <span>{point.roomName}</span>
                                  <span className="text-gray-500">
                                    {formatTime(point.timestamp)}
                                  </span>
                                </div>
                                {point.duration && (
                                  <span className="text-gray-500">
                                    {formatDuration(point.duration)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Completed Paths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Recent Movement History</span>
              <Badge variant="secondary">{completedPaths.length}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={completedPaths.length === 0}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
              >
                {playbackSpeed}x
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {completedPaths.map((path) => {
                const resident = getResident(path.residentId);
                const summary = getPathSummary(path);
                
                return (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border rounded-lg p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">{resident?.name || 'Unknown'}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {summary.roomCount} rooms
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatDuration(summary.totalDuration)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(path.startTime)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-2 text-xs text-gray-600">
                      <span>Path:</span>
                      {path.path.slice(0, 3).map((point, index) => (
                        <React.Fragment key={index}>
                          <span className="text-blue-600">{point.roomName}</span>
                          {index < Math.min(2, path.path.length - 1) && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                      {path.path.length > 3 && (
                        <span className="text-gray-500">... +{path.path.length - 3} more</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              
              {completedPaths.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent movement history</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovementPathTracking;