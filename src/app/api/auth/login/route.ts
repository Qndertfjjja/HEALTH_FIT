import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/connect';
import User from '../../../../lib/models/user';
import { generateToken } from '../../../../lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // ✅ Validate Request Body
    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide both email and password' }, { status: 400 });
    }

    await connectDB();

    // 🔐 Find User by Email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 🔒 Compare Passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 🎟️ Generate JWT Token
    const token = generateToken(user._id.toString());

    // 🍪 Set Token as HTTP-Only Cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token, // ✅ Added token in response
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
