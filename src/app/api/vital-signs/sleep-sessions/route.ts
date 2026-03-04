import { NextRequest, NextResponse } from 'next/server';
import { MockDataGenerator } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('residentId');
    const quality = searchParams.get('quality');
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate mock data
    const residents = MockDataGenerator.generateResidents(8);
    const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);

    // Filter sleep sessions
    let filteredSessions = vitalSignsData.sleepSessions;
    
    if (residentId) {
      filteredSessions = filteredSessions.filter(session => 
        session.residentId === residentId
      );
    }
    
    if (quality) {
      filteredSessions = filteredSessions.filter(session => 
        session.quality === quality
      );
    }
    
    if (active === 'true') {
      filteredSessions = filteredSessions.filter(session => 
        !session.endTime
      );
    }

    // Sort by start time (most recent first)
    filteredSessions.sort((a, b) => (b.startTime?.getTime() || 0) - (a.startTime?.getTime() || 0));

    // Apply pagination
    const paginatedSessions = filteredSessions.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        sleepSessions: paginatedSessions,
        total: filteredSessions.length,
        limit,
        offset,
        hasMore: offset + limit < filteredSessions.length
      }
    });
  } catch (error) {
    console.error('Error fetching sleep sessions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sleep sessions' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      residentId, 
      startTime, 
      endTime, 
      quality, 
      sleepEfficiency, 
      stages, 
      breathingDisturbances,
      averageBreathingRate,
      averageHeartRate 
    } = body;

    // Validate required fields
    if (!residentId || !startTime) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: residentId, startTime' 
        },
        { status: 400 }
      );
    }

    // Create new sleep session
    const newSession = {
      id: `sleep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      residentId,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined,
      duration: endTime ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)) : undefined,
      quality: quality || 'good',
      sleepEfficiency: sleepEfficiency || 85,
      stages: stages || {
        awake: 30,
        light_sleep: 240,
        deep_sleep: 120,
        rem_sleep: 90
      },
      breathingDisturbances: breathingDisturbances || 0,
      averageBreathingRate: averageBreathingRate || 16,
      averageHeartRate: averageHeartRate || 65,
      events: []
    };

    // In a real implementation, this would save to a database
    console.log('New sleep session:', newSession);

    return NextResponse.json({
      success: true,
      data: newSession,
      message: 'Sleep session created successfully'
    });
  } catch (error) {
    console.error('Error creating sleep session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create sleep session' 
      },
      { status: 500 }
    );
  }
}