'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { VitalSignsReading, ResidentVitalProfile } from '@/types/vitalSigns';

interface BreathingRateMonitorProps {
  currentReading: VitalSignsReading;
  residentProfile?: ResidentVitalProfile;
  trend?: 'up' | 'down' | 'stable';
  showDetails?: boolean;
}

const BreathingRateMonitor: React.FC<BreathingRateMonitorProps> = ({
  currentReading,
  residentProfile,
  trend = 'stable',
  showDetails = false
}) => {
  const { breathingRate, signalQuality, timestamp } = currentReading;
  
  // Elderly normal range: 6-30 BPM
  const normalMin = 6;
  const normalMax = 30;
  const isNormal = breathingRate >= normalMin && breathingRate <= normalMax;
  const isLow = breathingRate < normalMin;
  const isHigh = breathingRate > normalMax;
  
  // Calculate status color
  const getStatusColor = () => {
    if (signalQuality === 'poor') return 'bg-gray-500';
    if (isLow || isHigh) return 'bg-red-500';
    if (!isNormal) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStatusText = () => {
    if (signalQuality === 'poor') return 'Poor Signal';
    if (isLow) return 'Low Breathing Rate';
    if (isHigh) return 'High Breathing Rate';
    return 'Normal';
  };
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Calculate breathing rate position on scale (0-100)
  const scalePosition = Math.min(Math.max((breathingRate - 4) / 32 * 100, 0), 100);
  
  return (
    <Card className={`${showDetails ? 'col-span-2' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lungs className="w-5 h-5 text-blue-600" />
            <span>Breathing Rate</span>
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
                {breathingRate}
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
                Elderly Range
              </div>
            </div>
          </div>
          
          {/* Breathing rate scale */}
          <div className="space-y-2">
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              {/* Normal range indicator */}
              <div 
                className="absolute h-full bg-green-200"
                style={{
                  left: `${((normalMin - 4) / 32) * 100}%`,
                  width: `${((normalMax - normalMin) / 32) * 100}%`
                }}
              />
              {/* Current value indicator */}
              <div 
                className={`absolute h-2 w-1 rounded-full ${getStatusColor()}`}
                style={{ left: `${scalePosition}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>4</span>
              <span className="text-green-600 font-medium">Normal Range</span>
              <span>36</span>
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
          
          {/* Additional details */}
          {showDetails && (
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Resident Baseline:</span>
                  <div className="font-medium">
                    {residentProfile?.baseline.breathingRate.min || 12} - {residentProfile?.baseline.breathingRate.max || 20} BPM
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
              {residentProfile?.restrictions.breathingRate && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800">
                    Custom Alert Thresholds
                  </div>
                  <div className="text-xs text-yellow-700">
                    Min: {residentProfile.restrictions.breathingRate.min} BPM | 
                    Max: {residentProfile.restrictions.breathingRate.max} BPM
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingRateMonitor;