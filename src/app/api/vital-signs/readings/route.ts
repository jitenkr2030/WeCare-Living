import { NextRequest, NextResponse } from 'next/server';
import { MockDataGenerator } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('residentId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate mock data
    const residents = MockDataGenerator.generateResidents(8);
    const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);

    // Filter by resident if specified
    let filteredReadings = vitalSignsData.vitalSignsReadings;
    if (residentId) {
      filteredReadings = filteredReadings.filter(reading => 
        reading.residentId === residentId
      );
    }

    // Apply pagination
    const paginatedReadings = filteredReadings.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        vitalSignsReadings: paginatedReadings,
        total: filteredReadings.length,
        limit,
        offset,
        hasMore: offset + limit < filteredReadings.length
      }
    });
  } catch (error) {
    console.error('Error fetching vital signs readings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch vital signs readings' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { residentId, breathingRate, heartRate, oxygenSaturation, deviceId, location } = body;

    // Validate required fields
    if (!residentId || !breathingRate || !heartRate) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: residentId, breathingRate, heartRate' 
        },
        { status: 400 }
      );
    }

    // Create new vital signs reading
    const newReading = {
      id: `vital-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      residentId,
      timestamp: new Date(),
      breathingRate: parseInt(breathingRate),
      heartRate: parseInt(heartRate),
      oxygenSaturation: oxygenSaturation ? parseInt(oxygenSaturation) : undefined,
      bodyTemperature: body.bodyTemperature || undefined,
      bloodPressure: body.bloodPressure || undefined,
      sleepStage: body.sleepStage || 'awake',
      activityLevel: body.activityLevel || 'resting',
      signalQuality: body.signalQuality || 'good',
      deviceId: deviceId || `device-${Math.floor(Math.random() * 10) + 1}`,
      location: location || 'Unknown'
    };

    // In a real implementation, this would save to a database
    console.log('New vital signs reading:', newReading);

    return NextResponse.json({
      success: true,
      data: newReading,
      message: 'Vital signs reading recorded successfully'
    });
  } catch (error) {
    console.error('Error creating vital signs reading:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create vital signs reading' 
      },
      { status: 500 }
    );
  }
}