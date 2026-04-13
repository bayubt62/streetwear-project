'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DetailLookbook() {
  const { id } = useParams();
  const router = useRouter();
  const [look, setLook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndIncrement() {
      if (!id) return;

      try {
        // 1. COBA TAMBAH VIEW (Jika RPC gagal, web tidak akan macet)
        await supabase.rpc('increment_views', { row_id: id });
      } catch (e) {
        console.error("RPC Error:", e);
      }

      // 2. AMBIL DATA
      const { data } = await supabase
        .from('lookbooks')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setLook(data);
      setLoading(false);
    }

    fetchAndIncrement();
  }, [id]);

  if (loading) return (
    <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center font-black italic text-gray-200">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
      LOADING...
    </div>
  );
  
  if (!look) return <div className="min-h-[100dvh] bg-white flex items-center justify-center">Look not found.</div>;

  return (
    <div className="min-h-[100dvh] bg-white text-black font-sans relative">
      
      {/* 1. HEADER NAV - Back Button melayang */}
      <div className="absolute top-8 left-6 z-50">
        <button 
          onClick={() => router.back()}
          className="bg-black text-white p-3 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:scale-90 transition-transform"
        >
          <ChevronLeft size={22} strokeWidth={3} />
        </button>
      </div>

      {/* 2. HERO IMAGE - Perbaikan scaling agar tidak terlalu zoom */}
      <div className="w-full h-[65dvh] relative overflow-hidden bg-gray-50">
        <img 
          src={look.image_url} 
          className="w-full h-full object-cover object-center" // Diubah ke center agar lebih seimbang
          alt={look.theme_title}
        />
        {/* Gradasi halus agar teks di bawah terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
      </div>

      {/* 3. CONTENT BOX - Modern Brutalist Style */}
      <div className="px-6 -mt-16 relative z-10 pb-12">
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-[3px] border-black p-6 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
        >
          {/* Badge Info */}
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Streetwear Insp.</span>
            <div className="flex items-center gap-1.5 bg-[#FF3B3B] text-white text-[9px] px-3 py-1.5 rounded-full font-black">
              <Eye size={12} strokeWidth={3} />
              {look.views || 0} VIEWS
            </div>
          </div>

          {/* Title & Desc */}
          <h1 className="text-[26px] font-[1000] uppercase leading-[1.1] mb-4 tracking-tight">
            {look.theme_title}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8 font-medium">
            {look.description || "Confidence is the best outfit. Get the detail of this look by clicking the button below."}
          </p>

          {/* Tombol CTA - Mengatasi about:blank */}
          <motion.div whileTap={{ scale: 0.96 }}>
            <a 
              href={look.affiliate_link && look.affiliate_link !== "" ? look.affiliate_link : "#"}
              target={look.affiliate_link ? "_blank" : "_self"}
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all border-2 border-black
                ${look.affiliate_link ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <ShoppingBag size={18} strokeWidth={2.5} />
              {look.affiliate_link ? 'Get This Outfit' : 'Link Not Available'}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}