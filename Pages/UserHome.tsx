
import React, { useState } from 'react';
import { Search, Flame, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodDeal } from '../types';
import { motion } from 'framer-motion';

const UserHome: React.FC<{ onSelectDeal: (deal: FoodDeal) => void }> = ({ onSelectDeal }) => {
  const { deals, cafeterias } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-8 pt-4 shrink-0">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Market</h1>
            <p className="text-green-600 font-black uppercase tracking-[0.4em] text-[10px] mt-2">Active Surplus</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
             <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Live</span>
          </div>
        </header>

        <div className="relative mb-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surplus..." 
            className="w-full bg-white border border-gray-100 py-6 pl-16 pr-8 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-green-500/5 text-gray-900 placeholder:text-gray-300 transition-all font-bold text-base shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-40 hide-scrollbar">
        {cafeterias.map((cafe) => {
          const cafeDeals = deals.filter(d => d.cafeteriaId === cafe.id && !d.isClaimed);
          if (cafeDeals.length === 0) return null;

          return (
            <section key={cafe.id} className="mb-14">
              <div className="px-8 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={cafe.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-1">{cafe.name}</h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cafe.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-8 overflow-x-auto px-8 hide-scrollbar">
                {cafeDeals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    onClick={() => onSelectDeal(deal)}
                    whileTap={{ scale: 0.96 }}
                    className="min-w-[300px] max-w-[300px] bg-white rounded-[3rem] overflow-hidden border border-gray-100 relative flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.04)]"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img src={deal.imageUrl} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
                      
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white flex items-center gap-2 shadow-sm">
                        <Flame size={14} className="text-orange-500" />
                        <span className="text-[11px] font-black text-gray-900">{deal.nutritionalInfo?.calories} kcal</span>
                      </div>
                      
                      <div className="absolute bottom-6 right-6 bg-green-600 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">
                         -{Math.round((1 - deal.discountedPrice / deal.originalPrice) * 100)}%
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <h4 className="font-black text-2xl text-gray-900 tracking-tighter leading-tight mb-6">
                        {deal.name}
                      </h4>

                      <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-[2rem] border border-gray-100">
                         <div className="flex-1 text-center border-r border-gray-200">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">PRO</p>
                            <p className="text-sm font-black text-gray-900">{deal.nutritionalInfo?.protein}</p>
                         </div>
                         <div className="flex-1 text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">CRB</p>
                            <p className="text-sm font-black text-gray-900">{deal.nutritionalInfo?.carbs}</p>
                         </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-300 line-through">₹{deal.originalPrice}</span>
                          <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{deal.discountedPrice}</span>
                        </div>
                        <div className="w-14 h-14 bg-gray-900 text-white rounded-[1.75rem] flex items-center justify-center shadow-xl active:scale-90 transition-transform">
                          <Plus size={24} strokeWidth={4} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="min-w-[1px]" />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default UserHome;
