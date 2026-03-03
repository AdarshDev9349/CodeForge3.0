import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for the admin dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    const adminToken = request.cookies.get('admin_token');
    
    // If no token, redirect to login
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/dashboard/:path*',
  ]
};
