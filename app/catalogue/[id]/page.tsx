'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { ChevronLeft, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OutfitDetailsPage() {
  const { id } = useParams();
  const [look, setLook] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function getData() {
      if (!id) return;

      // 1. Logika Tambah View Otomatis (Pastikan RPC sudah dibuat di Supabase)
      try {
        await supabase.rpc('increment_views', { row_id: id });
      } catch (err) {
        console.error("View increment failed:", err);
      }

      // 2. Ambil data Lookbook
      const { data: l } = await supabase
        .from('lookbooks')
        .select('*')
        .eq('id', id)
        .single();

      // 3. Ambil data produk terkait (Shop the look)
      const { data: i } = await supabase
        .from('lookbook_items')
        .select('*')
        .eq('lookbook_id', id);

      setLook(l);
      setItems(i || []);
    }
    getData();
  }, [id]);

  if (!look) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase italic tracking-tighter text-gray-200">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex justify-center font-sans text-black">
      {/* Container Mobile-First */}
      <div className="w-full max-w-[450px] bg-white min-h-screen flex flex-col shadow-xl overflow-x-hidden relative">
        
        {/* HEADER - Floating Back & View Count */}
        <header className="absolute top-0 z-50 w-full px-6 py-8 flex justify-between items-center pointer-events-none">
          <Link 
            href="/catalogue" 
            className="bg-black text-white rounded-full p-2 pointer-events-auto shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} strokeWidth={4} />
          </Link>
          
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border-2 border-black pointer-events-auto shadow-sm">
            <Eye size={14} strokeWidth={2.5} />
            <span className="text-[10px] font-black">{look.views || 0}</span>
          </div>
        </header>

        {/* HERO IMAGE - Aspect 3:4 dengan Border Bawah Tebal */}
        <motion.img 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          src={look.image_url} 
          className="w-full aspect-[3/4] object-cover border-b-[4px] border-black" 
        />
        
        {/* CONTENT SECTION */}
        <div className="p-6 pb-24">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="text-4xl font-[1000] uppercase tracking-tighter leading-none mb-8"
          >
            {look.theme_title}
          </motion.h2>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Shop the look</h3>
            
            {items.length > 0 ? (
              items.map((item, idx) => (
                <motion.a 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: 0.1 * idx }}
                  key={item.id} 
                  href={item.affiliate_url?.startsWith('http') ? item.affiliate_url : `https://${item.affiliate_url}`} 
                  target="_blank" 
                  className="flex items-center justify-between p-5 border-[3px] border-black rounded-2xl hover:bg-black hover:text-white transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-[1000] uppercase leading-none mb-1">
                      {item.product_name}
                    </span>
                    <span className="text-[10px] font-bold opacity-40 uppercase">Buy Now</span>
                  </div>
                  <ShoppingBag size={22} strokeWidth={3} />
                </motion.a>
              ))
            ) : (
              <p className="text-[10px] font-bold uppercase opacity-30 italic py-4">No items linked to this look yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}