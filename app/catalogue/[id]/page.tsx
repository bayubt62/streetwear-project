'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DetailLookbook() {
  const { id } = useParams();
  const router = useRouter();
  const [look, setLook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndIncrement() {
      if (!id) return;

      // 1. TAMBAH VIEW DI DATABASE (Memanggil fungsi SQL tadi)
      await supabase.rpc('increment_views', { row_id: id });

      // 2. AMBIL DATA TERBARU
      const { data, error } = await supabase
        .from('lookbooks')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setLook(data);
      setLoading(false);
    }

    fetchAndIncrement();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold">LOADING...</div>;
  if (!look) return <div className="min-h-screen bg-white flex items-center justify-center">Look not found.</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      {/* Header Mobile */}
      <div className="fixed top-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => router.back()}
          className="bg-black text-white p-3 rounded-full shadow-xl pointer-events-auto active:scale-90 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Main Image */}
      <div className="w-full h-[70vh] relative overflow-hidden bg-gray-100">
        <img 
          src={look.image_url} 
          className="w-full h-full object-cover object-top"
          alt={look.theme_title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="px-8 -mt-12 relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-[3px] border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">STREETWEAR INSP.</p>
              <h1 className="text-2xl font-[1000] uppercase leading-none">{look.theme_title}</h1>
            </div>
            <div className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black animate-pulse">
              {look.views || 0} VIEWS
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {look.description || "No description available for this look."}
          </p>

          {/* Tombol Shopee/Affiliate */}
          <a 
            href={look.affiliate_link || "#"}
            target="_blank"
            className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-900 transition-all active:scale-95"
          >
            <ShoppingBag size={18} />
            Get This Outfit
          </a>
        </motion.div>
      </div>
    </div>
  );
}