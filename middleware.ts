import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /profile, /api/profile)
  const path = request.nextUrl.pathname;

  // Define paths that are considered public
  const isPublicPath = path === '/login' || path === '/signup';

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || '';

  // If the path is public and user is logged in,
  // redirect to home page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the path is protected and user is not logged in,
  // redirect to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
};
