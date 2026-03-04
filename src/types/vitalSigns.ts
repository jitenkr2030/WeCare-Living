export interface VitalSignsReading {
  id: string;
  residentId: string;
  timestamp: Date;
  breathingRate: number; // BPM (breaths per minute)
  heartRate: number; // BPM (beats per minute)
  oxygenSaturation?: number; // SpO2 percentage
  bodyTemperature?: number; // Celsius
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  sleepStage?: 'awake' | 'light_sleep' | 'deep_sleep' | 'rem_sleep';
  activityLevel: 'resting' | 'light' | 'moderate' | 'vigorous';
  signalQuality: 'excellent' | 'good' | 'fair' | 'poor';
  deviceId: string;
  location: string;
}

export interface BreathingPattern {
  id: string;
  residentId: string;
  timestamp: Date;
  pattern: 'normal' | 'irregular' | 'shallow' | 'deep' | 'rapid' | 'slow' | 'apnea';
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  duration: number; // seconds
  confidence: number; // 0-1
  description: string;
}

export interface SleepSession {
  id: string;
  residentId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  sleepEfficiency: number; // percentage
  stages: {
    awake: number; // minutes
    light_sleep: number; // minutes
    deep_sleep: number; // minutes
    rem_sleep: number; // minutes
  };
  breathingDisturbances: number;
  averageBreathingRate: number;
  averageHeartRate: number;
  events: SleepEvent[];
}

export interface SleepEvent {
  id: string;
  timestamp: Date;
  type: 'apnea' | 'hypopnea' | 'breathing_change' | 'movement' | 'awakening';
  severity: 'mild' | 'moderate' | 'severe';
  duration: number; // seconds
  description: string;
}

export interface VitalSignsAlert {
  id: string;
  residentId: string;
  type: 'breathing_rate' | 'heart_rate' | 'oxygen_saturation' | 'irregular_breathing' | 'sleep_apnea' | 'no_signal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  vitals: VitalSignsReading;
  threshold?: {
    min?: number;
    max?: number;
    value: number;
  };
}

export interface VitalSignsTrend {
  residentId: string;
  metric: 'breathing_rate' | 'heart_rate' | 'oxygen_saturation' | 'sleep_quality';
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  data: {
    timestamp: Date;
    value: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
  }[];
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  average: number;
  min: number;
  max: number;
}

export interface WellnessIndicator {
  id: string;
  residentId: string;
  timestamp: Date;
  overall: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  breathing: 'normal' | 'irregular' | 'concerning';
  heart: 'normal' | 'irregular' | 'concerning';
  sleep: 'excellent' | 'good' | 'fair' | 'poor';
  activity: 'active' | 'normal' | 'sedentary' | 'immobile';
  hydration?: 'excellent' | 'good' | 'fair' | 'poor';
  nutrition?: 'excellent' | 'good' | 'fair' | 'poor';
  medication?: 'on_track' | 'missed' | 'late';
  social?: 'engaged' | 'normal' | 'isolated';
  score: number; // 0-100
  factors: {
    breathing: number; // 0-100
    heart: number; // 0-100
    sleep: number; // 0-100
    activity: number; // 0-100
    overall: number; // 0-100
  };
}

export interface VitalSignsStats {
  totalReadings: number;
  residentsMonitored: number;
  activeAlerts: number;
  criticalAlerts: number;
  systemStatus: 'active' | 'warning' | 'critical' | 'offline';
  averageBreathingRate: number;
  averageHeartRate: number;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  uptime: number; // percentage
  lastUpdate: Date;
  trends: {
    breathing: 'stable' | 'increasing' | 'decreasing';
    heart: 'stable' | 'increasing' | 'decreasing';
    sleep: 'improving' | 'stable' | 'declining';
  };
  alertDistribution: {
    breathing_rate: number;
    heart_rate: number;
    oxygen_saturation: number;
    irregular_breathing: number;
    sleep_apnea: number;
    no_signal: number;
  };
}

export interface ResidentVitalProfile {
  residentId: string;
  baseline: {
    breathingRate: {
      min: number;
      max: number;
      average: number;
    };
    heartRate: {
      min: number;
      max: number;
      average: number;
    };
    sleepDuration: {
      min: number; // hours
      max: number; // hours
      average: number; // hours
    };
  };
  conditions: string[];
  medications: string[];
  restrictions: {
    breathingRate?: {
      min?: number;
      max?: number;
    };
    heartRate?: {
      min?: number;
      max?: number;
    };
    oxygenSaturation?: {
      min?: number;
    };
    activity?: {
      maxLevel?: 'light' | 'moderate' | 'vigorous';
    };
  };
  preferences: {
    alertSensitivity: 'low' | 'medium' | 'high';
    notificationMethods: string[];
    quietHours?: {
      start: string; // HH:MM
      end: string; // HH:MM
    };
  };
}

export interface VitalSignsDevice {
  id: string;
  deviceId: string;
  type: 'wearable' | 'bed_sensor' | 'room_sensor' | 'chair_sensor';
  location: string;
  residentId?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  batteryLevel?: number;
  signalStrength: number;
  lastSeen: Date;
  capabilities: string[];
  firmware: string;
  model: string;
  manufacturer: string;
}