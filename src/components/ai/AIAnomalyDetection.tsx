'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Heart,
  Users,
  Clock,
  Target,
  Zap,
  Eye,
  Settings,
  RefreshCw,
  Download,
  BarChart3,
  LineChart,
  PieChart,
  Radar,
  Sparkles,
  Cpu,
  Database,
  Wifi,
  Thermometer,
  Moon,
  Sun
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
  FallRiskAssessment 
} from '@/types/fallDetection';

interface AnomalyPattern {
  id: string;
  type: 'vital' | 'behavioral' | 'environmental' | 'predictive';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  title: string;
  description: string;
  residentId: string;
  residentName: string;
  timestamp: Date;
  pattern: string[];
  riskScore: number;
  recommendations: string[];
  status: 'active' | 'resolved' | 'monitoring';
  trend: 'improving' | 'stable' | 'deteriorating';
  impact: 'low' | 'medium' | 'high';
}

interface AIModel {
  id: string;
  name: string;
  type: 'vital_analysis' | 'fall_prediction' | 'behavior_pattern' | 'sleep_quality';
  accuracy: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'inactive';
  dataPoints: number;
  predictions: number;
  confidence: number;
}

interface AIAnomalyDetectionProps {
  residents: Resident[];
  vitalSignsReadings: VitalSignsReading[];
  breathingPatterns: BreathingPattern[];
  sleepSessions: SleepSession[];
  vitalSignsAlerts: VitalSignsAlert[];
  fallEvents: FallEvent[];
  immobilityAlerts: ImmobilityAlert[];
  riskAssessments: FallRiskAssessment[];
}

const AIAnomalyDetection: React.FC<AIAnomalyDetectionProps> = ({
  residents,
  vitalSignsReadings,
  breathingPatterns,
  sleepSessions,
  vitalSignsAlerts,
  fallEvents,
  immobilityAlerts,
  riskAssessments
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Generate AI models
  const aiModels: AIModel[] = useMemo(() => [
    {
      id: 'vital_analysis',
      name: 'Vital Signs Analysis',
      type: 'vital_analysis',
      accuracy: 94.2,
      lastTrained: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
      dataPoints: 15420,
      predictions: 892,
      confidence: 87.5
    },
    {
      id: 'fall_prediction',
      name: 'Fall Prediction Engine',
      type: 'fall_prediction',
      accuracy: 91.8,
      lastTrained: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'active',
      dataPoints: 8765,
      predictions: 234,
      confidence: 82.3
    },
    {
      id: 'behavior_pattern',
      name: 'Behavior Pattern Recognition',
      type: 'behavior_pattern',
      accuracy: 89.6,
      lastTrained: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'active',
      dataPoints: 12340,
      predictions: 567,
      confidence: 79.8
    },
    {
      id: 'sleep_quality',
      name: 'Sleep Quality Analysis',
      type: 'sleep_quality',
      accuracy: 92.1,
      lastTrained: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'training',
      dataPoints: 9876,
      predictions: 445,
      confidence: 85.2
    }
  ], []);

  // Generate anomaly patterns
  const anomalyPatterns: AnomalyPattern[] = useMemo(() => {
    const patterns: AnomalyPattern[] = [];
    const now = new Date();

    // Helper function to get resident name
    const getResidentName = (residentId: string) => {
      return residents.find(r => r.id === residentId)?.name || 'Unknown Resident';
    };

    // Vital sign anomalies
    residents.slice(0, 3).forEach(resident => {
      patterns.push({
        id: `vital-${resident.id}`,
        type: 'vital',
        severity: Math.random() > 0.7 ? 'high' : 'medium',
        confidence: 75 + Math.random() * 20,
        title: 'Irregular Breathing Pattern',
        description: `Detected unusual breathing pattern variations during sleep periods`,
        residentId: resident.id,
        residentName: resident.name,
        timestamp: new Date(now.getTime() - Math.random() * 12 * 60 * 60 * 1000),
        pattern: ['elevated_rate', 'irregular_rhythm', 'night_variations'],
        riskScore: 65 + Math.random() * 25,
        recommendations: [
          'Monitor vital signs closely for next 24 hours',
          'Consider consulting with healthcare provider',
          'Adjust sleep position if needed'
        ],
        status: Math.random() > 0.5 ? 'active' : 'monitoring',
        trend: ['improving', 'stable', 'deteriorating'][Math.floor(Math.random() * 3)] as any,
        impact: 'medium'
      });
    });

    // Behavioral anomalies
    residents.slice(2, 5).forEach(resident => {
      patterns.push({
        id: `behavioral-${resident.id}`,
        type: 'behavioral',
        severity: Math.random() > 0.8 ? 'critical' : 'medium',
        confidence: 80 + Math.random() * 15,
        title: 'Unusual Nighttime Activity',
        description: `Increased movement patterns detected during typical sleep hours`,
        residentId: resident.id,
        residentName: resident.name,
        timestamp: new Date(now.getTime() - Math.random() * 8 * 60 * 60 * 1000),
        pattern: ['night_wandering', 'frequent_bathroom_visits', 'room_changes'],
        riskScore: 70 + Math.random() * 20,
        recommendations: [
          'Check for potential sleep disorders',
          'Evaluate medication timing',
          'Consider room safety improvements'
        ],
        status: 'active',
        trend: 'stable',
        impact: 'high'
      });
    });

    // Predictive anomalies
    residents.slice(1, 4).forEach(resident => {
      patterns.push({
        id: `predictive-${resident.id}`,
        type: 'predictive',
        severity: Math.random() > 0.6 ? 'high' : 'medium',
        confidence: 70 + Math.random() * 25,
        title: 'Fall Risk Increase',
        description: `AI models predict elevated fall risk based on recent patterns`,
        residentId: resident.id,
        residentName: resident.name,
        timestamp: new Date(now.getTime() - Math.random() * 6 * 60 * 60 * 1000),
        pattern: ['decreased_mobility', 'balance_issues', 'medication_effects'],
        riskScore: 75 + Math.random() * 15,
        recommendations: [
          'Increase supervision during mobility',
          'Review fall prevention measures',
          'Consider physical therapy consultation'
        ],
        status: 'monitoring',
        trend: Math.random() > 0.5 ? 'deteriorating' : 'stable',
        impact: 'high'
      });
    });

    return patterns.sort((a, b) => b.riskScore - a.riskScore);
  }, [residents]);

  // Filter patterns based on selected criteria
  const filteredPatterns = useMemo(() => {
    let filtered = [...anomalyPatterns];

    if (selectedModel !== 'all') {
      filtered = filtered.filter(pattern => {
        switch (selectedModel) {
          case 'vital_analysis': return pattern.type === 'vital';
          case 'fall_prediction': return pattern.type === 'predictive';
          case 'behavior_pattern': return pattern.type === 'behavioral';
          case 'sleep_quality': return pattern.type === 'vital' && pattern.title.includes('Sleep');
          default: return true;
        }
      });
    }

    return filtered;
  }, [anomalyPatterns, selectedModel]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'deteriorating': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'vital_analysis': return <Heart className="w-5 h-5" />;
      case 'fall_prediction': return <AlertTriangle className="w-5 h-5" />;
      case 'behavior_pattern': return <Users className="w-5 h-5" />;
      case 'sleep_quality': return <Moon className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Anomaly Detection</span>
              <Badge variant="secondary">{filteredPatterns.length} patterns</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* AI Models Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {aiModels.map((model) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getModelIcon(model.type)}
                        <span className="font-medium text-sm">{model.name}</span>
                      </div>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {model.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Accuracy</span>
                        <span className="font-medium">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Confidence</span>
                        <span className="font-medium">{model.confidence}%</span>
                      </div>
                      <Progress value={model.confidence} className="h-2" />
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{model.dataPoints.toLocaleString()} points</span>
                        <span>{model.predictions} predictions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{filteredPatterns.length}</p>
              <p className="text-sm text-gray-600">Active Patterns</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">
                {filteredPatterns.filter(p => p.severity === 'critical').length}
              </p>
              <p className="text-sm text-gray-600">Critical Anomalies</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(filteredPatterns.reduce((acc, p) => acc + p.confidence, 0) / filteredPatterns.length)}%
              </p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {filteredPatterns.filter(p => p.trend === 'improving').length}
              </p>
              <p className="text-sm text-gray-600">Improving</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detected Anomaly Patterns</span>
            <div className="flex items-center space-x-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Models</option>
                <option value="vital_analysis">Vital Analysis</option>
                <option value="fall_prediction">Fall Prediction</option>
                <option value="behavior_pattern">Behavior Pattern</option>
                <option value="sleep_quality">Sleep Quality</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{pattern.title}</h3>
                        <Badge className={getSeverityColor(pattern.severity)}>
                          {pattern.severity}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(pattern.trend)}
                          <span className="text-xs text-gray-500">{pattern.trend}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{pattern.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">Resident:</span>
                          <span className="ml-2 font-medium">{pattern.residentName}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Risk Score:</span>
                          <span className="ml-2 font-medium">{Math.round(pattern.riskScore)}%</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Confidence:</span>
                          <span className="ml-2 font-medium">{Math.round(pattern.confidence)}%</span>
                        </div>
                      </div>

                      {/* Pattern Details */}
                      {showDetails === pattern.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t pt-3 mt-3"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Detected Patterns:</h4>
                              <div className="space-y-1">
                                {pattern.pattern.map((p, i) => (
                                  <div key={i} className="text-sm text-gray-600 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span>{p.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Recommendations:</h4>
                              <div className="space-y-1">
                                {pattern.recommendations.map((rec, i) => (
                                  <div key={i} className="text-sm text-gray-600 flex items-start space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{rec}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-xs text-gray-500">
                        {pattern.timestamp.toLocaleString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetails(showDetails === pattern.id ? null : pattern.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {showDetails === pattern.id ? 'Hide' : 'Details'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Insights & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Positive Trends</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Overall vital signs stability improving by 12%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Fall prediction accuracy increased to 91.8%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Sleep quality patterns showing improvement</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span>Areas of Concern</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>3 residents showing elevated fall risk patterns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>Nighttime activity anomalies detected</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>Medication timing may need adjustment</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnomalyDetection;