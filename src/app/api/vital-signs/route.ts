import { NextRequest, NextResponse } from 'next/server';
import { MockDataGenerator } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('residentId');

    // Generate mock data
    const residents = MockDataGenerator.generateResidents(8);
    const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);

    // Filter data by resident if specified
    if (residentId) {
      const filteredData = {
        ...vitalSignsData,
        vitalSignsReadings: vitalSignsData.vitalSignsReadings.filter(reading => 
          reading.residentId === residentId
        ),
        breathingPatterns: vitalSignsData.breathingPatterns.filter(pattern => 
          pattern.residentId === residentId
        ),
        sleepSessions: vitalSignsData.sleepSessions.filter(session => 
          session.residentId === residentId
        ),
        vitalSignsAlerts: vitalSignsData.vitalSignsAlerts.filter(alert => 
          alert.residentId === residentId
        ),
        wellnessIndicators: vitalSignsData.wellnessIndicators.filter(indicator => 
          indicator.residentId === residentId
        ),
        residentProfiles: vitalSignsData.residentProfiles.filter(profile => 
          profile.residentId === residentId
        )
      };

      return NextResponse.json({
        success: true,
        data: filteredData
      });
    }

    return NextResponse.json({
      success: true,
      data: vitalSignsData
    });
  } catch (error) {
    console.error('Error fetching vital signs data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch vital signs data' 
      },
      { status: 500 }
    );
  }
}