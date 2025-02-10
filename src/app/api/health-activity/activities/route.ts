// 1. First, the API route (app/api/health-activity/activities/route.ts)
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    
    // Create new activity with matching field names from the model
    const activity = await Activity.create({
      userId: payload.id,
      activityType: body.activityType,
      duration: body.duration,
      intensity: body.intensity,
      caloriesBurned: body.caloriesBurned,
      notes: body.notes || '',
      date: new Date()
    });

    return NextResponse.json(
      { message: 'Activity logged successfully', activity },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const activities = await Activity.find({ userId: payload.id }).sort({ date: -1 });

    return NextResponse.json(activities, { status: 200 });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}