import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the auth token cookie by setting an expired date
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('token', '', { expires: new Date(0), path: '/' }); // Expire the cookie

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
