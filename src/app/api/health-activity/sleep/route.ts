import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/lib/connect';
import Sleep from '@/models/Sleep';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try { 
    await connectDB();

    // ✅ Get token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { startTime, endTime, quality, notes } = await request.json();

    // ✅ Calculate sleep duration in minutes
    const duration = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60));

    const sleep = await Sleep.create({
      userId: payload.id, // ✅ Use ID from token
      startTime,
      endTime,
      duration,
      quality,
      notes,
    });

    return NextResponse.json(
      { message: 'Sleep data logged successfully', sleep },
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

    // ✅ Get token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // ✅ Fetch sleep records for the authenticated user
    const sleepRecords = await Sleep.find({ userId: payload.id }).sort({ startTime: -1 });

    return NextResponse.json(sleepRecords);

  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
