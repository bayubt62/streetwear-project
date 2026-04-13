'use client';
import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Memanggil koneksi Supabase kita

export default function AddLookPage() {
  const [items, setItems] = useState([{ id: 1, name: '', url: '' }]);
  const [themeTitle, setThemeTitle] = useState('');
  
  // State untuk foto
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addItem = () => setItems([...items, { id: Date.now(), name: '', url: '' }]);
  const removeItem = (idToRemove: number) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== idToRemove));
  };

  // FUNGSI SUPER: Mengunggah ke Supabase & Menyimpan Data
  const handlePublish = async () => {
    if (!themeTitle || !imageFile) {
      alert("Please fill the Theme Title and upload an image!");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload Gambar ke Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `hero-images/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('lookbooks')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Dapatkan URL gambar yang sudah online
      const { data: publicUrlData } = supabase.storage
        .from('lookbooks')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 2. Simpan Data Tema ke Database
      const { data: lookbookData, error: dbError } = await supabase
        .from('lookbooks')
        .insert([{ theme_title: themeTitle, image_url: imageUrl }])
        .select()
        .single();

      if (dbError) throw dbError;

      // 3. Simpan Data Item Pakaian (Jika ada namanya)
      const validItems = items.filter(i => i.name.trim() !== '');
      if (validItems.length > 0) {
        const itemsToInsert = validItems.map(item => ({
          lookbook_id: lookbookData.id,
          product_name: item.name,
          affiliate_url: item.url
        }));

        const { error: itemError } = await supabase
          .from('lookbook_items')
          .insert(itemsToInsert);

        if (itemError) throw itemError;
      }

      alert("🎉 Lookbook successfully published!");
      // Reset form
      setThemeTitle('');
      setImageFile(null);
      setImagePreview(null);
      setItems([{ id: Date.now(), name: '', url: '' }]);

    } catch (error: any) {
      console.error(error);
      alert("Error publishing: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-black">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/studio" className="p-3 bg-white border-4 border-black rounded-full hover:bg-black hover:text-white transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
          <ArrowLeft size={24} strokeWidth={3} />
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter">Create New Look</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Kolom Kiri */}
        <div className="space-y-8">
          <div>
            <label className="block text-xl font-bold uppercase mb-3">Theme Title</label>
            <input 
              type="text" 
              value={themeTitle}
              onChange={(e) => setThemeTitle(e.target.value)}
              placeholder="e.g. EPS 19: Urban Utility" 
              className="w-full bg-white border-4 border-black rounded-2xl p-4 text-lg font-bold outline-none focus:ring-4 focus:ring-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div>
            <label className="block text-xl font-bold uppercase mb-3">Hero Image</label>
            <label htmlFor="imageUpload" className="w-full h-[500px] bg-white border-4 border-dashed border-black rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="bg-black text-white p-5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={36} />
                  </div>
                  <span className="font-extrabold text-black uppercase text-lg">Upload Look</span>
                </>
              )}
            </label>
            <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="bg-gray-50 border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-4 border-black">
            <h2 className="text-2xl font-extrabold uppercase">Outfit Items</h2>
            <button type="button" onClick={addItem} className="bg-black text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800">
              <Plus size={18} /> Add Item
            </button>
          </div>

          <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 flex-grow">
            {items.map((item, index) => (
              <div key={item.id} className="bg-white border-4 border-black rounded-2xl p-4 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <button type="button" onClick={() => removeItem(item.id)} className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full border-4 border-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
                <div className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    placeholder="Item Name (e.g. Graphic Tee)" 
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].name = e.target.value;
                      setItems(newItems);
                    }}
                    className="w-full bg-transparent border-b-4 border-black pb-2 text-lg font-bold outline-none"
                  />
                  <input 
                    type="url" 
                    placeholder="Shopee/Tokopedia Link" 
                    value={item.url}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].url = e.target.value;
                      setItems(newItems);
                    }}
                    className="w-full bg-transparent border-b-4 border-gray-300 focus:border-black pb-2 text-lg font-bold outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handlePublish}
            disabled={isUploading}
            className={`w-full mt-8 py-5 rounded-3xl border-4 border-black font-extrabold text-xl uppercase tracking-widest flex justify-center items-center gap-3 transition-all ${isUploading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-black text-white hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'}`}
          >
            {isUploading ? 'Uploading...' : <><Save size={24} /> Publish Lookbook</>}
          </button>
        </div>
      </div>
    </div>
  );
}