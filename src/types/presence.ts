export interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'living_room' | 'kitchen' | 'hallway';
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  currentOccupancy: number;
  maxOccupancy: number;
  lastOccupied?: Date;
  sensors: string[];
}

export interface PresenceEvent {
  id: string;
  residentId: string;
  roomId: string;
  roomName: string;
  eventType: 'enter' | 'exit' | 'movement_detected' | 'no_movement' | 'fall_detected' | 'immobility_alert';
  timestamp: Date;
  confidence: number;
  sensorData?: {
    signalStrength: number;
    motionLevel: number;
    deviceCount: number;
    accelerationPeak?: number;
    impactForce?: number;
    fallType?: string;
  };
}

export interface MovementPath {
  id: string;
  residentId: string;
  path: Array<{
    roomId: string;
    roomName: string;
    timestamp: Date;
    duration?: number; // time spent in room in seconds
  }>;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
}

export interface Resident {
  id: string;
  name: string;
  roomId?: string;
  roomName?: string;
  lastSeen: Date;
  status: 'active' | 'resting' | 'sleeping' | 'inactive' | 'alert';
  movementLevel: 'high' | 'medium' | 'low' | 'none';
  riskLevel: 'normal' | 'caution' | 'warning' | 'critical';
  fallRiskScore?: number; // 0-100
  lastFall?: Date;
  fallCount?: number; // Total falls in last 30 days
  immobilityAlert?: boolean;
}

export interface OccupancyData {
  roomId: string;
  roomName: string;
  timestamp: Date;
  occupancy: number;
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
  noiseLevel?: number;
}

export interface PresenceNotification {
  id: string;
  type: 'room_entry' | 'room_exit' | 'no_movement' | 'unusual_activity' | 'fall_detected' | 'system_alert';
  title: string;
  message: string;
  residentId?: string;
  roomId?: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface PresenceStats {
  totalMovements: number;
  averageRoomTime: number;
  mostVisitedRoom: string;
  leastVisitedRoom: string;
  activeTime: number; // minutes
  restTime: number; // minutes
  nightMovements: number;
  unusualPatterns: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  rooms: Room[];
  dimensions: {
    width: number;
    height: number;
  };
  scale: number; // pixels per meter
}

export interface WebSocketPresenceMessage {
  type: 'presence_update' | 'movement_detected' | 'room_status_change' | 'notification' | 'stats_update' | 'fall_detected' | 'immobility_alert' | 'emergency_response';
  timestamp: Date;
  data: {
    event?: PresenceEvent;
    resident?: Resident;
    room?: Room;
    notification?: PresenceNotification;
    stats?: PresenceStats;
    path?: MovementPath;
    fallEvent?: any; // Will be typed as FallEvent when imported
    immobilityAlert?: any; // Will be typed as ImmobilityAlert when imported
    emergencyResponse?: any; // Will be typed as EmergencyResponse when imported
  };
}