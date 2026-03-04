import { NextRequest, NextResponse } from 'next/server';
import { MockDataGenerator } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('residentId');
    const pattern = searchParams.get('pattern');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate mock data
    const residents = MockDataGenerator.generateResidents(8);
    const vitalSignsData = MockDataGenerator.generateCompleteVitalSignsData(residents);

    // Filter breathing patterns
    let filteredPatterns = vitalSignsData.breathingPatterns;
    
    if (residentId) {
      filteredPatterns = filteredPatterns.filter(pattern => 
        pattern.residentId === residentId
      );
    }
    
    if (pattern) {
      filteredPatterns = filteredPatterns.filter(pattern => 
        pattern.pattern === pattern
      );
    }
    
    if (severity) {
      filteredPatterns = filteredPatterns.filter(pattern => 
        pattern.severity === severity
      );
    }

    // Sort by timestamp (most recent first)
    filteredPatterns.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const paginatedPatterns = filteredPatterns.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        breathingPatterns: paginatedPatterns,
        total: filteredPatterns.length,
        limit,
        offset,
        hasMore: offset + limit < filteredPatterns.length
      }
    });
  } catch (error) {
    console.error('Error fetching breathing patterns:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch breathing patterns' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { residentId, pattern, severity, duration, confidence, description } = body;

    // Validate required fields
    if (!residentId || !pattern || !severity) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: residentId, pattern, severity' 
        },
        { status: 400 }
      );
    }

    // Create new breathing pattern
    const newPattern = {
      id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      residentId,
      timestamp: new Date(),
      pattern,
      severity,
      duration: duration || 0,
      confidence: confidence || 0.8,
      description: description || `${pattern} breathing pattern detected`
    };

    // In a real implementation, this would save to a database
    console.log('New breathing pattern:', newPattern);

    return NextResponse.json({
      success: true,
      data: newPattern,
      message: 'Breathing pattern recorded successfully'
    });
  } catch (error) {
    console.error('Error creating breathing pattern:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create breathing pattern' 
      },
      { status: 500 }
    );
  }
}