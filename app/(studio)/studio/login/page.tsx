'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudioLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  // TENTUKAN PIN ANDA DI SINI
  const MASTER_PIN = '033013'

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === MASTER_PIN) {
      localStorage.setItem('studio_auth', 'is_authenticated');
      router.push('/studio');
      router.refresh();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-6 font-sans">
      <motion.div 
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="w-full max-w-[350px] bg-white border-[4px] border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-black text-white p-4 rounded-full mb-6">
            <Lock size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-[1000] uppercase mb-2">Studio Gate</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Enter PIN to Access</p>
          
          <form onSubmit={handleUnlock} className="w-full">
            <input 
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full bg-gray-100 border-[3px] border-black rounded-2xl py-4 text-center text-2xl tracking-[0.5em] font-black focus:outline-none focus:bg-white mb-4"
              maxLength={6}
            />
            
            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-[1000] uppercase text-xs tracking-[0.2em] shadow-lg active:scale-95 transition-all"
            >
              Unlock Studio
            </button>
          </form>
          
          {error && <p className="text-red-500 text-[10px] font-black uppercase mt-4 animate-pulse text-center">Wrong PIN. Access Denied.</p>}
        </div>
      </motion.div>
    </div>
  );
}