'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Settings, Plus, LayoutGrid, MousePointer2, X, Database, Globe } from 'lucide-react';

export default function StudioDashboard() {
  const [stats, setStats] = useState({ totalLooks: 0, totalViews: 0 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ambil data statistik dari Supabase
  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase.from('lookbooks').select('views');
        if (error) throw error;
        
        const totalLooks = data.length;
        const totalViews = data.reduce((sum, item) => sum + (item.views || 0), 0);
        
        setStats({ totalLooks, totalViews });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      {/* HEADER - Mobile Optimized */}
      <header className="border-b-[4px] border-black p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
            Studio Command
          </h1>
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mt-2">
            Streetwear Project Workspace
          </p>
        </div>
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center justify-center gap-2 bg-white border-[3px] border-black px-6 py-2 rounded-full font-black uppercase text-sm hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          <Settings size={18} strokeWidth={3} />
          Settings
        </button>
      </header>

      {/* MAIN CONTENT - Grid Responsive */}
      <main className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* STATS: TOTAL LOOKS */}
        <div className="bg-white border-[4px] border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
          <LayoutGrid className="absolute -right-4 -top-4 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" size={120} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <div className="h-1 w-6 bg-black"></div>
              <span className="text-xs font-black uppercase tracking-widest">Total Looks</span>
            </div>
            <div className="text-7xl font-black tracking-tighter">
              {loading ? "..." : stats.totalLooks}
            </div>
          </div>
        </div>

        {/* STATS: TOTAL CLICKS/VIEWS */}
        <div className="bg-white border-[4px] border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
          <MousePointer2 className="absolute -right-4 -top-4 text-red-50 opacity-0 group-hover:opacity-100 transition-opacity" size={120} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-red-500">
              <div className="h-1 w-6 bg-red-500"></div>
              <span className="text-xs font-black uppercase tracking-widest">Total Clicks</span>
            </div>
            <div className="text-7xl font-black tracking-tighter text-red-600">
              {loading ? "..." : stats.totalViews}
            </div>
          </div>
        </div>

        {/* ACTION: ADD NEW LOOK */}
        <Link href="/studio/add-look" className="group">
          <div className="h-full bg-black text-white p-8 rounded-[32px] border-[4px] border-black flex flex-col items-center justify-center gap-4 transition-all hover:bg-gray-900 active:scale-[0.98] shadow-[8px_8px_0px_0px_rgba(200,200,200,1)]">
            <div className="bg-white text-black p-4 rounded-full group-hover:scale-110 transition-transform">
              <Plus size={40} strokeWidth={4} />
            </div>
            <span className="text-xl font-black uppercase tracking-widest">Add New Look</span>
          </div>
        </Link>
      </main>

      {/* FOOTER NAV - Quick Access */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-40">
        <div className="bg-black/90 backdrop-blur-lg border-2 border-white/20 rounded-full p-2 flex justify-between items-center px-8 py-4 shadow-2xl">
          <Link href="/" className="text-white/50 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">View Web</Link>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <Link href="/catalogue" className="text-white/50 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Catalogue</Link>
        </div>
      </footer>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="bg-white border-[4px] border-black w-full max-w-[500px] rounded-[40px] relative z-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="p-8 border-b-[4px] border-black flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Project Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-black hover:text-white rounded-full transition-colors">
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 border-2 border-black rounded-2xl">
                <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                  <Database size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400">Database Status</p>
                  <p className="font-bold uppercase text-sm">Supabase Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border-2 border-black rounded-2xl">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400">Environment</p>
                  <p className="font-bold uppercase text-sm">Development Mode</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Settings Saved (Simulasi)")}
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}