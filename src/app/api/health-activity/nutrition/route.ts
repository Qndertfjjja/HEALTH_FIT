import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Nutrition from '@/models/Nutrition';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
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

    const { mealType, foodItem, calories, protein, carbs, fats, notes, totalCalories } = await request.json();

    // ✅ Fallback calculation if totalCalories isn't provided
    const calculatedTotalCalories = totalCalories || calories;

    const nutrition = await Nutrition.create({
      userId: payload.id,
      mealType,
      foodItem,
      calories,
      protein,
      carbs,
      fats,
      notes,
      totalCalories: calculatedTotalCalories, // ✅ Add totalCalories here
    });

    return NextResponse.json(
      { message: 'Nutrition data logged successfully', nutrition },
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

    // ✅ Fetch nutrition records for the authenticated user
    const nutritionRecords = await Nutrition.find({ userId: payload.id }).sort({ date: -1 });

    return NextResponse.json(nutritionRecords);
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
