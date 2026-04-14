// app/studio/login/page.tsx (Full Script)
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudioLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  // PIN RAHASIA (Ganti dengan PIN Anda)
  const MASTER_PIN = '123456'; 

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === MASTER_PIN) {
      // SET COOKIE (Agar terbaca oleh Middleware/Server)
      // Berlaku selama 24 jam
      document.cookie = "studio_session=true; path=/; max-age=86400; SameSite=Strict";
      
      router.push('/studio');
      router.refresh();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-6 font-sans">
      <motion.div 
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="w-full max-w-[350px] bg-white border-[4px] border-white p-8 rounded-[3rem] shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)]"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-black text-white p-5 rounded-full mb-6 border-2 border-black">
            <Lock size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-[1000] uppercase mb-2 tracking-tighter">Admin Access</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Security Layer Active</p>
          
          <form onSubmit={handleUnlock} className="w-full">
            <input 
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="ENTER PIN"
              className="w-full bg-gray-100 border-[3px] border-black rounded-2xl py-5 text-center text-xl font-black focus:outline-none focus:ring-4 focus:ring-gray-200 mb-4 transition-all"
              maxLength={6}
            />
            
            <button 
              type="submit"
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-gray-800 active:scale-95 transition-all shadow-xl"
            >
              Authorize
            </button>
          </form>
          
          {error && <p className="text-red-500 text-[10px] font-black uppercase mt-6 tracking-widest">Invalid Signature</p>}
        </div>
      </motion.div>
    </div>
  );
}