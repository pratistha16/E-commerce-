import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Define main domain
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000';
  
  // Extract subdomain
  const isSubdomain = hostname !== mainDomain && !hostname.startsWith('127.0.0.1');
  
  if (isSubdomain) {
    const subdomain = hostname.split('.')[0];
    
    // Rewrite /dashboard to /merchant/dashboard
    if (url.pathname === '/dashboard') {
      url.pathname = '/merchant/dashboard';
      return NextResponse.rewrite(url);
    }

    // Rewrite /products to /products (keep as is, but could be filtered by tenant)
    // The backend already handles filtering by tenant via Host header.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
