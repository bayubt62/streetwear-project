import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

  // 1. Cek apakah alamat diawali dengan 'studio.' (untuk domain kustom nanti)
  const isStudioDomain = hostname?.startsWith('studio.');
  
  // 2. Cek apakah Anda sedang menggunakan domain gratis dari Vercel
  const isVercelDomain = hostname?.includes('vercel.app');

  // Jika akses lewat domain studio, arahkan ke folder /studio
  if (isStudioDomain && !url.pathname.startsWith('/studio')) {
    return NextResponse.rewrite(new URL(`/studio${url.pathname}`, request.url));
  }

  // IZINKAN: Jika sedang di domain Vercel, jangan blokir akses ke /studio
  if (isVercelDomain && url.pathname.startsWith('/studio')) {
    return NextResponse.next();
  }

  // BLOKIR: Selain domain Vercel & domain Studio, lempar ke 404 jika coba buka /studio
  if (!isStudioDomain && !isVercelDomain && url.pathname.startsWith('/studio')) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};