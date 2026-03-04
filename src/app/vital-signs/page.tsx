'use client';

import React, { useState, useEffect } from 'react';
import VitalSignsDashboard from '@/components/vitalSigns/VitalSignsDashboard';
import { MockDataGenerator } from '@/lib/mockData';
import { Resident } from '@/types/presence';
import type {
  VitalSignsReading,
  BreathingPattern,
  SleepSession,
  VitalSignsAlert,
  VitalSignsStats,
  ResidentVitalProfile,
  WellnessIndicator
} from '@/types/vitalSigns';

const VitalSignsMonitoringPage: React.FC = () => {
  const [data, setData] = useState<{
    residents: Resident[];
    vitalSignsReadings: VitalSignsReading[];
    breathingPatterns: BreathingPattern[];
    sleepSessions: SleepSession[];
    vitalSignsAlerts: VitalSignsAlert[];
    stats: VitalSignsStats;
    residentProfiles: ResidentVitalProfile[];
    wellnessIndicators: WellnessIndicator[];
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      try {
        const residents = MockDataGenerator.generateResidents(8);
        const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);
        
        setData({
          residents,
          ...vitalSignsData
        });
      } catch (error) {
        console.error('Error initializing vital signs data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh || !data) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate real-time updates
      if (Math.random() > 0.7) {
        setData(prevData => {
          if (!prevData) return prevData;
          
          // Add new reading
          const newReading = MockDataGenerator.generateVitalSignsReadings(1, prevData.residents)[0];
          const updatedReadings = [newReading, ...prevData.vitalSignsReadings.slice(0, 99)];
          
          // Update stats
          const updatedStats = {
            ...prevData.stats,
            totalReadings: prevData.stats.totalReadings + 1,
            lastUpdate: new Date()
          };

          return {
            ...prevData,
            vitalSignsReadings: updatedReadings,
            stats: updatedStats
          };
        });
      }
    }, 8000); // Refresh every 8 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, data]);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    if (data) {
      const residents = data.residents;
      const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);
      
      setData({
        residents,
        ...vitalSignsData
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Vital Signs Monitor...</h2>
          <p className="text-gray-500 mt-2">Initializing WeCare Living vital signs monitoring</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">System Error</h2>
          <p className="text-gray-500 mt-2">Unable to load vital signs monitoring data</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    residents,
    vitalSignsReadings,
    breathingPatterns,
    sleepSessions,
    vitalSignsAlerts,
    stats,
    residentProfiles,
    wellnessIndicators
  } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">W</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">WeCare Living</h1>
                  <p className="text-sm text-gray-500">Vital Signs Monitoring System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* System Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  stats.systemStatus === 'active' ? 'bg-green-500' :
                  stats.systemStatus === 'warning' ? 'bg-yellow-500' :
                  stats.systemStatus === 'critical' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <span className="text-sm font-medium capitalize">
                  {stats.systemStatus}
                </span>
              </div>
              
              {/* Data Quality */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Data Quality:</span>
                <span className={`text-sm font-medium ${
                  stats.dataQuality === 'excellent' ? 'text-green-600' :
                  stats.dataQuality === 'good' ? 'text-blue-600' :
                  stats.dataQuality === 'fair' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {stats.dataQuality}
                </span>
              </div>
              
              {/* Auto-refresh status */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                autoRefresh ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {autoRefresh ? 'LIVE' : 'PAUSED'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Monitoring:</span>
                <span className="text-sm font-medium">{stats.residentsMonitored} Residents</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Readings:</span>
                <span className="text-sm font-medium">{stats.totalReadings}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Active Alerts:</span>
                <span className="text-sm font-medium text-red-600">{stats.activeAlerts}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Avg Breathing:</span>
                <span className="text-sm font-medium">{stats.averageBreathingRate} BPM</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Avg Heart Rate:</span>
                <span className="text-sm font-medium">{stats.averageHeartRate} BPM</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Uptime:</span>
                <span className="text-sm font-medium">{stats.uptime.toFixed(1)}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Last Update:</span>
                <span className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <VitalSignsDashboard
          residents={residents}
          vitalSignsReadings={vitalSignsReadings}
          breathingPatterns={breathingPatterns}
          sleepSessions={sleepSessions}
          vitalSignsAlerts={vitalSignsAlerts}
          stats={stats}
          residentProfiles={residentProfiles}
          wellnessIndicators={wellnessIndicators}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default VitalSignsMonitoringPage;