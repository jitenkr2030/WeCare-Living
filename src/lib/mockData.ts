import { 
  Room, 
  Resident, 
  PresenceEvent, 
  MovementPath, 
  PresenceNotification,
  OccupancyData,
  PresenceStats 
} from '@/types/presence';

// Import fall detection types
import type { 
  FallEvent, 
  FallRiskAssessment, 
  FallPattern, 
  ImmobilityAlert,
  EmergencyResponse,
  FallPreventionInsight,
  FallDetectionStats
} from '@/types/fallDetection';

// Import vital signs types
import type {
  VitalSignsReading,
  BreathingPattern,
  SleepSession,
  SleepEvent,
  VitalSignsAlert,
  VitalSignsTrend,
  WellnessIndicator,
  VitalSignsStats,
  ResidentVitalProfile,
  VitalSignsDevice
} from '@/types/vitalSigns';

export class MockDataGenerator {
  private static readonly ROOM_TYPES = ['bedroom', 'bathroom', 'living_room', 'kitchen', 'hallway'] as const;
  private static readonly RESIDENT_NAMES = [
    'John Smith', 'Mary Johnson', 'Robert Williams', 'Patricia Brown',
    'Michael Davis', 'Jennifer Miller', 'William Wilson', 'Linda Moore'
  ];
  
  private static readonly EVENT_TYPES = ['enter', 'exit', 'movement_detected', 'no_movement', 'fall_detected', 'immobility_alert'] as const;
  private static readonly NOTIFICATION_TYPES = [
    'room_entry', 'room_exit', 'no_movement', 'unusual_activity', 
    'fall_detected', 'system_alert'
  ] as const;

  static generateRooms(count: number = 5): Room[] {
    const rooms: Room[] = [];
    const roomNames = [
      'Master Bedroom', 'Guest Bedroom', 'Main Bathroom', 'Kitchen', 
      'Living Room', 'Dining Room', 'Hallway', 'Study', 'Laundry Room'
    ];

    for (let i = 0; i < Math.min(count, roomNames.length); i++) {
      const roomType = this.ROOM_TYPES[i % this.ROOM_TYPES.length];
      
      rooms.push({
        id: `room-${i + 1}`,
        name: roomNames[i],
        type: roomType,
        coordinates: {
          x: (i % 3) * 150,
          y: Math.floor(i / 3) * 120,
          width: 100 + Math.random() * 50,
          height: 80 + Math.random() * 40
        },
        currentOccupancy: Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0,
        maxOccupancy: roomType === 'bedroom' ? 2 : roomType === 'bathroom' ? 1 : 4,
        lastOccupied: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 60 * 60 * 1000) : undefined,
        sensors: [`wifi-${i + 1}`, `motion-${i + 1}`, `temp-${i + 1}`]
      });
    }

    return rooms;
  }

  static generateResidents(count: number = 4): Resident[] {
    const residents: Resident[] = [];
    const statuses = ['active', 'resting', 'sleeping', 'inactive', 'alert'] as const;
    const movementLevels = ['high', 'medium', 'low', 'none'] as const;
    const riskLevels = ['normal', 'caution', 'warning', 'critical'] as const;

    for (let i = 0; i < Math.min(count, this.RESIDENT_NAMES.length); i++) {
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      const status = riskLevel === 'critical' ? 'alert' : 
                    riskLevel === 'warning' ? 'active' :
                    statuses[Math.floor(Math.random() * statuses.length)];

      residents.push({
        id: `resident-${i + 1}`,
        name: this.RESIDENT_NAMES[i],
        roomId: Math.random() > 0.3 ? `room-${Math.floor(Math.random() * 5) + 1}` : undefined,
        roomName: Math.random() > 0.3 ? `Room ${Math.floor(Math.random() * 5) + 1}` : undefined,
        lastSeen: new Date(Date.now() - Math.random() * 30 * 60 * 1000),
        status,
        movementLevel: movementLevels[Math.floor(Math.random() * movementLevels.length)],
        riskLevel,
        fallRiskScore: Math.round(Math.random() * 100),
        lastFall: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        fallCount: Math.floor(Math.random() * 5),
        immobilityAlert: Math.random() > 0.8
      });
    }

    return residents;
  }

  static generatePresenceEvents(count: number = 50, residents: Resident[], rooms: Room[]): PresenceEvent[] {
    const events: PresenceEvent[] = [];
    
    for (let i = 0; i < count; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      const eventType = this.EVENT_TYPES[Math.floor(Math.random() * this.EVENT_TYPES.length)];
      
      events.push({
        id: `event-${i + 1}`,
        residentId: resident.id,
        roomId: room.id,
        roomName: room.name,
        eventType,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        confidence: 0.5 + Math.random() * 0.5,
        sensorData: {
          signalStrength: Math.round(20 + Math.random() * 80),
          motionLevel: Math.round(Math.random() * 100),
          deviceCount: Math.floor(Math.random() * 5),
          ...(eventType === 'fall_detected' && {
            accelerationPeak: Math.round(10 + Math.random() * 40),
            impactForce: Math.round(5 + Math.random() * 20),
            fallType: ['forward', 'backward', 'lateral', 'vertical'][Math.floor(Math.random() * 4)]
          })
        }
      });
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static generateMovementPaths(count: number = 10, residents: Resident[], rooms: Room[]): MovementPath[] {
    const paths: MovementPath[] = [];
    
    for (let i = 0; i < count; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const pathLength = 2 + Math.floor(Math.random() * 6);
      const isActive = Math.random() > 0.7;
      const startTime = new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000);
      
      const path = [];
      let currentTime = new Date(startTime);
      
      for (let j = 0; j < pathLength; j++) {
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const duration = Math.random() * 30 * 60; // 0-30 minutes
        
        path.push({
          roomId: room.id,
          roomName: room.name,
          timestamp: new Date(currentTime),
          duration: j < pathLength - 1 ? duration : undefined
        });
        
        currentTime = new Date(currentTime.getTime() + duration * 1000);
      }
      
      paths.push({
        id: `path-${i + 1}`,
        residentId: resident.id,
        path,
        startTime,
        endTime: isActive ? undefined : new Date(currentTime),
        isActive
      });
    }

    return paths;
  }

  static generateNotifications(count: number = 20, residents: Resident[], rooms: Room[]): PresenceNotification[] {
    const notifications: PresenceNotification[] = [];
    const priorities = ['low', 'medium', 'high', 'critical'] as const;
    
    for (let i = 0; i < count; i++) {
      const type = this.NOTIFICATION_TYPES[Math.floor(Math.random() * this.NOTIFICATION_TYPES.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const resident = Math.random() > 0.3 ? residents[Math.floor(Math.random() * residents.length)] : undefined;
      const room = Math.random() > 0.3 ? rooms[Math.floor(Math.random() * rooms.length)] : undefined;
      const acknowledged = Math.random() > 0.6;
      
      let title = '';
      let message = '';
      
      switch (type) {
        case 'room_entry':
          title = 'Room Entry Detected';
          message = `${resident?.name || 'Someone'} entered ${room?.name || 'a room'}`;
          break;
        case 'room_exit':
          title = 'Room Exit Detected';
          message = `${resident?.name || 'Someone'} left ${room?.name || 'a room'}`;
          break;
        case 'no_movement':
          title = 'No Movement Detected';
          message = `No movement detected for ${resident?.name || 'resident'} in ${room?.name || 'area'}`;
          break;
        case 'unusual_activity':
          title = 'Unusual Activity';
          message = `Unusual activity pattern detected for ${resident?.name || 'resident'}`;
          break;
        case 'fall_detected':
          title = 'Fall Detected';
          message = `Fall detected for ${resident?.name || 'resident'} in ${room?.name || 'area'}`;
          break;
        case 'system_alert':
          title = 'System Alert';
          message = 'System maintenance required';
          break;
      }
      
      notifications.push({
        id: `notification-${i + 1}`,
        type,
        title,
        message,
        residentId: resident?.id,
        roomId: room?.id,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        priority,
        acknowledged,
        acknowledgedBy: acknowledged ? 'Caregiver' : undefined,
        acknowledgedAt: acknowledged ? new Date(Date.now() - Math.random() * 60 * 60 * 1000) : undefined
      });
    }

    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static generateOccupancyData(rooms: Room[], hours: number = 24): OccupancyData[] {
    const data: OccupancyData[] = [];
    const now = new Date();
    
    for (let hour = 0; hour < hours; hour++) {
      const timestamp = new Date(now.getTime() - (hour * 60 * 60 * 1000));
      
      rooms.forEach(room => {
        // Simulate realistic occupancy patterns
        let occupancy = 0;
        const hourOfDay = timestamp.getHours();
        
        if (room.type === 'bedroom') {
          occupancy = hourOfDay >= 22 || hourOfDay <= 6 ? 
            Math.random() * 0.8 + 0.2 : Math.random() * 0.3;
        } else if (room.type === 'kitchen') {
          occupancy = (hourOfDay >= 7 && hourOfDay <= 9) || (hourOfDay >= 18 && hourOfDay <= 20) ? 
            Math.random() * 0.6 + 0.4 : Math.random() * 0.2;
        } else if (room.type === 'living_room') {
          occupancy = hourOfDay >= 16 && hourOfDay <= 22 ? 
            Math.random() * 0.7 + 0.3 : Math.random() * 0.4;
        } else if (room.type === 'bathroom') {
          occupancy = Math.random() * 0.3;
        } else {
          occupancy = Math.random() * 0.5;
        }
        
        data.push({
          roomId: room.id,
          roomName: room.name,
          timestamp,
          occupancy: Math.round(occupancy * room.maxOccupancy),
          temperature: 20 + Math.random() * 8,
          humidity: 40 + Math.random() * 30,
          lightLevel: Math.random() * 100,
          noiseLevel: Math.random() * 80
        });
      });
    }
    
    return data;
  }

  static generatePresenceStats(): PresenceStats {
    return {
      totalMovements: Math.floor(Math.random() * 100) + 50,
      averageRoomTime: Math.random() * 20 + 5, // minutes
      mostVisitedRoom: `Room ${Math.floor(Math.random() * 5) + 1}`,
      leastVisitedRoom: `Room ${Math.floor(Math.random() * 5) + 1}`,
      activeTime: Math.floor(Math.random() * 300) + 60, // minutes
      restTime: Math.floor(Math.random() * 200) + 40, // minutes
      nightMovements: Math.floor(Math.random() * 10),
      unusualPatterns: Math.floor(Math.random() * 5)
    };
  }

  static generateCompleteMockData() {
    const rooms = this.generateRooms();
    const residents = this.generateResidents();
    const events = this.generatePresenceEvents(50, residents, rooms);
    const paths = this.generateMovementPaths(10, residents, rooms);
    const notifications = this.generateNotifications(20, residents, rooms);
    const occupancyData = this.generateOccupancyData(rooms);
    const stats = this.generatePresenceStats();

    return {
      rooms,
      residents,
      events,
      paths,
      notifications,
      occupancyData,
      stats
    };
  }

  static simulateRealtimeUpdate(
    rooms: Room[], 
    residents: Resident[], 
    currentEvents: PresenceEvent[]
  ): {
    updatedRooms: Room[];
    updatedResidents: Resident[];
    newEvent: PresenceEvent;
  } {
    // Simulate a room status change
    const updatedRooms = rooms.map(room => {
      if (Math.random() > 0.8) {
        const newOccupancy = Math.random() > 0.5 ? 
          Math.min(room.currentOccupancy + 1, room.maxOccupancy) :
          Math.max(room.currentOccupancy - 1, 0);
        
        return {
          ...room,
          currentOccupancy: newOccupancy,
          lastOccupied: newOccupancy > 0 ? new Date() : room.lastOccupied
        };
      }
      return room;
    });

    // Simulate a resident status change
    const updatedResidents = residents.map(resident => {
      if (Math.random() > 0.9) {
        const statuses = ['active', 'resting', 'sleeping', 'inactive', 'alert'] as const;
        const movementLevels = ['high', 'medium', 'low', 'none'] as const;
        
        return {
          ...resident,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          movementLevel: movementLevels[Math.floor(Math.random() * movementLevels.length)],
          lastSeen: new Date()
        };
      }
      return resident;
    });

    // Generate a new event
    const resident = residents[Math.floor(Math.random() * residents.length)];
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const eventTypes = ['enter', 'exit', 'movement_detected', 'no_movement'] as const;
    
    const newEvent: PresenceEvent = {
      id: `event-${Date.now()}`,
      residentId: resident.id,
      roomId: room.id,
      roomName: room.name,
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      timestamp: new Date(),
      confidence: 0.5 + Math.random() * 0.5,
      sensorData: {
        signalStrength: Math.round(20 + Math.random() * 80),
        motionLevel: Math.round(Math.random() * 100),
        deviceCount: Math.floor(Math.random() * 5)
      }
    };

    return {
      updatedRooms,
      updatedResidents,
      newEvent
    };
  }

  // Fall Detection Mock Data Generation Methods
  
  static generateFallEvents(count: number = 15, residents: Resident[], rooms: Room[]): FallEvent[] {
    const fallEvents: FallEvent[] = [];
    const severities = ['low', 'medium', 'high', 'critical'] as const;
    const fallTypes = ['forward', 'backward', 'lateral', 'vertical', 'unknown'] as const;
    const detectedBy = ['wifi_motion', 'acceleration_pattern', 'position_change', 'multi_sensor'] as const;
    const responseStatuses = ['pending', 'acknowledged', 'responding', 'resolved', 'false_alarm'] as const;
    
    for (let i = 0; i < count; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const responseStatus = responseStatuses[Math.floor(Math.random() * responseStatuses.length)];
      const acknowledged = responseStatus !== 'pending';
      
      const fallEvent: FallEvent = {
        id: `fall-${i + 1}`,
        residentId: resident.id,
        residentName: resident.name,
        roomId: room.id,
        roomName: room.name,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
        severity,
        confidence: 0.6 + Math.random() * 0.4,
        detectedBy: detectedBy[Math.floor(Math.random() * detectedBy.length)],
        fallType: fallTypes[Math.floor(Math.random() * fallTypes.length)],
        impactForce: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        fallHeight: Math.round(Math.random() * 150), // 0-150 cm
        preFallActivity: ['walking', 'standing', 'sitting', 'bathing', 'dressing'][Math.floor(Math.random() * 5)],
        postFallImmobility: {
          detected: Math.random() > 0.4,
          duration: Math.round(Math.random() * 300), // 0-300 seconds
          stillImmobile: Math.random() > 0.7
        },
        sensorData: {
          wifiSignalChange: Math.round(-30 - Math.random() * 20), // -30 to -50 dB
          motionLevel: Math.round(80 + Math.random() * 20), // 80-100
          accelerationPeak: Math.round(15 + Math.random() * 35), // 15-50 m/s²
          duration: Math.round(200 + Math.random() * 800), // 200-1000 ms
          patternMatch: 0.7 + Math.random() * 0.3
        },
        location: {
          x: Math.random() * room.coordinates.width,
          y: Math.random() * room.coordinates.height,
          accuracy: 0.5 + Math.random() * 1.5 // 0.5-2 meters
        },
        responseStatus,
        acknowledgedBy: acknowledged ? ['Caregiver A', 'Caregiver B', 'Nurse'][Math.floor(Math.random() * 3)] : undefined,
        acknowledgedAt: acknowledged ? new Date(Date.now() - Math.random() * 60 * 60 * 1000) : undefined,
        responseTime: acknowledged ? Math.round(30 + Math.random() * 300) : undefined, // 30-330 seconds
        resolvedAt: responseStatus === 'resolved' ? new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000) : undefined,
        notes: responseStatus === 'resolved' ? 'Resident assisted and checked for injuries' : undefined
      };
      
      fallEvents.push(fallEvent);
    }
    
    return fallEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static generateFallRiskAssessments(residents: Resident[]): FallRiskAssessment[] {
    const assessments: FallRiskAssessment[] = [];
    
    residents.forEach(resident => {
      const age = 65 + Math.floor(Math.random() * 25); // 65-90 years
      const previousFalls = Math.floor(Math.random() * 10);
      const medications = Math.floor(Math.random() * 8);
      
      const assessment: FallRiskAssessment = {
        id: `risk-assessment-${resident.id}`,
        residentId: resident.id,
        residentName: resident.name,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        overallRiskScore: Math.round(20 + Math.random() * 80), // 20-100
        riskFactors: {
          age,
          previousFalls,
          medications,
          mobilityIssues: Math.round(Math.random() * 10),
          visionProblems: Math.round(Math.random() * 10),
          cognitiveImpairment: Math.round(Math.random() * 10),
          environmentalHazards: Math.round(Math.random() * 10)
        },
        movementPatterns: {
          averageSpeed: 0.3 + Math.random() * 0.7, // 0.3-1.0 m/s
          variability: Math.random(),
          nightActivity: Math.round(Math.random() * 100),
          bathroomFrequency: Math.round(1 + Math.random() * 4), // 1-5 times
          balanceIssues: Math.round(Math.random() * 10)
        },
        recommendations: [
          'Install grab bars in bathroom',
          'Improve lighting in hallway',
          'Remove loose rugs',
          'Review medication side effects'
        ].slice(0, 2 + Math.floor(Math.random() * 2)),
        preventiveMeasures: [
          'Physical therapy exercises',
          'Regular vision checks',
          'Medication review',
          'Home safety assessment'
        ].slice(0, 1 + Math.floor(Math.random() * 2)),
        reviewDate: new Date(Date.now() + (7 + Math.floor(Math.random() * 21)) * 24 * 60 * 60 * 1000) // 1-4 weeks from now
      };
      
      assessments.push(assessment);
    });
    
    return assessments;
  }

  static generateImmobilityAlerts(count: number = 8, residents: Resident[], rooms: Room[]): ImmobilityAlert[] {
    const alerts: ImmobilityAlert[] = [];
    const severities = ['low', 'medium', 'high', 'critical'] as const;
    const resolutions = ['resident_moved', 'false_alarm', 'assistance_required', 'emergency'] as const;
    
    for (let i = 0; i < count; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const resolved = Math.random() > 0.3;
      
      const alert: ImmobilityAlert = {
        id: `immobility-${i + 1}`,
        residentId: resident.id,
        residentName: resident.name,
        roomId: room.id,
        roomName: room.name,
        startTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        duration: Math.round(60 + Math.random() * 600), // 1-11 minutes
        severity,
        lastKnownPosition: {
          x: Math.random() * room.coordinates.width,
          y: Math.random() * room.coordinates.height,
          timestamp: new Date(Date.now() - Math.random() * 30 * 60 * 1000)
        },
        lastMovement: new Date(Date.now() - Math.random() * 30 * 60 * 1000),
        expectedActivity: ['sleeping', 'resting', 'watching TV', 'reading'][Math.floor(Math.random() * 4)],
        immobilityLevel: 0.6 + Math.random() * 0.4,
        breathingDetected: Math.random() > 0.3,
        vitalSigns: Math.random() > 0.5 ? {
          heartRate: Math.round(60 + Math.random() * 40),
          respiration: Math.round(12 + Math.random() * 8),
          movement: Math.round(Math.random() * 20)
        } : undefined,
        responseRequired: severity !== 'low',
        responseTime: resolved ? Math.round(60 + Math.random() * 240) : undefined,
        resolved,
        resolvedAt: resolved ? new Date(Date.now() - Math.random() * 60 * 60 * 1000) : undefined,
        resolution: resolved ? resolutions[Math.floor(Math.random() * resolutions.length)] : undefined
      };
      
      alerts.push(alert);
    }
    
    return alerts.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  static generateEmergencyResponses(fallEvents: FallEvent[]): EmergencyResponse[] {
    const responses: EmergencyResponse[] = [];
    const outcomes = ['no_injury', 'minor_injury', 'major_injury', 'hospitalization', 'fatal'] as const;
    
    fallEvents.slice(0, 8).forEach((fallEvent, index) => {
      if (fallEvent.responseStatus === 'resolved' || fallEvent.responseStatus === 'responding') {
        const detectionTime = new Date(fallEvent.timestamp);
        const notificationTime = new Date(detectionTime.getTime() + 5000); // 5 seconds
        const firstResponseTime = fallEvent.acknowledgedAt ? 
          new Date(detectionTime.getTime() + (fallEvent.responseTime || 120) * 1000) : 
          undefined;
        const arrivalTime = firstResponseTime ? 
          new Date(firstResponseTime.getTime() + 180000) : undefined; // 3 minutes after response
        const resolvedTime = fallEvent.resolvedAt || new Date(arrivalTime?.getTime() + 600000 || detectionTime.getTime() + 900000);
        
        const response: EmergencyResponse = {
          id: `emergency-${index + 1}`,
          fallEventId: fallEvent.id,
          triggeredAt: detectionTime,
          detectionTime,
          notificationTime,
          firstResponseTime,
          arrivalTime,
          resolvedTime,
          primaryResponder: ['Dr. Smith', 'Nurse Johnson', 'Caregiver Brown', 'Paramedic Davis'][Math.floor(Math.random() * 4)],
          backupResponders: ['Nurse Wilson', 'Caregiver Miller'].slice(0, Math.floor(Math.random() * 2) + 1),
          emergencyServices: {
            contacted: fallEvent.severity === 'critical' || fallEvent.severity === 'high',
            contactTime: fallEvent.severity === 'critical' ? new Date(notificationTime.getTime() + 30000) : undefined,
            arrivalTime: fallEvent.severity === 'critical' && arrivalTime ? new Date(arrivalTime.getTime() + 300000) : undefined,
            serviceType: fallEvent.severity === 'critical' ? 'ambulance' : 'medical_team'
          },
          immediateActions: [
            'Checked consciousness',
            'Assessed breathing',
            'Checked for injuries',
            'Monitored vital signs',
            'Provided comfort'
          ].slice(0, 2 + Math.floor(Math.random() * 3)),
          medicalAssessment: {
            consciousness: ['alert', 'drowsy', 'unconscious'][Math.floor(Math.random() * 3)] as 'alert' | 'drowsy' | 'unconscious',
            breathing: ['normal', 'labored', 'absent'][Math.floor(Math.random() * 3)] as 'normal' | 'labored' | 'absent',
            injuries: fallEvent.severity === 'critical' ? 
              ['Head injury', 'Hip fracture', 'Broken wrist'] : 
              fallEvent.severity === 'high' ? 
              ['Bruises', 'Cuts'] : 
              [],
            painLevel: Math.round(Math.random() * 10),
            vitalsStable: Math.random() > 0.3
          },
          outcome: outcomes[Math.min(Math.floor(Math.random() * outcomes.length), 3)], // Avoid 'fatal' for demo
          followUpRequired: Math.random() > 0.4,
          followUpActions: [
            'Schedule follow-up appointment',
            'Physical therapy referral',
            'Medication review',
            'Home safety assessment'
          ].slice(0, Math.floor(Math.random() * 3) + 1),
          notes: 'Patient responded well to immediate care',
          reportedBy: 'System',
          reviewedBy: Math.random() > 0.5 ? 'Medical Director' : undefined,
          reviewDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
        };
        
        responses.push(response);
      }
    });
    
    return responses;
  }

  static generateFallDetectionStats(): FallDetectionStats {
    return {
      activeAlerts: Math.floor(Math.random() * 5),
      residentsMonitored: 8,
      systemStatus: 'active',
      detectionAccuracy: 0.85 + Math.random() * 0.14, // 85-99%
      falseAlarmRate: 0.02 + Math.random() * 0.08, // 2-10%
      averageResponseTime: Math.round(60 + Math.random() * 180), // 1-4 minutes
      systemUptime: 99.5 + Math.random() * 0.5, // 99.5-100%
      fallsDetected: Math.floor(Math.random() * 10),
      falseAlarms: Math.floor(Math.random() * 3),
      successfulInterventions: Math.floor(Math.random() * 8),
      averageDetectionTime: Math.round(200 + Math.random() * 300), // 200-500ms
      weeklyTrend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable',
      monthlyTrend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable',
      riskLevelDistribution: {
        low: Math.floor(Math.random() * 3),
        medium: Math.floor(Math.random() * 4) + 1,
        high: Math.floor(Math.random() * 3) + 1,
        critical: Math.floor(Math.random() * 2)
      }
    };
  }

  static generateCompleteFallDetectionData(residents: Resident[], rooms: Room[]) {
    const fallEvents = this.generateFallEvents(15, residents, rooms);
    const riskAssessments = this.generateFallRiskAssessments(residents);
    const immobilityAlerts = this.generateImmobilityAlerts(8, residents, rooms);
    const emergencyResponses = this.generateEmergencyResponses(fallEvents);
    const stats = this.generateFallDetectionStats();

    return {
      fallEvents,
      riskAssessments,
      immobilityAlerts,
      emergencyResponses,
      stats
    };
  }

  // Vital Signs Mock Data Generation Methods

  static generateVitalSignsReadings(count: number = 100, residents: Resident[]): VitalSignsReading[] {
    const readings: VitalSignsReading[] = [];
    
    for (let i = 0; i < count; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const isElderly = true; // All residents are elderly in this context
      
      // Elderly breathing rate: 6-30 BPM (normal range)
      const breathingRate = Math.round(6 + Math.random() * 24);
      
      // Normal heart rate: 60-100 BPM
      const heartRate = Math.round(60 + Math.random() * 40);
      
      // Randomly generate some abnormal readings for alerts
      const isAbnormal = Math.random() > 0.85;
      const finalBreathingRate = isAbnormal ? 
        (Math.random() > 0.5 ? Math.round(3 + Math.random() * 3) : Math.round(31 + Math.random() * 10)) : 
        breathingRate;
      const finalHeartRate = isAbnormal ? 
        (Math.random() > 0.5 ? Math.round(45 + Math.random() * 15) : Math.round(101 + Math.random() * 30)) : 
        heartRate;
      
      const reading: VitalSignsReading = {
        id: `vital-${i + 1}`,
        residentId: resident.id,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        breathingRate: finalBreathingRate,
        heartRate: finalHeartRate,
        oxygenSaturation: Math.round(85 + Math.random() * 15),
        bodyTemperature: 36 + Math.random() * 2,
        bloodPressure: {
          systolic: Math.round(100 + Math.random() * 60),
          diastolic: Math.round(60 + Math.random() * 30)
        },
        sleepStage: ['awake', 'light_sleep', 'deep_sleep', 'rem_sleep'][Math.floor(Math.random() * 4)] as any,
        activityLevel: ['resting', 'light', 'moderate', 'vigorous'][Math.floor(Math.random() * 4)] as any,
        signalQuality: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
        deviceId: `device-${Math.floor(Math.random() * 10) + 1}`,
        location: `Room ${Math.floor(Math.random() * 8) + 1}`
      };
      
      readings.push(reading);
    }
    
    return readings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static generateBreathingPatterns(count: number = 20, residents: Resident[]): BreathingPattern[] {
    const patterns: BreathingPattern[] = [];
    const patternTypes = ['normal', 'irregular', 'shallow', 'deep', 'rapid', 'slow', 'apnea'] as const;
    const severities = ['normal', 'mild', 'moderate', 'severe'] as const;
    
    for (let i = 0; i < count; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const pattern = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      const severity = pattern === 'normal' ? 'normal' : severities[Math.floor(Math.random() * severities.length)];
      
      const breathingPattern: BreathingPattern = {
        id: `pattern-${i + 1}`,
        residentId: resident.id,
        timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000),
        pattern,
        severity,
        duration: Math.round(5 + Math.random() * 300), // 5-305 seconds
        confidence: 0.6 + Math.random() * 0.4,
        description: this.getBreathingPatternDescription(pattern, severity)
      };
      
      patterns.push(breathingPattern);
    }
    
    return patterns.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private static getBreathingPatternDescription(pattern: string, severity: string): string {
    const descriptions: Record<string, Record<string, string>> = {
      normal: {
        normal: 'Normal breathing pattern detected',
        mild: 'Slightly elevated breathing rate',
        moderate: 'Increased breathing activity',
        severe: 'Significantly elevated breathing'
      },
      irregular: {
        mild: 'Occasional irregular breathing',
        moderate: 'Frequent irregular breathing patterns',
        severe: 'Severely irregular breathing requiring attention'
      },
      shallow: {
        mild: 'Slightly shallow breathing',
        moderate: 'Moderately shallow breathing',
        severe: 'Very shallow breathing - monitor closely'
      },
      deep: {
        mild: 'Slightly deeper than normal breathing',
        moderate: 'Deep breathing pattern',
        severe: 'Very deep breathing - may indicate distress'
      },
      rapid: {
        mild: 'Mildly rapid breathing (tachypnea)',
        moderate: 'Rapid breathing pattern',
        severe: 'Severely rapid breathing - immediate attention needed'
      },
      slow: {
        mild: 'Slightly slow breathing',
        moderate: 'Slow breathing pattern',
        severe: 'Very slow breathing - monitor closely'
      },
      apnea: {
        mild: 'Brief breathing pauses detected',
        moderate: 'Frequent breathing pauses',
        severe: 'Prolonged apnea episodes - urgent attention required'
      }
    };
    
    return descriptions[pattern]?.[severity] || 'Breathing pattern detected';
  }

  static generateSleepSessions(count: number = 15, residents: Resident[]): SleepSession[] {
    const sessions: SleepSession[] = [];
    const qualities = ['excellent', 'good', 'fair', 'poor'] as const;
    
    for (let i = 0; i < count; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const quality = qualities[Math.floor(Math.random() * qualities.length)];
      const startTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const duration = 240 + Math.random() * 480; // 4-12 hours
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      
      const totalSleep = duration * (0.7 + Math.random() * 0.25); // 70-95% sleep efficiency
      const awakeTime = duration - totalSleep;
      
      const session: SleepSession = {
        id: `sleep-${i + 1}`,
        residentId: resident.id,
        startTime,
        endTime,
        duration: Math.round(duration),
        quality,
        sleepEfficiency: Math.round((totalSleep / duration) * 100),
        stages: {
          awake: Math.round(awakeTime),
          light_sleep: Math.round(totalSleep * 0.5),
          deep_sleep: Math.round(totalSleep * 0.25),
          rem_sleep: Math.round(totalSleep * 0.25)
        },
        breathingDisturbances: Math.floor(Math.random() * 15),
        averageBreathingRate: Math.round(12 + Math.random() * 8),
        averageHeartRate: Math.round(55 + Math.random() * 25),
        events: this.generateSleepEvents(Math.floor(Math.random() * 8) + 1, startTime)
      };
      
      sessions.push(session);
    }
    
    return sessions.sort((a, b) => (b.startTime?.getTime() || 0) - (a.startTime?.getTime() || 0));
  }

  static generateSleepEvents(count: number, sessionStart: Date): SleepEvent[] {
    const events: SleepEvent[] = [];
    const eventTypes = ['apnea', 'hypopnea', 'breathing_change', 'movement', 'awakening'] as const;
    const severities = ['mild', 'moderate', 'severe'] as const;
    
    for (let i = 0; i < count; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      const event: SleepEvent = {
        id: `sleep-event-${i + 1}`,
        timestamp: new Date(sessionStart.getTime() + Math.random() * 8 * 60 * 60 * 1000),
        type: eventType,
        severity,
        duration: Math.round(5 + Math.random() * 60), // 5-65 seconds
        description: this.getSleepEventDescription(eventType, severity)
      };
      
      events.push(event);
    }
    
    return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private static getSleepEventDescription(type: string, severity: string): string {
    const descriptions: Record<string, Record<string, string>> = {
      apnea: {
        mild: 'Brief breathing pause detected',
        moderate: 'Breathing pause of moderate duration',
        severe: 'Prolonged breathing pause detected'
      },
      hypopnea: {
        mild: 'S shallow breathing episode',
        moderate: 'Moderate breathing reduction',
        severe: 'Severe breathing reduction'
      },
      breathing_change: {
        mild: 'Minor breathing pattern change',
        moderate: 'Significant breathing pattern change',
        severe: 'Major breathing disruption'
      },
      movement: {
        mild: 'Minor movement detected',
        moderate: 'Significant movement',
        severe: 'Excessive movement disrupting sleep'
      },
      awakening: {
        mild: 'Brief awakening',
        moderate: 'Extended awakening period',
        severe: 'Prolonged awakening'
      }
    };
    
    return descriptions[type]?.[severity] || 'Sleep event detected';
  }

  static generateVitalSignsAlerts(count: number = 12, residents: Resident[]): VitalSignsAlert[] {
    const alerts: VitalSignsAlert[] = [];
    const alertTypes = ['breathing_rate', 'heart_rate', 'oxygen_saturation', 'irregular_breathing', 'sleep_apnea', 'no_signal'] as const;
    const severities = ['low', 'medium', 'high', 'critical'] as const;
    
    for (let i = 0; i < count; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const acknowledged = Math.random() > 0.4;
      const resolved = Math.random() > 0.6;
      
      const vitalReading = this.generateVitalSignsReadings(1, residents)[0];
      
      const alert: VitalSignsAlert = {
        id: `alert-${i + 1}`,
        residentId: resident.id,
        type: alertType,
        severity,
        title: this.getAlertTitle(alertType, severity),
        message: this.getAlertMessage(alertType, severity, resident.name),
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        acknowledged,
        acknowledgedBy: acknowledged ? ['Caregiver A', 'Nurse B', 'Staff C'][Math.floor(Math.random() * 3)] : undefined,
        acknowledgedAt: acknowledged ? new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000) : undefined,
        resolved,
        resolvedBy: resolved ? ['Dr. Smith', 'Nurse Johnson'][Math.floor(Math.random() * 2)] : undefined,
        resolvedAt: resolved ? new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000) : undefined,
        vitals: vitalReading,
        threshold: this.getAlertThreshold(alertType)
      };
      
      alerts.push(alert);
    }
    
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private static getAlertTitle(type: string, severity: string): string {
    const titles: Record<string, Record<string, string>> = {
      breathing_rate: {
        low: 'Low Breathing Rate',
        medium: 'Breathing Rate Alert',
        high: 'High Breathing Rate',
        critical: 'Critical Breathing Rate'
      },
      heart_rate: {
        low: 'Low Heart Rate',
        medium: 'Heart Rate Alert',
        high: 'High Heart Rate',
        critical: 'Critical Heart Rate'
      },
      oxygen_saturation: {
        low: 'Low Oxygen Level',
        medium: 'Oxygen Level Alert',
        high: 'Low Oxygen Saturation',
        critical: 'Critical Oxygen Level'
      },
      irregular_breathing: {
        low: 'Irregular Breathing',
        medium: 'Breathing Pattern Alert',
        high: 'Abnormal Breathing',
        critical: 'Critical Breathing Pattern'
      },
      sleep_apnea: {
        low: 'Sleep Apnea Detected',
        medium: 'Sleep Apnea Alert',
        high: 'Frequent Sleep Apnea',
        critical: 'Severe Sleep Apnea'
      },
      no_signal: {
        low: 'Signal Weak',
        medium: 'No Signal Detected',
        high: 'Signal Lost',
        critical: 'Critical Signal Loss'
      }
    };
    
    return titles[type]?.[severity] || 'Vital Signs Alert';
  }

  private static getAlertMessage(type: string, severity: string, residentName: string): string {
    const messages: Record<string, Record<string, string>> = {
      breathing_rate: {
        low: `${residentName}'s breathing rate is below normal range`,
        medium: `${residentName}'s breathing rate requires attention`,
        high: `${residentName}'s breathing rate is elevated`,
        critical: `${residentName}'s breathing rate is at critical level`
      },
      heart_rate: {
        low: `${residentName}'s heart rate is below normal`,
        medium: `${residentName}'s heart rate needs monitoring`,
        high: `${residentName}'s heart rate is elevated`,
        critical: `${residentName}'s heart rate is at critical level`
      },
      oxygen_saturation: {
        low: `${residentName}'s oxygen saturation is slightly low`,
        medium: `${residentName}'s oxygen saturation requires attention`,
        high: `${residentName}'s oxygen saturation is critically low`,
        critical: `${residentName}'s oxygen saturation is at dangerous level`
      },
      irregular_breathing: {
        low: `${residentName} shows mild breathing irregularity`,
        medium: `${residentName} has irregular breathing pattern`,
        high: `${residentName}'s breathing is significantly irregular`,
        critical: `${residentName}'s breathing pattern is critical`
      },
      sleep_apnea: {
        low: `${residentName} experienced mild sleep apnea`,
        medium: `${residentName} had sleep apnea episodes`,
        high: `${residentName} had frequent sleep apnea`,
        critical: `${residentName} experienced severe sleep apnea`
      },
      no_signal: {
        low: `${residentName}'s vital signs signal is weak`,
        medium: `${residentName}'s vital signs signal is lost`,
        high: `No signal from ${residentName}'s monitoring device`,
        critical: `Critical: No vital signs data for ${residentName}`
      }
    };
    
    return messages[type]?.[severity] || `Alert for ${residentName}`;
  }

  private static getAlertThreshold(type: string): { min?: number; max?: number; value: number } | undefined {
    const thresholds: Record<string, { min?: number; max?: number; value: number }> = {
      breathing_rate: { min: 6, max: 30, value: 0 },
      heart_rate: { min: 60, max: 100, value: 0 },
      oxygen_saturation: { min: 90, value: 0 }
    };
    
    return thresholds[type];
  }

  static generateVitalSignsTrends(residents: Resident[]): VitalSignsTrend[] {
    const trends: VitalSignsTrend[] = [];
    const metrics = ['breathing_rate', 'heart_rate', 'oxygen_saturation', 'sleep_quality'] as const;
    const periods = ['hourly', 'daily', 'weekly', 'monthly'] as const;
    const trendDirections = ['improving', 'stable', 'declining'] as const;
    
    residents.forEach(resident => {
      metrics.forEach(metric => {
        periods.forEach(period => {
          const dataPoints = period === 'hourly' ? 24 : period === 'daily' ? 7 : period === 'weekly' ? 4 : 12;
          const data = [];
          
          for (let i = 0; i < dataPoints; i++) {
            let value: number;
            if (metric === 'breathing_rate') {
              value = Math.round(12 + Math.random() * 12);
            } else if (metric === 'heart_rate') {
              value = Math.round(70 + Math.random() * 20);
            } else if (metric === 'oxygen_saturation') {
              value = Math.round(92 + Math.random() * 8);
            } else {
              value = Math.round(60 + Math.random() * 40);
            }
            
            data.push({
              timestamp: new Date(Date.now() - i * (period === 'hourly' ? 60 * 60 * 1000 : period === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000)),
              value,
              quality: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any
            });
          }
          
          const values = data.map(d => d.value);
          const trend = trendDirections[Math.floor(Math.random() * trendDirections.length)];
          
          trends.push({
            residentId: resident.id,
            metric,
            period,
            data: data.reverse(),
            trend,
            changePercent: Math.round((Math.random() - 0.5) * 40),
            average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
            min: Math.min(...values),
            max: Math.max(...values)
          });
        });
      });
    });
    
    return trends;
  }

  static generateWellnessIndicators(residents: Resident[]): WellnessIndicator[] {
    const indicators: WellnessIndicator[] = [];
    
    residents.forEach(resident => {
      const overall = ['excellent', 'good', 'fair', 'poor', 'critical'][Math.floor(Math.random() * 5)] as any;
      const breathing = ['normal', 'irregular', 'concerning'][Math.floor(Math.random() * 3)] as any;
      const heart = ['normal', 'irregular', 'concerning'][Math.floor(Math.random() * 3)] as any;
      const sleep = ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any;
      const activity = ['active', 'normal', 'sedentary', 'immobile'][Math.floor(Math.random() * 4)] as any;
      
      const breathingScore = breathing === 'normal' ? 80 + Math.random() * 20 : breathing === 'irregular' ? 50 + Math.random() * 30 : 20 + Math.random() * 30;
      const heartScore = heart === 'normal' ? 80 + Math.random() * 20 : heart === 'irregular' ? 50 + Math.random() * 30 : 20 + Math.random() * 30;
      const sleepScore = sleep === 'excellent' ? 90 + Math.random() * 10 : sleep === 'good' ? 70 + Math.random() * 20 : sleep === 'fair' ? 50 + Math.random() * 20 : 20 + Math.random() * 30;
      const activityScore = activity === 'active' ? 80 + Math.random() * 20 : activity === 'normal' ? 60 + Math.random() * 20 : activity === 'sedentary' ? 40 + Math.random() * 20 : 10 + Math.random() * 30;
      
      const overallScore = Math.round((breathingScore + heartScore + sleepScore + activityScore) / 4);
      
      indicators.push({
        id: `wellness-${resident.id}`,
        residentId: resident.id,
        timestamp: new Date(),
        overall,
        breathing,
        heart,
        sleep,
        activity,
        hydration: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
        nutrition: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
        medication: ['on_track', 'missed', 'late'][Math.floor(Math.random() * 3)] as any,
        social: ['engaged', 'normal', 'isolated'][Math.floor(Math.random() * 3)] as any,
        score: overallScore,
        factors: {
          breathing: Math.round(breathingScore),
          heart: Math.round(heartScore),
          sleep: Math.round(sleepScore),
          activity: Math.round(activityScore),
          overall: overallScore
        }
      });
    });
    
    return indicators;
  }

  static generateVitalSignsStats(): VitalSignsStats {
    return {
      totalReadings: Math.floor(Math.random() * 500) + 200,
      residentsMonitored: 8,
      activeAlerts: Math.floor(Math.random() * 8),
      criticalAlerts: Math.floor(Math.random() * 3),
      systemStatus: ['active', 'warning', 'critical', 'offline'][Math.floor(Math.random() * 4)] as any,
      averageBreathingRate: Math.round(14 + Math.random() * 6),
      averageHeartRate: Math.round(70 + Math.random() * 20),
      dataQuality: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
      uptime: 95 + Math.random() * 5,
      lastUpdate: new Date(),
      trends: {
        breathing: ['stable', 'increasing', 'decreasing'][Math.floor(Math.random() * 3)] as any,
        heart: ['stable', 'increasing', 'decreasing'][Math.floor(Math.random() * 3)] as any,
        sleep: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as any
      },
      alertDistribution: {
        breathing_rate: Math.floor(Math.random() * 5),
        heart_rate: Math.floor(Math.random() * 5),
        oxygen_saturation: Math.floor(Math.random() * 3),
        irregular_breathing: Math.floor(Math.random() * 4),
        sleep_apnea: Math.floor(Math.random() * 3),
        no_signal: Math.floor(Math.random() * 2)
      }
    };
  }

  static generateResidentVitalProfiles(residents: Resident[]): ResidentVitalProfile[] {
    const profiles: ResidentVitalProfile[] = [];
    
    residents.forEach(resident => {
      profiles.push({
        residentId: resident.id,
        baseline: {
          breathingRate: {
            min: Math.round(10 + Math.random() * 4),
            max: Math.round(18 + Math.random() * 6),
            average: Math.round(14 + Math.random() * 4)
          },
          heartRate: {
            min: Math.round(60 + Math.random() * 10),
            max: Math.round(85 + Math.random() * 15),
            average: Math.round(70 + Math.random() * 15)
          },
          sleepDuration: {
            min: Math.round(5 + Math.random() * 2),
            max: Math.round(8 + Math.random() * 2),
            average: Math.round(6.5 + Math.random() * 1.5)
          }
        },
        conditions: ['Hypertension', 'Diabetes', 'Arthritis', 'Sleep Apnea'].slice(0, Math.floor(Math.random() * 3) + 1),
        medications: ['Lisinopril', 'Metformin', 'Aspirin', 'Insulin'].slice(0, Math.floor(Math.random() * 3) + 1),
        restrictions: {
          breathingRate: {
            min: Math.round(8 + Math.random() * 4),
            max: Math.round(25 + Math.random() * 8)
          },
          heartRate: {
            min: Math.round(50 + Math.random() * 10),
            max: Math.round(95 + Math.random() * 15)
          },
          oxygenSaturation: {
            min: Math.round(88 + Math.random() * 4)
          },
          activity: {
            maxLevel: ['light', 'moderate', 'vigorous'][Math.floor(Math.random() * 3)] as any
          }
        },
        preferences: {
          alertSensitivity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          notificationMethods: ['email', 'sms', 'push', 'phone'].slice(0, Math.floor(Math.random() * 3) + 1),
          quietHours: Math.random() > 0.5 ? {
            start: '22:00',
            end: '07:00'
          } : undefined
        }
      });
    });
    
    return profiles;
  }

  static generateVitalSignsDevices(): VitalSignsDevice[] {
    const devices: VitalSignsDevice[] = [];
    const deviceTypes = ['wearable', 'bed_sensor', 'room_sensor', 'chair_sensor'] as const;
    const statuses = ['active', 'inactive', 'maintenance', 'error'] as const;
    
    for (let i = 0; i < 12; i++) {
      const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      devices.push({
        id: `device-${i + 1}`,
        deviceId: `VS-${String(i + 1).padStart(3, '0')}`,
        type: deviceType,
        location: `Room ${Math.floor(Math.random() * 8) + 1}`,
        residentId: Math.random() > 0.3 ? `resident-${Math.floor(Math.random() * 8) + 1}` : undefined,
        status,
        batteryLevel: deviceType === 'wearable' ? Math.round(20 + Math.random() * 80) : undefined,
        signalStrength: Math.round(20 + Math.random() * 80),
        lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        capabilities: this.getDeviceCapabilities(deviceType),
        firmware: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
        model: `${deviceType === 'wearable' ? 'Watch' : deviceType === 'bed_sensor' ? 'Bed' : deviceType === 'chair_sensor' ? 'Chair' : 'Room'}-Pro-${Math.floor(Math.random() * 9000) + 1000}`,
        manufacturer: ['HealthTech', 'MediSense', 'CareMonitor', 'VitalTrack'][Math.floor(Math.random() * 4)]
      });
    }
    
    return devices;
  }

  private static getDeviceCapabilities(type: string): string[] {
    const capabilities: Record<string, string[]> = {
      wearable: ['heart_rate', 'breathing_rate', 'oxygen_saturation', 'activity', 'sleep_tracking'],
      bed_sensor: ['breathing_rate', 'movement', 'sleep_quality', 'presence'],
      room_sensor: ['presence', 'movement', 'ambient_temperature', 'humidity'],
      chair_sensor: ['presence', 'movement', 'posture', 'heart_rate']
    };
    
    return capabilities[type] || [];
  }

  static generateCompleteVitalSignsData(residents: Resident[]) {
    const vitalSignsReadings = this.generateVitalSignsReadings(100, residents);
    const breathingPatterns = this.generateBreathingPatterns(20, residents);
    const sleepSessions = this.generateSleepSessions(15, residents);
    const vitalSignsAlerts = this.generateVitalSignsAlerts(12, residents);
    const vitalSignsTrends = this.generateVitalSignsTrends(residents);
    const wellnessIndicators = this.generateWellnessIndicators(residents);
    const stats = this.generateVitalSignsStats();
    const residentProfiles = this.generateResidentVitalProfiles(residents);
    const devices = this.generateVitalSignsDevices();

    return {
      vitalSignsReadings,
      breathingPatterns,
      sleepSessions,
      vitalSignsAlerts,
      vitalSignsTrends,
      wellnessIndicators,
      stats,
      residentProfiles,
      devices
    };
  }
}