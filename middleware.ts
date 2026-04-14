// middleware.ts (Full Script)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const hostname = request.headers.get('host') || '';

  // 1. Definisikan Domain Vercel & Studio
  const isVercelDomain = hostname.includes('vercel.app');
  const isStudioDomain = hostname.startsWith('studio.');

  // 2. Ambil Cookie Auth (Lebih aman dari localStorage untuk Server-side)
  const isAuthenticated = request.cookies.get('studio_session')?.value === 'true';

  // 3. PROTEKSI FOLDER /STUDIO
  if (pathname.startsWith('/studio')) {
    // Abaikan jika menuju halaman login
    if (pathname === '/studio/login') {
      return NextResponse.next();
    }

    // Jika tidak ada session auth, lempar paksa ke login
    if (!isAuthenticated) {
      const loginUrl = new URL('/studio/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. LOGIKA SUBDOMAIN (Opsional jika pakai domain kustom)
  if (isStudioDomain && !pathname.startsWith('/studio')) {
    return NextResponse.rewrite(new URL(`/studio${pathname}`, request.url));
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