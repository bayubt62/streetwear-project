'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashPage() {
  const [recentLooks, setRecentLooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLooks() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('lookbooks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        if (data) setRecentLooks(data);
      } catch (error) {
        console.error("Error fetching looks:", error);
      } finally {
        setLoading(false);
      }
    }
    getLooks();
  }, []);

  return (
    // Menggunakan min-h-[100dvh] agar pas dengan layar HP dinamis
    <div className="min-h-[100dvh] bg-white md:bg-[#f4f4f4] flex justify-center font-sans text-black relative">
      
      {/* Container Utama */}
      <div className="w-full max-w-[450px] bg-white min-h-[100dvh] flex flex-col items-center md:shadow-2xl relative overflow-hidden">
        
        {/* 1. LOGO HEADER - Melayang di Atas Foto */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 w-full text-center z-30 pointer-events-none"
        >
          <h1 className="text-[28px] font-normal text-black" 
              style={{ fontFamily: 'var(--font-bukhari)' }}>
            Streetwear Insp.
          </h1>
        </motion.div>

        {/* 2. HERO IMAGE SECTION - Menggunakan dvh agar akurat */}
        <div className="w-full h-[65dvh] relative flex justify-center items-end bg-gray-50 overflow-hidden">
          <motion.img
            initial={{ scale: 1.15 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            src="/main_look.png" 
            alt="Hero Streetwear"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/40 to-transparent z-10"></div>
        </div>

        {/* 3. LATEST LOOKS PILL */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.5, duration: 0.5 }}
          className="z-20 -mt-7 mb-10"
        >
          <div className="bg-white border-[3px] border-black px-8 py-2 rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-[13px] font-[1000] uppercase tracking-[0.2em] text-black">Latest Looks</h2>
          </div>
        </motion.div>

        {/* 4. DERETAN 3 KARTU KECIL */}
        <div className="flex gap-3 px-6 w-full z-10 mb-12">
          <AnimatePresence>
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex-1 aspect-[1/1.6] bg-gray-100 border-[2.5px] border-black border-dashed rounded-2xl"></div>
              ))
            ) : (
              recentLooks.map((look, i) => (
                <motion.div 
                  key={look.id} 
                  className="flex-1"
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 * i, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                >
                  <Link 
                    href={`/catalogue/${look.id}`} 
                    className="block aspect-[1/1.6] bg-black border-[3.5px] border-black rounded-3xl overflow-hidden relative group active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"
                  >
                    <img 
                      src={look.image_url} 
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 transition-all duration-500" 
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/95 via-black/70 p-2 pt-4 text-center">
                      <h3 className="text-white text-[10px] font-black uppercase truncate tracking-tight mb-0.5">
                        {look.theme_title}
                      </h3>
                      <p className="text-[#ff3b3b] text-[8px] font-bold uppercase tracking-widest">
                        {look.views || 0} Views
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* 5. TOMBOL EXPLORE - Versi "Kurus" dinaikkan (mb-20) */}
        <motion.div 
          className="mt-auto mb-20 w-full px-14"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <Link 
            href="/catalogue" 
            className="block w-full bg-black text-white text-center py-2 rounded-full font-[1000] uppercase text-[10px] tracking-[0.35em] shadow-lg hover:bg-gray-900 transition-all border-2 border-black active:shadow-inner"
          >
            Explore Catalogue
          </Link>
        </motion.div>

      </div>
    </div>
  );
}