import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and auth API through
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for valid auth cookie
  const authCookie = req.cookies.get('rc-auth');
  if (authCookie?.value === process.env.SITE_PASSWORD) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico|icons/|manifest.json).*)'],
};
