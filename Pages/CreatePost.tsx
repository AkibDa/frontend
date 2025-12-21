
import React, { useState, useRef } from 'react';
import { X, Camera, Sparkles, Loader2, Apple, Zap, Droplets, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeFoodImage } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const CreatePost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addDeal, managedCafeteriaId, cafeterias } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const myCafe = cafeterias.find(c => c.id === managedCafeteriaId) || cafeterias[0];

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [origPrice, setOrigPrice] = useState(100);
  const [discPrice] = useState(40);
  const [tags, setTags] = useState<string[]>(['Veg']);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [nutritionalInfo, setNutritionalInfo] = useState<any>(null);
  const [carbonSaved, setCarbonSaved] = useState(0.5);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
        setIsAnalyzing(true);
        const result = await analyzeFoodImage(base64);
        setIsAnalyzing(false);
        if (result) {
          setName(result.name || '');
          setDescription(result.description || '');
          setQuantity(result.quantity || 1);
          setTags(result.tags || ['Veg']);
          setIngredients(result.ingredients || []);
          setNutritionalInfo(result.nutritionalInfo || null);
          setCarbonSaved(result.carbonSavedKg || 0.5);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!name || !previewUrl) return;
    
    addDeal({
      cafeteriaId: myCafe.id,
      name,
      description,
      ingredients,
      nutritionalInfo,
      carbonSavedKg: carbonSaved,
      quantity,
      originalPrice: origPrice,
      discountedPrice: discPrice,
      timeLeftMinutes: 120,
      cafeteriaName: myCafe.name,
      distance: '0.0 km',
      imageUrl: previewUrl,
      tags
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-white flex flex-col max-w-md mx-auto overflow-hidden"
    >
      <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
           <X size={24} />
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Post Surplus</h2>
            <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">{myCafe.name} Hub</span>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 hide-scrollbar pb-32">
        <div 
          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
        >
          {previewUrl ? (
            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Camera className="text-green-600" size={32} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Take a photo of the surplus</p>
              <p className="text-[9px] font-bold text-gray-300">Gemini will auto-fill nutritional data</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-green-600/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center">
                <Loader2 className="animate-spin mb-4" size={48} />
                <h3 className="text-xl font-black tracking-tight">Vision AI Scanner</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-green-100 mt-2">Analyzing ingredients & nutrients...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Form Area */}
        <div className="space-y-8 animate-in fade-in duration-700">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Menu Title</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Seasonal Garden Bowl" className="w-full bg-gray-50 border border-gray-100 py-5 px-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 font-black text-gray-900 tracking-tight" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Original Price</p>
                <input type="number" value={origPrice} onChange={(e) => setOrigPrice(Number(e.target.value))} className="w-full bg-transparent font-black text-xl text-gray-900 focus:outline-none" />
             </div>
             <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Portions</p>
                <div className="flex items-center justify-between">
                   <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-8 h-8 bg-white rounded-lg shadow-sm text-gray-400 font-black">-</button>
                   <span className="text-xl font-black text-gray-900 tracking-tighter">{quantity}</span>
                   <button onClick={() => setQuantity(quantity+1)} className="w-8 h-8 bg-green-600 rounded-lg shadow-md text-white font-black">+</button>
                </div>
             </div>
          </div>

          {nutritionalInfo && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-blue-50/30 rounded-[2.5rem] border border-blue-100/50">
               <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">AI Generated Macro Profile</span>
               </div>
               <div className="grid grid-cols-4 gap-4">
                  <NutriSmall label="CAL" val={nutritionalInfo.calories} icon={<Zap size={10} />} />
                  <NutriSmall label="PRO" val={nutritionalInfo.protein} icon={<Apple size={10} />} />
                  <NutriSmall label="FAT" val={nutritionalInfo.fat} icon={<Droplets size={10} />} />
                  <NutriSmall label="CRB" val={nutritionalInfo.carbs} icon={<Target size={10} />} />
               </div>
            </motion.div>
          )}

          <div>
             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Detected Ingredients</label>
             <div className="flex flex-wrap gap-2">
                {ingredients.map(ing => (
                  <span key={ing} className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-600 border border-gray-100">{ing}</span>
                ))}
                {ingredients.length === 0 && <p className="text-[10px] text-gray-300 font-bold ml-1">Awaiting AI scan...</p>}
             </div>
          </div>
        </div>
      </div>

      <div className="p-8 border-t border-gray-100 bg-white/80 backdrop-blur-md">
        <button 
          onClick={handlePost}
          disabled={!name || !previewUrl || isAnalyzing}
          className="w-full bg-green-600 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.25em] shadow-xl shadow-green-100 active:scale-95 transition-all disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none"
        >
          {isAnalyzing ? 'Extracting Data...' : 'Confirm Surplus Broadcast'}
        </button>
      </div>
    </motion.div>
  );
};

const NutriSmall: React.FC<{ label: string; val: string | number; icon: React.ReactNode }> = ({ label, val, icon }) => (
  <div className="text-center">
     <div className="flex justify-center text-blue-400 mb-1">{icon}</div>
     <p className="text-[11px] font-black text-gray-900 leading-none tracking-tighter">{val}</p>
     <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{label}</p>
  </div>
);

export default CreatePost;
