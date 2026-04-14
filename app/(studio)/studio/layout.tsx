'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('studio_auth');
      
      // Jika mencoba akses /studio tapi bukan di halaman login
      if (pathname !== '/studio/login') {
        if (!auth || auth !== 'is_authenticated') {
          setAuthorized(false);
          router.push('/studio/login');
        } else {
          setAuthorized(true);
        }
      } else {
        // Jika sedang di halaman login
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Hindari "flicker" konten sebelum redirect selesai
  if (pathname !== '/studio/login' && !authorized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase italic text-gray-200">
        Authenticating...
      </div>
    );
  }

  return <>{children}</>;
}