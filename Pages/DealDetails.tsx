
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, ShieldCheck, Navigation, Target, Zap, Leaf } from 'lucide-react';
import { FoodDeal } from '../types';
import { useApp } from '../context/AppContext';

const NutriNode: React.FC<{ label: string; val: string | number }> = ({ label, val }) => (
  <div className="flex flex-col items-center">
    <p className="text-xl font-black text-gray-900 leading-none mb-2">{val}</p>
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
  </div>
);

const DealDetails: React.FC<{ deal: FoodDeal; onClose: () => void }> = ({ deal, onClose }) => {
  const { claimDeal } = useApp();

  const handleClaim = () => {
    claimDeal(deal.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col max-w-md mx-auto overflow-hidden"
    >
      <div className="relative h-[45%] shrink-0">
        <img 
          src={deal.imageUrl} 
          className="w-full h-full object-cover" 
          alt={deal.name}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        
        <div className="absolute top-10 left-8 right-8 flex justify-between z-10">
          <button 
            onClick={onClose} 
            className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl active:scale-90 transition-transform"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="px-6 py-3 bg-green-600 rounded-2xl text-white flex items-center gap-2 shadow-2xl shadow-green-900/20">
            <Target size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Verified</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-10">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-2">{deal.name}</h2>
            <p className="text-green-600 font-black uppercase tracking-[0.5em] text-[10px]">Eco-Certified Nutrition</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-40 hide-scrollbar space-y-8 pt-8">
        <div className="grid grid-cols-2 gap-6">
           <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Rescued Price</p>
              <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{deal.discountedPrice}</p>
           </div>
           <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
              <Clock size={20} className="text-orange-500 mb-2 animate-pulse" />
              <p className="text-base font-black text-gray-900 tracking-tight">{deal.timeLeftMinutes}M LEFT</p>
           </div>
        </div>

        {deal.nutritionalInfo && (
          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 text-center">Macro Profile</h4>
             <div className="grid grid-cols-4 gap-4">
                <NutriNode label="CAL" val={deal.nutritionalInfo.calories} />
                <NutriNode label="PRO" val={deal.nutritionalInfo.protein} />
                <NutriNode label="FAT" val={deal.nutritionalInfo.fat} />
                <NutriNode label="CRB" val={deal.nutritionalInfo.carbs} />
             </div>
          </div>
        )}

        <div className="bg-green-50 p-8 rounded-[3rem] border border-green-100 flex items-center justify-between group">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-green-600 rounded-[1.75rem] flex items-center justify-center text-white shadow-xl shadow-green-200">
                 <Leaf size={28} />
              </div>
              <div>
                 <p className="text-xl font-black text-gray-900 tracking-tight">Eco Impact</p>
                 <p className="text-[11px] font-black text-green-600 uppercase tracking-widest">{deal.carbonSavedKg}kg CO2 Offset</p>
              </div>
           </div>
           <ShieldCheck size={24} className="text-green-600/30" />
        </div>

        <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pick up at</span>
              <p className="text-lg font-black text-gray-900 tracking-tighter leading-none">{deal.cafeteriaName}</p>
           </div>
           <Navigation size={22} className="text-gray-300" />
        </div>
      </div>

      <div className="p-10 border-t border-gray-50 bg-white/80 backdrop-blur-xl">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleClaim}
          disabled={deal.isClaimed}
          className={`w-full py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all ${deal.isClaimed ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white shadow-2xl shadow-gray-200'}`}
        >
          {deal.isClaimed ? "Reserved" : "Claim Now"}
          {!deal.isClaimed && <Zap size={22} className="fill-current text-yellow-400" />}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DealDetails;
