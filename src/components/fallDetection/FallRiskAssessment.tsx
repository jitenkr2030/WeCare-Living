'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Shield,
  User,
  Calendar,
  Activity,
  Eye,
  Brain,
  Heart,
  Zap,
  Target,
  CheckCircle,
  Clock,
  FileText,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';

import type { FallRiskAssessment } from '@/types/fallDetection';

interface FallRiskAssessmentProps {
  riskAssessments: FallRiskAssessment[];
  onAssessmentUpdate?: (assessmentId: string) => void;
  onExportReport?: (assessmentId: string) => void;
}

const FallRiskAssessmentComponent: React.FC<FallRiskAssessmentProps> = ({
  riskAssessments,
  onAssessmentUpdate,
  onExportReport
}) => {
  const [sortBy, setSortBy] = useState<'risk' | 'name' | 'date'>('risk');
  const [filterLevel, setFilterLevel] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Sort and filter assessments
  const processedAssessments = useMemo(() => {
    let filtered = [...riskAssessments];

    // Apply risk level filter
    if (filterLevel !== 'all') {
      filtered = filtered.filter(a => {
        if (filterLevel === 'high') return a.overallRiskScore >= 70;
        if (filterLevel === 'medium') return a.overallRiskScore >= 40 && a.overallRiskScore < 70;
        if (filterLevel === 'low') return a.overallRiskScore < 40;
        return true;
      });
    }

    // Sort assessments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'risk':
          return b.overallRiskScore - a.overallRiskScore;
        case 'name':
          return a.residentName.localeCompare(b.residentName);
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [riskAssessments, sortBy, filterLevel]);

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'red', icon: AlertTriangle };
    if (score >= 60) return { level: 'High', color: 'orange', icon: AlertTriangle };
    if (score >= 40) return { level: 'Medium', color: 'yellow', icon: AlertTriangle };
    return { level: 'Low', color: 'green', icon: Shield };
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  const getDaysUntilReview = (reviewDate: Date) => {
    const now = new Date();
    const diff = new Date(reviewDate).getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Fall Risk Assessments</span>
              <Badge variant="secondary">{processedAssessments.length} residents</Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk">Sort by Risk</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="date">Sort by Date</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterLevel} onValueChange={(value: any) => setFilterLevel(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['critical', 'high', 'medium', 'low'].map((level, index) => {
          const count = riskAssessments.filter(a => {
            const score = a.overallRiskScore;
            if (level === 'critical') return score >= 80;
            if (level === 'high') return score >= 60 && score < 80;
            if (level === 'medium') return score >= 40 && score < 60;
            return score < 40;
          }).length;

          const colors = {
            critical: 'red',
            high: 'orange',
            medium: 'yellow',
            low: 'green'
          };

          return (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-${colors[level as keyof typeof colors]}-200 bg-${colors[level as keyof typeof colors]}-50`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{level} Risk</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${colors[level as keyof typeof colors]}-100 rounded-full flex items-center justify-center`}>
                      {level === 'critical' || level === 'high' ? 
                        <AlertTriangle className={`w-6 h-6 text-${colors[level as keyof typeof colors]}-600`} /> :
                        <Shield className={`w-6 h-6 text-${colors[level as keyof typeof colors]}-600`} />
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Assessment Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {processedAssessments.map((assessment, index) => {
            const riskInfo = getRiskLevel(assessment.overallRiskScore);
            const daysUntilReview = getDaysUntilReview(assessment.reviewDate);
            const Icon = riskInfo.icon;

            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-${riskInfo.color}-200`}>
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-${riskInfo.color}-100 rounded-full flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${riskInfo.color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{assessment.residentName}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getRiskColor(assessment.overallRiskScore)}>
                              {riskInfo.level} Risk ({assessment.overallRiskScore}%)
                            </Badge>
                            <span className="text-sm text-gray-600">
                              Assessed {new Date(assessment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {daysUntilReview <= 7 && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            <Clock className="w-3 h-3 mr-1" />
                            Review in {daysUntilReview} days
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAssessmentUpdate?.(assessment.id)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onExportReport?.(assessment.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>

                    {/* Risk Score Visualization */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Risk Score</span>
                        <span className="text-sm font-bold">{assessment.overallRiskScore}%</span>
                      </div>
                      <Progress 
                        value={assessment.overallRiskScore} 
                        className={`h-3 ${getProgressColor(assessment.overallRiskScore)}`}
                      />
                    </div>

                    {/* Risk Factors */}
                    <Tabs defaultValue="factors" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="factors">Risk Factors</TabsTrigger>
                        <TabsTrigger value="movement">Movement Patterns</TabsTrigger>
                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                      </TabsList>

                      <TabsContent value="factors" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <User className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm text-gray-600">Age</p>
                            <p className="text-lg font-semibold">{assessment.riskFactors.age} years</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm text-gray-600">Previous Falls</p>
                            <p className="text-lg font-semibold">{assessment.riskFactors.previousFalls}</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <FileText className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm text-gray-600">Medications</p>
                            <p className="text-lg font-semibold">{assessment.riskFactors.medications}</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Activity className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm text-gray-600">Mobility</p>
                            <p className="text-lg font-semibold">{assessment.riskFactors.mobilityIssues}/10</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Vision Problems</span>
                              <span className="text-sm font-medium">{assessment.riskFactors.visionProblems}/10</span>
                            </div>
                            <Progress value={assessment.riskFactors.visionProblems * 10} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Cognitive Impairment</span>
                              <span className="text-sm font-medium">{assessment.riskFactors.cognitiveImpairment}/10</span>
                            </div>
                            <Progress value={assessment.riskFactors.cognitiveImpairment * 10} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Environmental Hazards</span>
                              <span className="text-sm font-medium">{assessment.riskFactors.environmentalHazards}/10</span>
                            </div>
                            <Progress value={assessment.riskFactors.environmentalHazards * 10} className="h-2" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="movement" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Zap className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Average Speed</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                              {assessment.movementPatterns.averageSpeed.toFixed(2)} m/s
                            </p>
                            <p className="text-sm text-gray-600">
                              {assessment.movementPatterns.averageSpeed < 0.5 ? 'Below normal' : 'Normal'}
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Activity className="w-5 h-5 text-green-600" />
                              <span className="font-medium">Variability</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                              {(assessment.movementPatterns.variability * 100).toFixed(0)}%
                                    </p>
                            <p className="text-sm text-gray-600">
                                      {assessment.movementPatterns.variability > 0.7 ? 'High variation' : 'Stable'}
                                    </p>
                                  </div>
                                  <div className="p-4 bg-orange-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Clock className="w-5 h-5 text-orange-600" />
                                      <span className="font-medium">Night Activity</span>
                                    </div>
                                    <p className="text-2xl font-bold text-orange-600">
                                      {assessment.movementPatterns.nightActivity}%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {assessment.movementPatterns.nightActivity > 30 ? 'High night activity' : 'Normal'}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 bg-purple-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Target className="w-5 h-5 text-purple-600" />
                                      <span className="font-medium">Bathroom Frequency</span>
                                    </div>
                                    <p className="text-xl font-bold text-purple-600">
                                      {assessment.movementPatterns.bathroomFrequency} times/night
                                    </p>
                                  </div>
                                  <div className="p-4 bg-red-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Heart className="w-5 h-5 text-red-600" />
                                      <span className="font-medium">Balance Issues</span>
                                    </div>
                                    <p className="text-xl font-bold text-red-600">
                                      {assessment.movementPatterns.balanceIssues}/10
                                    </p>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="recommendations" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span>Immediate Actions</span>
                                    </h4>
                                    <ul className="space-y-2">
                                      {assessment.recommendations.map((rec, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-sm">{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                                      <Shield className="w-4 h-4 text-blue-600" />
                                      <span>Preventive Measures</span>
                                    </h4>
                                    <ul className="space-y-2">
                                      {assessment.preventiveMeasures.map((measure, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                          <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-sm">{measure}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="w-4 h-4 text-blue-600" />
                                      <span className="font-medium">Next Review Date</span>
                                    </div>
                                    <span className="font-bold text-blue-600">
                                      {new Date(assessment.reviewDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {daysUntilReview <= 7 && (
                                    <div className="mt-2 flex items-center space-x-2 text-orange-600">
                                      <Info className="w-4 h-4" />
                                      <span className="text-sm">
                                        Review due in {daysUntilReview} day{daysUntilReview !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {processedAssessments.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No risk assessments found</h3>
                      <p className="text-gray-600">
                        {filterLevel !== 'all' 
                          ? 'Try adjusting your risk level filter'
                          : 'No risk assessments have been completed yet'
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        };

        export default FallRiskAssessmentComponent;