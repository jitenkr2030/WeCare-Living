'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Filter, 
  Search, 
  Printer, 
  Mail, 
  Share2, 
  Database, 
  FileSpreadsheet, 
  FileImage, 
  FilePdf,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Settings,
  Zap,
  Target,
  Award,
  Star,
  Medal,
  Trophy,
  Flag,
  Bookmark,
  BookmarkCheck
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

interface Report {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom' | 'incident' | 'compliance';
  category: 'vital_signs' | 'fall_detection' | 'presence' | 'caregiver' | 'system' | 'compliance' | 'incident';
  status: 'generating' | 'completed' | 'scheduled' | 'failed';
  generatedAt: Date;
  scheduledFor?: Date;
  fileSize: number;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  description: string;
  parameters: {
    dateRange: {
      start: Date;
      end: Date;
    };
    residents?: string[];
    rooms?: string[];
    metrics?: string[];
    filters?: Record<string, any>;
  };
  metrics: {
    totalRecords: number;
    processingTime: number;
    accuracy: number;
    completeness: number;
  };
  downloadUrl?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  icon: React.ReactNode;
  parameters: {
    required: string[];
    optional: string[];
  };
  formats: string[];
  schedule: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    recipients: string[];
  };
}

interface ReportsProps {
  residents: Resident[];
  vitalSignsReadings: VitalSignsReading[];
  breathingPatterns: BreathingPattern[];
  sleepSessions: SleepSession[];
  vitalSignsAlerts: VitalSignsAlert[];
  fallEvents: FallEvent[];
  immobilityAlerts: ImmobilityAlert[];
  riskAssessments: FallRiskAssessment[];
}

const ReportsInterface: React.FC<ReportsProps> = ({
  residents,
  vitalSignsReadings,
  breathingPatterns,
  sleepSessions,
  vitalSignsAlerts,
  fallEvents,
  immobilityAlerts,
  riskAssessments
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{start: Date; end: Date}>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Generate mock reports
  const reports: Report[] = useMemo(() => [
    {
      id: 'report-1',
      name: 'Daily Vital Signs Summary',
      type: 'daily',
      category: 'vital_signs',
      status: 'completed',
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      fileSize: 2.4,
      format: 'pdf',
      description: 'Comprehensive daily summary of all vital signs readings',
      parameters: {
        dateRange: {
          start: new Date(Date.now() - 24 * 60 * 60 * 1000),
          end: new Date()
        },
        residents: residents.map(r => r.id),
        metrics: ['heart_rate', 'breathing_rate', 'blood_pressure', 'oxygen_saturation']
      },
      metrics: {
        totalRecords: 1248,
        processingTime: 3.2,
        accuracy: 99.2,
        completeness: 98.5
      },
      downloadUrl: '/api/reports/download/report-1.pdf'
    },
    {
      id: 'report-2',
      name: 'Weekly Fall Detection Analysis',
      type: 'weekly',
      category: 'fall_detection',
      status: 'completed',
      generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      fileSize: 3.8,
      format: 'excel',
      description: 'Detailed analysis of fall detection events and risk factors',
      parameters: {
        dateRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        residents: residents.slice(0, 6).map(r => r.id),
        metrics: ['fall_events', 'risk_assessments', 'response_times', 'prevention_measures']
      },
      metrics: {
        totalRecords: 89,
        processingTime: 5.1,
        accuracy: 96.8,
        completeness: 94.2
      },
      downloadUrl: '/api/reports/download/report-2.xlsx'
    },
    {
      id: 'report-3',
      name: 'Monthly Caregiver Performance',
      type: 'monthly',
      category: 'caregiver',
      status: 'generating',
      generatedAt: new Date(Date.now() - 15 * 60 * 1000),
      fileSize: 0,
      format: 'pdf',
      description: 'Monthly performance metrics for all caregivers',
      parameters: {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        metrics: ['response_time', 'task_completion', 'satisfaction', 'training_hours']
      },
      metrics: {
        totalRecords: 0,
        processingTime: 0,
        accuracy: 0,
        completeness: 0
      }
    },
    {
      id: 'report-4',
      name: 'Incident Report - Fall Event',
      type: 'incident',
      category: 'incident',
      status: 'completed',
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      fileSize: 1.2,
      format: 'pdf',
      description: 'Detailed incident report for fall event in Master Bedroom',
      parameters: {
        dateRange: {
          start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        residents: ['resident-1'],
        metrics: ['incident_details', 'witness_statements', 'timeline', 'recommendations']
      },
      metrics: {
        totalRecords: 156,
        processingTime: 2.8,
        accuracy: 100,
        completeness: 99.8
      },
      downloadUrl: '/api/reports/download/report-4.pdf'
    },
    {
      id: 'report-5',
      name: 'System Health & Performance',
      type: 'weekly',
      category: 'system',
      status: 'scheduled',
      scheduledFor: new Date(Date.now() + 60 * 60 * 1000),
      fileSize: 0,
      format: 'json',
      description: 'System performance metrics and health status',
      parameters: {
        dateRange: {
          start: new Date(),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        metrics: ['uptime', 'response_times', 'error_rates', 'resource_usage']
      },
      metrics: {
        totalRecords: 0,
        processingTime: 0,
        accuracy: 0,
        completeness: 0
      }
    }
  ], []);

  // Report templates
  const reportTemplates: ReportTemplate[] = useMemo(() => [
    {
      id: 'vital-daily',
      name: 'Daily Vital Signs Report',
      description: 'Daily summary of all vital signs readings and trends',
      category: 'vital_signs',
      type: 'daily',
      icon: <Activity className="w-5 h-5" />,
      parameters: {
        required: ['date_range', 'residents'],
        optional: ['metrics', 'format', 'include_charts']
      },
      formats: ['pdf', 'excel', 'csv'],
      schedule: {
        enabled: true,
        frequency: 'daily',
        time: '08:00',
        recipients: ['admin@wecareliving.com']
      }
    },
    {
      id: 'fall-weekly',
      name: 'Weekly Fall Detection Report',
      description: 'Comprehensive weekly analysis of fall detection and prevention',
      category: 'fall_detection',
      type: 'weekly',
      icon: <AlertTriangle className="w-5 h-5" />,
      parameters: {
        required: ['date_range', 'rooms'],
        optional: ['risk_analysis', 'prevention_measures', 'response_times']
      },
      formats: ['pdf', 'excel'],
      schedule: {
        enabled: true,
        frequency: 'weekly',
        time: '09:00',
        recipients: ['admin@wecareliving.com', 'caregivers@wecareliving.com']
      }
    },
    {
      id: 'presence-monthly',
      name: 'Monthly Presence & Movement Report',
      description: 'Monthly presence patterns and movement analysis',
      category: 'presence',
      type: 'monthly',
      icon: <Users className="w-5 h-5" />,
      parameters: {
        required: ['date_range', 'facilities'],
        optional: ['heatmaps', 'patterns', 'anomalies']
      },
      formats: ['pdf', 'excel', 'json'],
      schedule: {
        enabled: false,
        frequency: 'monthly',
        time: '10:00',
        recipients: ['admin@wecareliving.com']
      }
    },
    {
      id: 'caregiver-performance',
      name: 'Caregiver Performance Report',
      description: 'Performance metrics and analytics for caregiver team',
      category: 'caregiver',
      type: 'monthly',
      icon: <Award className="w-5 h-5" />,
      parameters: {
        required: ['date_range', 'caregivers'],
        optional: ['training', 'certifications', 'feedback']
      },
      formats: ['pdf', 'excel'],
      schedule: {
        enabled: true,
        frequency: 'monthly',
        time: '08:30',
        recipients: ['admin@wecareliving.com', 'hr@wecareliving.com']
      }
    },
    {
      id: 'compliance-quarterly',
      name: 'Regulatory Compliance Report',
      description: 'Quarterly compliance and regulatory reporting',
      category: 'compliance',
      type: 'quarterly',
      icon: <Flag className="w-5 h-5" />,
      parameters: {
        required: ['date_range', 'regulations'],
        optional: ['audit_trail', 'documentation', 'signatures']
      },
      formats: ['pdf', 'excel'],
      schedule: {
        enabled: true,
        frequency: 'quarterly',
        time: '09:00',
        recipients: ['admin@wecareliving.com', 'compliance@wecareliving.com', 'legal@wecareliving.com']
      }
    }
  ], []);

  // Filter reports based on selected criteria
  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(report => report.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(report => report.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(report => 
        report.name.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.type.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }, [reports, selectedCategory, selectedType, selectedStatus, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'generating': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FilePdf className="w-4 h-4" />;
      case 'excel': return <FileSpreadsheet className="w-4 h-4" />;
      case 'csv': return <FileSpreadsheet className="w-4 h-4" />;
      case 'json': return <Database className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vital_signs': return <Activity className="w-5 h-5" />;
      case 'fall_detection': return <AlertTriangle className="w-5 h-5" />;
      case 'presence': return <Users className="w-5 h-5" />;
      case 'caregiver': return <Award className="w-5 h-5" />;
      case 'system': return <Database className="w-5 h-5" />;
      case 'compliance': return <Flag className="w-5 h-5" />;
      case 'incident': return <AlertTriangle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const handleGenerateReport = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      console.log('Generating report:', template.name);
      // In a real implementation, this would trigger report generation
    }
  };

  const handleDownloadReport = (report: Report) => {
    if (report.downloadUrl) {
      window.open(report.downloadUrl, '_blank');
    }
  };

  const handleShareReport = (report: Report) => {
    console.log('Sharing report:', report.name);
    // In a real implementation, this would open a share dialog
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Reports & Summaries</span>
              <Badge variant="secondary">{filteredReports.length} reports</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowGenerateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{filteredReports.length}</p>
              <p className="text-sm text-gray-600">Total Reports</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {filteredReports.filter(r => r.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {filteredReports.filter(r => r.status === 'generating').length}
              </p>
              <p className="text-sm text-gray-600">Generating</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">
                {filteredReports.filter(r => r.status === 'scheduled').length}
              </p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="vital_signs">Vital Signs</SelectItem>
                <SelectItem value="fall_detection">Fall Detection</SelectItem>
                <SelectItem value="presence">Presence</SelectItem>
                <SelectItem value="caregiver">Caregiver</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="generating">Generating</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{report.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {report.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {report.category.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(report.status)} className="text-xs">
                            {report.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{report.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{report.generatedAt.toLocaleString()}</span>
                            </div>
                            {report.scheduledFor && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>Scheduled: {report.scheduledFor.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              {getFormatIcon(report.format)}
                              <span>{report.format.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Database className="w-4 h-4 text-gray-400" />
                              <span>{report.fileSize} MB</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {report.metrics.totalRecords > 0 && (
                              <div className="flex items-center space-x-2 text-sm">
                                <BarChart3 className="w-4 h-4 text-gray-400" />
                                <span>{report.metrics.totalRecords.toLocaleString()} records</span>
                              </div>
                            )}
                            {report.metrics.accuracy > 0 && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Target className="w-4 h-4 text-gray-400" />
                                <span>{report.metrics.accuracy}% accuracy</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress for generating reports */}
                        {report.status === 'generating' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Generating...</span>
                              <span className="text-sm text-gray-600">75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={report.status !== 'completed' || !report.downloadUrl}
                          onClick={() => handleDownloadReport(report)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={report.status !== 'completed'}
                          onClick={() => handleShareReport(report)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Report Templates</span>
            <Badge variant="secondary">{reportTemplates.length} templates</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-blue-100">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.type}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{template.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Category:</span>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Schedule:</span>
                        <Badge variant={template.schedule.enabled ? 'default' : 'secondary'} className="text-xs">
                          {template.schedule.enabled ? `${template.schedule.frequency}` : 'Disabled'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Formats:</span>
                        <div className="flex space-x-1">
                          {template.formats.map((format, index) => (
                            <div key={index} className="text-xs">
                              {getFormatIcon(format)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          handleGenerateReport(template.id);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsInterface;