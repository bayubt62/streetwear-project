import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

  // 1. Definisikan domain studio Anda (misal: studio.streetwear.id atau studio-app.vercel.app)
  const isStudioDomain = hostname?.startsWith('studio.');

  // 2. Jika akses ke domain 'studio', arahkan secara internal ke folder /studio
  if (isStudioDomain && !url.pathname.startsWith('/studio')) {
    return NextResponse.rewrite(new URL(`/studio${url.pathname}`, request.url));
  }

  // 3. Jika akses domain utama tapi mencoba buka /studio, kita blokir (opsional)
  if (!isStudioDomain && url.pathname.startsWith('/studio')) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

// Hanya jalankan middleware ini pada rute tertentu
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};