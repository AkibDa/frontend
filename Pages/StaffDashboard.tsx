
import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Users, Package, Clock, Edit3, Power, Star, Eye, Zap, Target, Apple, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const StaffDashboard: React.FC = () => {
  const { deals, orders, cafeterias, managedCafeteriaId, toggleCafeteriaStatus } = useApp();
  
  const myCafe = cafeterias.find(c => c.id === managedCafeteriaId) || cafeterias[0];
  const myDeals = deals.filter(d => d.cafeteriaId === myCafe.id && !d.isClaimed);
  const myOrders = orders.filter(o => o.cafeteriaName === myCafe.name);
  const completedCount = myOrders.filter(o => o.status === 'Completed').length;

  return (
    <div className="p-6 pt-2 h-full overflow-y-auto hide-scrollbar pb-32">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Hub Command</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Active Terminal:</span>
            <span className="text-green-600 font-black uppercase tracking-widest text-[10px] bg-green-50 px-3 py-1 rounded-lg border border-green-100">{myCafe.name}</span>
          </div>
        </div>
        <button 
          onClick={() => toggleCafeteriaStatus(myCafe.id)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${myCafe.isOpen ? 'bg-green-600 text-white shadow-green-200' : 'bg-gray-100 text-gray-400 shadow-none'}`}
        >
          <Power size={24} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <StatCard label="Claims Today" value={completedCount.toString()} trend="High" icon={<Users className="text-green-600" size={20} />} color="bg-green-50" />
        <StatCard label="Active Items" value={myDeals.length.toString()} trend="Live" icon={<Package className="text-blue-600" size={20} />} color="bg-blue-50" />
        <StatCard label="Review Score" value={myCafe.rating.toString()} trend="98%" icon={<Star className="text-orange-600" size={20} />} color="bg-orange-50" />
        <StatCard label="Uptime Today" value="100%" trend="Optimal" icon={<Zap className="text-purple-600" size={20} />} color="bg-purple-50" />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Broadcast Control</h2>
        <div className="flex gap-2">
           <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-200 flex items-center gap-1.5">
             <Sparkles size={10} /> Gemini AI Verified
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {myDeals.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 rounded-[3.5rem] border-2 border-dashed border-gray-100">
            <Package className="mx-auto text-gray-200 mb-6" size={64} />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Active Broadcasts</p>
            <p className="text-[10px] text-gray-300 font-bold mt-2">Upload a photo to start saving food</p>
          </div>
        ) : (
          myDeals.map(deal => (
            <motion.div key={deal.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3.5rem] border border-gray-50 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden group">
              <div className="p-6 flex items-start gap-6">
                <div className="relative shrink-0 mt-1">
                    <img src={deal.imageUrl} className="w-28 h-28 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-500" alt="" />
                    <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[14px] border-4 border-white shadow-lg">{deal.quantity}x</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-black text-2xl text-gray-900 leading-none tracking-tighter mb-1">{deal.name}</h4>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{deal.tags.join(' • ')}</span>
                    </div>
                    <div className="bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                       <Clock size={12} className="text-orange-600 animate-pulse" />
                       <span className="text-[10px] font-black text-orange-600 uppercase">{deal.timeLeftMinutes}m</span>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="space-y-3 mb-4 mt-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                       <span>Claim Rate</span>
                       <span className="text-green-600">65% Hot Item</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                       <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '65%' }} 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                       />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          <Eye size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">128 Views</span>
                     </div>
                     <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <TrendingUp size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Growing</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Data Transparency Footer */}
              <div className="bg-gray-50/60 p-6 px-10 flex justify-between items-center border-t border-gray-100">
                 <div className="flex gap-8">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Calories</span>
                       <span className="text-sm font-black text-gray-800 tracking-tighter">{deal.nutritionalInfo?.calories} <span className="text-[9px] text-gray-400">kcal</span></span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Revenue/Item</span>
                       <span className="text-sm font-black text-gray-900 tracking-tighter">₹{deal.discountedPrice}</span>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-all active:scale-90"><Edit3 size={20} /></button>
                    <button className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-red-400 hover:bg-red-50 transition-all active:scale-90"><Trash size={20} /></button>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const Trash = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string; trend: string }> = ({ label, value, icon, color, trend }) => (
  <div className="bg-white p-7 rounded-[3rem] border border-gray-50 shadow-sm relative group hover:shadow-xl transition-all duration-500">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 group-hover:rotate-12`}>{icon}</div>
    <div className="flex items-end justify-between">
        <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{value}</p>
        </div>
        <div className="bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
            <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter">{trend}</span>
        </div>
    </div>
  </div>
);

export default StaffDashboard;
