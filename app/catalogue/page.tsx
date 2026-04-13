'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export default function CataloguePage() {
  const [lookbooks, setLookbooks] = useState<any[]>([]);

  useEffect(() => {
    async function getLooks() {
      const { data } = await supabase.from('lookbooks').select('*').order('created_at', { ascending: false });
      if (data) setLookbooks(data);
    }
    getLooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex justify-center font-sans text-black">
      <div className="w-full max-w-[450px] bg-white min-h-screen flex flex-col shadow-xl">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b-[1px] border-gray-100">
          <Link href="/" className="bg-black text-white rounded-full px-4 py-1.5 hover:bg-gray-800 transition-all"><ChevronLeft size={20} strokeWidth={4} /></Link>
          <h1 className="text-xl font-[1000] italic tracking-tighter uppercase">Catalogue</h1>
          <div className="w-10"></div>
        </header>

        <div className="p-6 pb-24">
          <motion.h2 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-3xl font-[1000] uppercase tracking-tighter mb-8">Our Lookbooks</motion.h2>
          <div className="grid grid-cols-2 gap-4">
            {lookbooks.map((look, i) => {
              const isFull = i % 3 === 0;
              return (
                <motion.div key={look.id} className={isFull ? 'col-span-2' : 'col-span-1'} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
                  <Link href={`/catalogue/${look.id}`} className={`relative overflow-hidden border-[3.5px] border-black rounded-3xl group block bg-gray-100 ${isFull ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
                    <img src={look.image_url} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-5 flex flex-col justify-end">
                      <h3 className={`text-white font-[1000] uppercase leading-tight ${isFull ? 'text-2xl' : 'text-sm'}`}>{look.theme_title}</h3>
                      <p className={`text-red-500 font-bold uppercase ${isFull ? 'text-sm' : 'text-[10px]'}`}>{look.views || 0} Views</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}