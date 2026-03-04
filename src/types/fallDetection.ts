export interface FallEvent {
  id: string;
  residentId: string;
  residentName: string;
  roomId: string;
  roomName: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  detectedBy: 'wifi_motion' | 'acceleration_pattern' | 'position_change' | 'multi_sensor';
  
  // Fall characteristics
  fallType: 'forward' | 'backward' | 'lateral' | 'vertical' | 'unknown';
  impactForce: 'low' | 'medium' | 'high'; // Estimated impact severity
  fallHeight: number; // Estimated fall height in cm
  preFallActivity: string; // Activity before fall (walking, standing, sitting, etc.)
  
  // Post-fall status
  postFallImmobility: {
    detected: boolean;
    duration: number; // seconds of no movement after fall
    stillImmobile: boolean;
  };
  
  // Detection details
  sensorData: {
    wifiSignalChange: number; // dB change
    motionLevel: number; // 0-100
    accelerationPeak: number; // m/s²
    duration: number; // milliseconds of fall event
    patternMatch: number; // 0-1 confidence in fall pattern
  };
  
  // Location data
  location: {
    x: number;
    y: number;
    accuracy: number; // meters
  };
  
  // Response status
  responseStatus: 'pending' | 'acknowledged' | 'responding' | 'resolved' | 'false_alarm';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  responseTime?: number; // seconds to first response
  resolvedAt?: Date;
  notes?: string;
}

export interface FallRiskAssessment {
  id: string;
  residentId: string;
  residentName: string;
  timestamp: Date;
  overallRiskScore: number; // 0-100
  
  // Risk factors
  riskFactors: {
    age: number;
    previousFalls: number;
    medications: number; // Number of high-risk medications
    mobilityIssues: number; // 0-10 severity
    visionProblems: number; // 0-10 severity
    cognitiveImpairment: number; // 0-10 severity
    environmentalHazards: number; // 0-10 severity
  };
  
  // Predictive factors
  movementPatterns: {
    averageSpeed: number; // m/s
    variability: number; // movement pattern consistency
    nightActivity: number; // activity level during night hours
    bathroomFrequency: number; // nightly bathroom trips
    balanceIssues: number; // detected balance problems
  };
  
  // Recommendations
  recommendations: string[];
  preventiveMeasures: string[];
  reviewDate: Date;
}

export interface FallPattern {
  id: string;
  residentId: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  
  // Pattern analysis
  totalFalls: number;
  fallFrequency: number; // falls per month
  averageTimeBetweenFalls: number; // days
  mostCommonTime: string; // time of day
  mostCommonLocation: string;
  severityDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  
  // Temporal patterns
  hourlyDistribution: number[]; // 24 hours
  weeklyDistribution: number[]; // 7 days
  seasonalTrend: 'increasing' | 'decreasing' | 'stable';
  
  // Contributing factors
  commonPreFallActivities: string[];
  environmentalFactors: string[];
  medicationCorrelation: number; // 0-1 correlation with medication changes
  
  // Predictions
  nextFallProbability: number; // 0-1 probability in next 30 days
  riskTrend: 'improving' | 'worsening' | 'stable';
}

export interface ImmobilityAlert {
  id: string;
  residentId: string;
  residentName: string;
  roomId: string;
  roomName: string;
  startTime: Date;
  duration: number; // seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Context
  lastKnownPosition: {
    x: number;
    y: number;
    timestamp: Date;
  };
  lastMovement: Date;
  expectedActivity: string; // what resident should be doing
  
  // Detection data
  immobilityLevel: number; // 0-1 confidence of immobility
  breathingDetected: boolean; // subtle movement detection
  vitalSigns?: {
    heartRate?: number;
    respiration?: number;
    movement?: number;
  };
  
  // Response
  responseRequired: boolean;
  responseTime?: number;
  resolved: boolean;
  resolvedAt?: Date;
  resolution: 'resident_moved' | 'false_alarm' | 'assistance_required' | 'emergency';
}

export interface EmergencyResponse {
  id: string;
  fallEventId: string;
  triggeredAt: Date;
  
  // Response timeline
  detectionTime: Date;
  notificationTime: Date;
  firstResponseTime?: Date;
  arrivalTime?: Date;
  resolvedTime?: Date;
  
  // Response team
  primaryResponder: string;
  backupResponders: string[];
  emergencyServices: {
    contacted: boolean;
    contactTime?: Date;
    arrivalTime?: Date;
    serviceType: 'ambulance' | 'fire' | 'police' | 'medical_team';
  };
  
  // Actions taken
  immediateActions: string[];
  medicalAssessment: {
    consciousness: 'alert' | 'drowsy' | 'unconscious';
    breathing: 'normal' | 'labored' | 'absent';
    injuries: string[];
    painLevel: number; // 0-10
    vitalsStable: boolean;
  };
  
  // Outcome
  outcome: 'no_injury' | 'minor_injury' | 'major_injury' | 'hospitalization' | 'fatal';
  followUpRequired: boolean;
  followUpActions: string[];
  
  // Documentation
  notes: string;
  reportedBy: string;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface FallPreventionInsight {
  id: string;
  residentId: string;
  timestamp: Date;
  
  // Insight type
  insightType: 'risk_factor' | 'pattern' | 'environmental' | 'medication' | 'behavioral';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Content
  title: string;
  description: string;
  evidence: string[]; // Supporting data points
  confidence: number; // 0-1
  
  // Recommendations
  immediateActions: string[];
  longTermActions: string[];
  resources: string[]; // Links to resources, contact info, etc.
  
  // Implementation
  implementationStatus: 'not_started' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  
  // Effectiveness
  expectedImpact: 'low' | 'medium' | 'high';
  measuredImpact?: number; // Actual reduction in falls
  reviewDate: Date;
}

export interface FallDetectionConfig {
  // Sensitivity settings
  sensitivity: 'low' | 'medium' | 'high' | 'maximum';
  falseAlarmReduction: number; // 0-1 threshold for confirming falls
  
  // Detection parameters
  minimumImpactForce: number; // m/s²
  minimumAccelerationChange: number; // m/s²
  minimumPositionChange: number; // meters
  maximumFallDuration: number; // milliseconds
  
  // Post-fall monitoring
  immobilityThreshold: number; // seconds before alert
  vitalSignMonitoring: boolean;
  automaticEmergencyContact: boolean;
  
  // Notification settings
  notifyCaregivers: boolean;
  notifyEmergencyServices: boolean;
  notificationDelay: number; // seconds before notification
  escalationRules: {
    mediumSeverityDelay: number; // seconds
    highSeverityDelay: number; // seconds
    criticalSeverityDelay: number; // seconds
  };
  
  // Reporting
  generateReports: boolean;
  reportFrequency: 'daily' | 'weekly' | 'monthly';
  reportRecipients: string[];
}

export interface FallDetectionStats {
  // Current status
  activeAlerts: number;
  residentsMonitored: number;
  systemStatus: 'active' | 'maintenance' | 'error';
  
  // Performance metrics
  detectionAccuracy: number; // 0-1
  falseAlarmRate: number; // 0-1
  averageResponseTime: number; // seconds
  systemUptime: number; // percentage
  
  // Recent activity (last 24 hours)
  fallsDetected: number;
  falseAlarms: number;
  successfulInterventions: number;
  averageDetectionTime: number; // milliseconds
  
  // Trends
  weeklyTrend: 'increasing' | 'decreasing' | 'stable';
  monthlyTrend: 'increasing' | 'decreasing' | 'stable';
  riskLevelDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface WebSocketFallMessage {
  type: 'fall_detected' | 'immobility_alert' | 'risk_assessment_update' | 'emergency_response' | 'system_status';
  timestamp: Date;
  data: {
    fallEvent?: FallEvent;
    immobilityAlert?: ImmobilityAlert;
    riskAssessment?: FallRiskAssessment;
    emergencyResponse?: EmergencyResponse;
    stats?: FallDetectionStats;
  };
}