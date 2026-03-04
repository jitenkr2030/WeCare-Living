'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Volume2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity
} from 'lucide-react';
import { Room, OccupancyData } from '@/types/presence';

interface OccupancyHeatmapProps {
  rooms: Room[];
  occupancyData: OccupancyData[];
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

const OccupancyHeatmap: React.FC<OccupancyHeatmapProps> = ({
  rooms,
  occupancyData,
  timeRange = '24h',
  onTimeRangeChange
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'occupancy' | 'temperature' | 'humidity' | 'light' | 'noise'>('occupancy');
  const [heatmapView, setHeatmapView] = useState<'grid' | 'timeline'>('grid');

  // Generate mock occupancy data for demonstration
  const mockOccupancyData = useMemo(() => {
    const data: OccupancyData[] = [];
    const now = new Date();
    
    rooms.forEach(room => {
      // Generate data points for the last 24 hours
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
        
        // Simulate realistic occupancy patterns
        let occupancy = 0;
        const hour = timestamp.getHours();
        
        if (room.type === 'bedroom') {
          occupancy = hour >= 22 || hour <= 6 ? Math.random() * 0.8 + 0.2 : Math.random() * 0.3;
        } else if (room.type === 'kitchen') {
          occupancy = (hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 20) ? Math.random() * 0.6 + 0.4 : Math.random() * 0.2;
        } else if (room.type === 'living_room') {
          occupancy = hour >= 16 && hour <= 22 ? Math.random() * 0.7 + 0.3 : Math.random() * 0.4;
        } else if (room.type === 'bathroom') {
          occupancy = Math.random() * 0.3; // Random bathroom usage
        } else {
          occupancy = Math.random() * 0.5; // Hallway
        }
        
        data.push({
          roomId: room.id,
          roomName: room.name,
          timestamp,
          occupancy: Math.round(occupancy * room.maxOccupancy),
          temperature: 20 + Math.random() * 8, // 20-28°C
          humidity: 40 + Math.random() * 30, // 40-70%
          lightLevel: Math.random() * 100, // 0-100%
          noiseLevel: Math.random() * 80 // 0-80dB
        });
      }
    });
    
    return data;
  }, [rooms]);

  const data = occupancyData.length > 0 ? occupancyData : mockOccupancyData;

  // Process data for heatmap
  const heatmapData = useMemo(() => {
    const hourlyData: { [hour: number]: { [roomId: string]: number[] } } = {};
    
    // Initialize hourly data structure
    for (let hour = 0; hour < 24; hour++) {
      hourlyData[hour] = {};
      rooms.forEach(room => {
        hourlyData[hour][room.id] = [];
      });
    }
    
    // Populate with actual data
    data.forEach(point => {
      const hour = point.timestamp.getHours();
      if (!hourlyData[hour][point.roomId]) {
        hourlyData[hour][point.roomId] = [];
      }
      
      let value = 0;
      switch (selectedMetric) {
        case 'occupancy':
          value = point.occupancy;
          break;
        case 'temperature':
          value = point.temperature || 0;
          break;
        case 'humidity':
          value = point.humidity || 0;
          break;
        case 'light':
          value = point.lightLevel || 0;
          break;
        case 'noise':
          value = point.noiseLevel || 0;
          break;
      }
      
      hourlyData[hour][point.roomId].push(value);
    });
    
    // Calculate averages for each hour and room
    const averagedData: { [hour: number]: { [roomId: string]: number } } = {};
    
    Object.keys(hourlyData).forEach(hour => {
      const hourNum = parseInt(hour);
      averagedData[hourNum] = {};
      
      Object.keys(hourlyData[hourNum]).forEach(roomId => {
        const values = hourlyData[hourNum][roomId];
        if (values.length > 0) {
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          averagedData[hourNum][roomId] = avg;
        }
      });
    });
    
    return averagedData;
  }, [data, rooms, selectedMetric]);

  const getHeatmapColor = (value: number, metric: typeof selectedMetric) => {
    let normalized = 0;
    let max = 100;
    
    switch (metric) {
      case 'occupancy':
        max = Math.max(...rooms.map(r => r.maxOccupancy));
        break;
      case 'temperature':
        max = 35;
        break;
      case 'humidity':
        max = 100;
        break;
      case 'light':
        max = 100;
        break;
      case 'noise':
        max = 100;
        break;
    }
    
    normalized = Math.min(value / max, 1);
    
    // Color gradient from blue (low) to red (high)
    if (normalized < 0.2) return 'bg-blue-100';
    if (normalized < 0.4) return 'bg-blue-200';
    if (normalized < 0.6) return 'bg-yellow-200';
    if (normalized < 0.8) return 'bg-orange-200';
    return 'bg-red-200';
  };

  const getMetricIcon = (metric: typeof selectedMetric) => {
    switch (metric) {
      case 'occupancy':
        return <Activity className="w-4 h-4" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4" />;
      case 'humidity':
        return <Droplets className="w-4 h-4" />;
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'noise':
        return <Volume2 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getMetricLabel = (metric: typeof selectedMetric) => {
    switch (metric) {
      case 'occupancy':
        return 'Occupancy Level';
      case 'temperature':
        return 'Temperature (°C)';
      case 'humidity':
        return 'Humidity (%)';
      case 'light':
        return 'Light Level (%)';
      case 'noise':
        return 'Noise Level (dB)';
      default:
        return 'Value';
    }
  };

  const getPeakHours = () => {
    const hourTotals: { [hour: number]: number } = {};
    
    for (let hour = 0; hour < 24; hour++) {
      let total = 0;
      let count = 0;
      
      rooms.forEach(room => {
        if (heatmapData[hour] && heatmapData[hour][room.id] !== undefined) {
          total += heatmapData[hour][room.id];
          count++;
        }
      });
      
      hourTotals[hour] = count > 0 ? total / count : 0;
    }
    
    return Object.entries(hourTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour, value]) => ({ hour: parseInt(hour), value }));
  };

  const getRoomStats = (roomId: string) => {
    const roomData = rooms.find(r => r.id === roomId);
    if (!roomData) return null;
    
    let total = 0;
    let count = 0;
    let min = Infinity;
    let max = -Infinity;
    
    for (let hour = 0; hour < 24; hour++) {
      if (heatmapData[hour] && heatmapData[hour][roomId] !== undefined) {
        const value = heatmapData[hour][roomId];
        total += value;
        count++;
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }
    
    if (count === 0) return null;
    
    return {
      average: total / count,
      min,
      max,
      peakHour: Object.entries(heatmapData)
        .filter(([, data]) => data[roomId] !== undefined)
        .sort(([,a], [,b]) => (b[roomId] || 0) - (a[roomId] || 0))[0]
    };
  };

  const peakHours = getPeakHours();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Occupancy Heatmap & Patterns</span>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="occupancy">Occupancy</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="light">Light Level</SelectItem>
                  <SelectItem value="noise">Noise Level</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={heatmapView} onValueChange={(value: any) => setHeatmapView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid View</SelectItem>
                  <SelectItem value="timeline">Timeline View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Peak Hours */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Peak Activity Hours</span>
            </div>
            <div className="flex space-x-4">
              {peakHours.map((peak, index) => (
                <Badge key={peak.hour} variant="secondary" className="text-sm">
                  {peak.hour}:00 - {Math.round(peak.value)} {selectedMetric === 'temperature' ? '°C' : '%'}
                </Badge>
              ))}
            </div>
          </div>

          {/* Heatmap Grid */}
          {heatmapView === 'grid' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border border-gray-200">Room / Hour</th>
                    {Array.from({ length: 24 }, (_, i) => (
                      <th key={i} className="text-center p-1 border border-gray-200 text-xs">
                        {i}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => {
                    const stats = getRoomStats(room.id);
                    
                    return (
                      <tr key={room.id}>
                        <td className="p-2 border border-gray-200 font-medium text-sm">
                          <div className="flex flex-col">
                            <span>{room.name}</span>
                            <span className="text-xs text-gray-500">
                              {stats ? `Avg: ${Math.round(stats.average)}` : 'No data'}
                            </span>
                          </div>
                        </td>
                        {Array.from({ length: 24 }, (_, hour) => {
                          const value = heatmapData[hour]?.[room.id];
                          const color = value !== undefined ? getHeatmapColor(value, selectedMetric) : 'bg-gray-50';
                          
                          return (
                            <td 
                              key={hour} 
                              className={`p-1 border border-gray-200 text-center text-xs ${color} hover:opacity-80 transition-opacity cursor-pointer`}
                              title={`${room.name} - ${hour}:00 - ${value !== undefined ? Math.round(value) : 'N/A'}`}
                            >
                              {value !== undefined ? Math.round(value) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Timeline View */}
          {heatmapView === 'timeline' && (
            <div className="space-y-4">
              {rooms.map(room => {
                const stats = getRoomStats(room.id);
                
                return (
                  <Card key={room.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(selectedMetric)}
                        <span className="font-medium">{room.name}</span>
                      </div>
                      {stats && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Avg: {Math.round(stats.average)}</span>
                          <span>Min: {Math.round(stats.min)}</span>
                          <span>Max: {Math.round(stats.max)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: 24 }, (_, hour) => {
                        const value = heatmapData[hour]?.[room.id];
                        const color = value !== undefined ? getHeatmapColor(value, selectedMetric) : 'bg-gray-50';
                        const height = value !== undefined ? Math.max(20, (value / 100) * 60) : 20;
                        
                        return (
                          <motion.div
                            key={hour}
                            className={`flex-1 ${color} rounded-t-sm relative group cursor-pointer`}
                            style={{ height: `${height}px` }}
                            whileHover={{ scale: 1.05 }}
                            title={`${hour}:00 - ${value !== undefined ? Math.round(value) : 'N/A'}`}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {hour}:00 - {value !== undefined ? Math.round(value) : 'N/A'}
                            </div>
                            <div className="text-xs text-center mt-1 text-gray-600">
                              {hour}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-600">Low</span>
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-blue-100"></div>
              <div className="w-4 h-4 bg-blue-200"></div>
              <div className="w-4 h-4 bg-yellow-200"></div>
              <div className="w-4 h-4 bg-orange-200"></div>
              <div className="w-4 h-4 bg-red-200"></div>
            </div>
            <span className="text-sm text-gray-600">High</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OccupancyHeatmap;