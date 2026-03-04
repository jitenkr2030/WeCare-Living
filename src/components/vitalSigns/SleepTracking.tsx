'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Moon, 
  Sun, 
  Cloud, 
  Activity, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { SleepSession, SleepEvent } from '@/types/vitalSigns';

interface SleepTrackingProps {
  sleepSessions: SleepSession[];
  currentSession?: SleepSession;
  showDetails?: boolean;
}

const SleepTracking: React.FC<SleepTrackingProps> = ({
  sleepSessions,
  currentSession,
  showDetails = false
}) => {
  const latestSession = currentSession || sleepSessions[0];
  
  if (!latestSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            <span>Sleep Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No sleep data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { 
    quality, 
    sleepEfficiency, 
    stages, 
    breathingDisturbances,
    averageBreathingRate,
    averageHeartRate,
    events,
    startTime,
    endTime,
    duration
  } = latestSession;
  
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getSleepStageIcon = (stage: string) => {
    switch (stage) {
      case 'awake': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'light_sleep': return <Cloud className="w-4 h-4 text-blue-400" />;
      case 'deep_sleep': return <Moon className="w-4 h-4 text-indigo-600" />;
      case 'rem_sleep': return <Activity className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };
  
  const totalSleepTime = stages.light_sleep + stages.deep_sleep + stages.rem_sleep;
  const sleepStagePercentages = {
    awake: (stages.awake / (duration || 1)) * 100,
    light_sleep: (stages.light_sleep / (duration || 1)) * 100,
    deep_sleep: (stages.deep_sleep / (duration || 1)) * 100,
    rem_sleep: (stages.rem_sleep / (duration || 1)) * 100
  };
  
  // Get recent sleep events
  const recentEvents = events.slice(-3).reverse();
  
  const isInProgress = !endTime;
  
  return (
    <Card className={`${showDetails ? 'col-span-2' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            <span>Sleep Tracking</span>
            {isInProgress && (
              <Badge variant="secondary" className="animate-pulse">
                In Progress
              </Badge>
            )}
          </div>
          <Badge className={getQualityColor(quality)}>
            {quality.charAt(0).toUpperCase() + quality.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sleep duration and efficiency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {duration ? formatDuration(duration) : '--'}
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {sleepEfficiency}%
              </div>
              <div className="text-sm text-gray-600">Sleep Efficiency</div>
            </div>
          </div>
          
          {/* Sleep stages */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Sleep Stages</div>
            {Object.entries(stages).map(([stage, minutes]) => (
              <div key={stage} className="flex items-center space-x-3">
                {getSleepStageIcon(stage)}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm capitalize">
                      {stage.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDuration(minutes)} ({Math.round(sleepStagePercentages[stage as keyof typeof sleepStagePercentages])}%)
                    </span>
                  </div>
                  <Progress 
                    value={sleepStagePercentages[stage as keyof typeof sleepStagePercentages]}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Vital signs during sleep */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">Avg Breathing Rate</div>
              <div className="text-lg font-semibold text-blue-700">
                {averageBreathingRate} BPM
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg Heart Rate</div>
              <div className="text-lg font-semibold text-red-700">
                {averageHeartRate} BPM
              </div>
            </div>
          </div>
          
          {/* Sleep disturbances */}
          {breathingDisturbances > 0 && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Breathing Disturbances
                </span>
              </div>
              <span className="text-sm font-bold text-yellow-700">
                {breathingDisturbances} events
              </span>
            </div>
          )}
          
          {/* Recent sleep events */}
          {recentEvents.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Recent Events</div>
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      event.severity === 'severe' ? 'bg-red-500' :
                      event.severity === 'moderate' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="capitalize">{event.type.replace('_', ' ')}</span>
                  </div>
                  <div className="text-gray-600">
                    {event.duration}s
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Additional details */}
          {showDetails && (
            <div className="pt-3 border-t border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Start Time:</span>
                  <div className="font-medium">
                    {startTime.toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">End Time:</span>
                  <div className="font-medium">
                    {endTime ? endTime.toLocaleTimeString() : 'In Progress'}
                  </div>
                </div>
              </div>
              
              {/* Sleep quality trends */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-medium text-green-700">Deep Sleep</div>
                  <div className="text-green-600">
                    {Math.round((stages.deep_sleep / totalSleepTime) * 100)}%
                  </div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium text-blue-700">REM Sleep</div>
                  <div className="text-blue-600">
                    {Math.round((stages.rem_sleep / totalSleepTime) * 100)}%
                  </div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-medium text-purple-700">Sleep Quality</div>
                  <div className="text-purple-600 capitalize">{quality}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepTracking;