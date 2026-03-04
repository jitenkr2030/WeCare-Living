import { NextRequest, NextResponse } from 'next/server';
import { MockDataGenerator } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('residentId');
    const severity = searchParams.get('severity');
    const acknowledged = searchParams.get('acknowledged');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate mock data
    const residents = MockDataGenerator.generateResidents(8);
    const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);

    // Filter alerts
    let filteredAlerts = vitalSignsData.vitalSignsAlerts;
    
    if (residentId) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.residentId === residentId
      );
    }
    
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.severity === severity
      );
    }
    
    if (acknowledged !== null) {
      const isAcknowledged = acknowledged === 'true';
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.acknowledged === isAcknowledged
      );
    }

    // Sort by timestamp (most recent first)
    filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const paginatedAlerts = filteredAlerts.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        alerts: paginatedAlerts,
        total: filteredAlerts.length,
        limit,
        offset,
        hasMore: offset + limit < filteredAlerts.length
      }
    });
  } catch (error) {
    console.error('Error fetching vital signs alerts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch vital signs alerts' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { residentId, type, severity, title, message, vitals } = body;

    // Validate required fields
    if (!residentId || !type || !severity || !title) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: residentId, type, severity, title' 
        },
        { status: 400 }
      );
    }

    // Create new alert
    const newAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      residentId,
      type,
      severity,
      title,
      message: message || `${title} for resident ${residentId}`,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
      vitals: vitals || null
    };

    // In a real implementation, this would save to a database
    console.log('New vital signs alert:', newAlert);

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: 'Vital signs alert created successfully'
    });
  } catch (error) {
    console.error('Error creating vital signs alert:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create vital signs alert' 
      },
      { status: 500 }
    );
  }
}