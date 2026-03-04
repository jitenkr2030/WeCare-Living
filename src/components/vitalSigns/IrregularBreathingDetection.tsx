'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Wind, 
  Clock, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Bell
} from 'lucide-react';
import { BreathingPattern, VitalSignsAlert } from '@/types/vitalSigns';

interface IrregularBreathingDetectionProps {
  breathingPatterns: BreathingPattern[];
  alerts: VitalSignsAlert[];
  showDetails?: boolean;
  onAcknowledgeAlert?: (alertId: string) => void;
}

const IrregularBreathingDetection: React.FC<IrregularBreathingDetectionProps> = ({
  breathingPatterns,
  alerts,
  showDetails = false,
  onAcknowledgeAlert
}) => {
  // Get recent irregular breathing patterns
  const recentPatterns = breathingPatterns
    .filter(pattern => pattern.pattern !== 'normal')
    .slice(0, 5);
  
  // Get breathing-related alerts
  const breathingAlerts = alerts.filter(alert => 
    alert.type === 'irregular_breathing' || 
    alert.type === 'breathing_rate' ||
    alert.type === 'sleep_apnea'
  );
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-500';
      case 'moderate': return 'bg-orange-500';
      case 'mild': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'apnea': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'irregular': return <Activity className="w-4 h-4 text-orange-500" />;
      case 'rapid': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'slow': return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case 'shallow': return <Wind className="w-4 h-4 text-yellow-500" />;
      case 'deep': return <Wind className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const getPatternDescription = (pattern: string) => {
    switch (pattern) {
      case 'apnea': return 'Breathing pauses detected';
      case 'irregular': return 'Irregular breathing pattern';
      case 'rapid': return 'Rapid breathing (tachypnea)';
      case 'slow': return 'Slow breathing (bradypnea)';
      case 'shallow': return 'Shallow breathing detected';
      case 'deep': return 'Deep breathing pattern';
      default: return 'Breathing pattern detected';
    }
  };
  
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const hasActiveAlerts = breathingAlerts.some(alert => !alert.acknowledged);
  const criticalAlerts = breathingAlerts.filter(alert => 
    alert.severity === 'critical' && !alert.acknowledged
  );
  
  return (
    <Card className={`${showDetails ? 'col-span-2' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-orange-600" />
            <span>Irregular Breathing Detection</span>
            {hasActiveAlerts && (
              <Badge variant="destructive" className="animate-pulse">
                {breathingAlerts.filter(a => !a.acknowledged).length} Active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="bg-red-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Critical
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Critical alerts banner */}
          {criticalAlerts.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-800">
                      Critical Breathing Alert
                    </div>
                    <div className="text-sm text-red-700">
                      {criticalAlerts[0].message}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => onAcknowledgeAlert?.(criticalAlerts[0].id)}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Acknowledge
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Recent patterns */}
          {recentPatterns.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                Recent Irregular Patterns
              </div>
              {recentPatterns.map((pattern) => (
                <div 
                  key={pattern.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getPatternIcon(pattern.pattern)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {getPatternDescription(pattern.pattern)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {pattern.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="secondary"
                      className={getSeverityColor(pattern.severity)}
                    >
                      {pattern.severity}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDuration(pattern.duration)} • {Math.round(pattern.confidence * 100)}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Wind className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <div className="font-medium">No irregular breathing detected</div>
              <div className="text-sm">Breathing patterns are normal</div>
            </div>
          )}
          
          {/* Active alerts */}
          {breathingAlerts.filter(alert => !alert.acknowledged).length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Active Alerts
              </div>
              {breathingAlerts
                .filter(alert => !alert.acknowledged)
                .slice(0, 3)
                .map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                    alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {alert.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {alert.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge 
                        variant="secondary"
                        className={getSeverityColor(alert.severity)}
                      >
                        {alert.severity}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onAcknowledgeAlert?.(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Statistics */}
          {showDetails && (
            <div className="pt-3 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">
                    {breathingPatterns.filter(p => p.severity === 'severe').length}
                  </div>
                  <div className="text-sm text-gray-600">Severe Events</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">
                    {breathingPatterns.filter(p => p.severity === 'moderate').length}
                  </div>
                  <div className="text-sm text-gray-600">Moderate Events</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round(breathingPatterns.reduce((acc, p) => acc + p.confidence, 0) / breathingPatterns.length * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Confidence</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IrregularBreathingDetection;