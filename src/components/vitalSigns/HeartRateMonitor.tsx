'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { VitalSignsReading, ResidentVitalProfile } from '@/types/vitalSigns';

interface HeartRateMonitorProps {
  currentReading: VitalSignsReading;
  residentProfile?: ResidentVitalProfile;
  trend?: 'up' | 'down' | 'stable';
  showDetails?: boolean;
}

const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({
  currentReading,
  residentProfile,
  trend = 'stable',
  showDetails = false
}) => {
  const { heartRate, signalQuality, timestamp, activityLevel } = currentReading;
  
  // Normal adult range: 60-100 BPM
  const normalMin = 60;
  const normalMax = 100;
  const isNormal = heartRate >= normalMin && heartRate <= normalMax;
  const isLow = heartRate < normalMin;
  const isHigh = heartRate > normalMax;
  
  // Calculate status color
  const getStatusColor = () => {
    if (signalQuality === 'poor') return 'bg-gray-500';
    if (isLow) return 'bg-blue-500'; // Bradycardia
    if (isHigh) return 'bg-red-500'; // Tachycardia
    return 'bg-green-500';
  };
  
  const getStatusText = () => {
    if (signalQuality === 'poor') return 'Poor Signal';
    if (isLow) return 'Bradycardia';
    if (isHigh) return 'Tachycardia';
    return 'Normal';
  };
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Calculate heart rate position on scale (40-140 BPM)
  const scalePosition = Math.min(Math.max((heartRate - 40) / 100 * 100, 0), 100);
  
  // Get activity-based expected range
  const getActivityRange = () => {
    switch (activityLevel) {
      case 'resting': return { min: 60, max: 80 };
      case 'light': return { min: 70, max: 100 };
      case 'moderate': return { min: 80, max: 120 };
      case 'vigorous': return { min: 100, max: 160 };
      default: return { min: 60, max: 100 };
    }
  };
  
  const activityRange = getActivityRange();
  const isInActivityRange = heartRate >= activityRange.min && heartRate <= activityRange.max;
  
  return (
    <Card className={`${showDetails ? 'col-span-2' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span>Heart Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <Badge 
              variant={isNormal ? 'default' : 'destructive'}
              className={getStatusColor()}
            >
              {getStatusText()}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main reading */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {heartRate}
              </div>
              <div className="text-sm text-gray-500">BPM</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                isNormal ? 'text-green-600' : 'text-red-600'
              }`}>
                Normal: {normalMin}-{normalMax} BPM
              </div>
              <div className="text-xs text-gray-500">
                {isInActivityRange ? `Expected for ${activityLevel}` : 'Activity Level: ' + activityLevel}
              </div>
            </div>
          </div>
          
          {/* Heart rate scale */}
          <div className="space-y-2">
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              {/* Normal range indicator */}
              <div 
                className="absolute h-full bg-green-200"
                style={{
                  left: `${((normalMin - 40) / 100) * 100}%`,
                  width: `${((normalMax - normalMin) / 100) * 100}%`
                }}
              />
              {/* Activity range indicator */}
              <div 
                className="absolute h-1 bg-blue-200 opacity-70"
                style={{
                  left: `${((activityRange.min - 40) / 100) * 100}%`,
                  width: `${((activityRange.max - activityRange.min) / 100) * 100}%`
                }}
              />
              {/* Current value indicator */}
              <div 
                className={`absolute h-2 w-1 rounded-full ${getStatusColor()}`}
                style={{ left: `${scalePosition}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>40</span>
              <span className="text-green-600 font-medium">Normal</span>
              <span className="text-blue-600 font-medium">Activity</span>
              <span>140</span>
            </div>
          </div>
          
          {/* Signal quality indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Signal Quality:</span>
            <div className="flex items-center space-x-2">
              <Progress 
                value={signalQuality === 'excellent' ? 100 : signalQuality === 'good' ? 75 : signalQuality === 'fair' ? 50 : 25}
                className="w-20 h-2"
              />
              <span className="text-sm font-medium capitalize">{signalQuality}</span>
            </div>
          </div>
          
          {/* Activity level indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Activity Level:</span>
            <Badge variant={activityLevel === 'resting' ? 'secondary' : 'default'}>
              {activityLevel.replace('_', ' ')}
            </Badge>
          </div>
          
          {/* Additional details */}
          {showDetails && (
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Resident Baseline:</span>
                  <div className="font-medium">
                    {residentProfile?.baseline.heartRate.min || 60} - {residentProfile?.baseline.heartRate.max || 100} BPM
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <div className="font-medium">
                    {timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {/* Alert thresholds */}
              {residentProfile?.restrictions.heartRate && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <div className="text-sm font-medium text-yellow-800">
                      Custom Alert Thresholds
                    </div>
                  </div>
                  <div className="text-xs text-yellow-700 mt-1">
                    Min: {residentProfile.restrictions.heartRate.min} BPM | 
                    Max: {residentProfile.restrictions.heartRate.max} BPM
                  </div>
                </div>
              )}
              
              {/* Heart rate zones */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium text-blue-700">Resting</div>
                  <div className="text-blue-600">50-70</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-medium text-green-700">Normal</div>
                  <div className="text-green-600">70-100</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-medium text-yellow-700">Elevated</div>
                  <div className="text-yellow-600">100-130</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="font-medium text-red-700">High</div>
                  <div className="text-red-600">130+</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeartRateMonitor;