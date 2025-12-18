
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Clock, MapPin, CheckCircle2, ShoppingBag, Zap, BellRing, ChefHat, UtensilsCrossed } from 'lucide-react';

const MyOrders: React.FC = () => {
  const { orders } = useApp();
  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'Active') return o.status !== 'Completed';
    return o.status === 'Completed';
  });

  return (
    <div className="p-8 h-full flex flex-col bg-transparent">
      <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-10">My Claims</h1>

      <div className="flex gap-8 border-b border-gray-100 mb-10">
        {(['Active', 'Past'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-5 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-green-600' : 'text-gray-300'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="order-tab-line" className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {filteredOrders.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex-1 flex flex-col items-center justify-center text-center p-8"
          >
            <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-8 shadow-inner">
              <ShoppingBag className="text-gray-200" size={56} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No items here</h3>
            <p className="text-gray-400 font-bold text-sm max-w-[200px]">Claim a surplus deal to start saving food!</p>
          </motion.div>
        ) : (
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8 pb-32"
          >
            {filteredOrders.map(order => (
              <div 
                key={order.id} 
                className={`bg-white/90 backdrop-blur-md border rounded-[3rem] p-8 shadow-xl relative overflow-hidden group transition-all duration-500 ${order.status === 'Ready' ? 'border-green-200 ring-4 ring-green-50 shadow-green-100/50' : order.status === 'Claimed' ? 'border-blue-100 shadow-blue-50/30' : 'border-white'}`}
              >
                {(order.status === 'Ready' || order.status === 'Claimed') && (
                  <div className={`absolute top-0 right-0 left-0 h-1.5 animate-pulse ${order.status === 'Ready' ? 'bg-green-500' : 'bg-blue-400'}`} />
                )}

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-none tracking-tighter">{order.foodName}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mt-3">
                      <MapPin size={16} className="text-green-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{order.cafeteriaName}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                    order.status === 'Reserved' ? 'bg-orange-50 text-orange-600' : 
                    order.status === 'Claimed' ? 'bg-blue-600 text-white' :
                    order.status === 'Ready' ? 'bg-green-600 text-white' : 
                    'bg-gray-50 text-gray-400'}`}>
                    {order.status === 'Ready' && <BellRing size={12} className="animate-bounce" />}
                    {order.status === 'Claimed' && <ChefHat size={12} className="animate-pulse" />}
                    {order.status === 'Claimed' ? 'Preparing' : order.status}
                  </div>
                </div>

                {order.status === 'Claimed' && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <UtensilsCrossed size={18} className="text-blue-600" />
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest leading-none">Chef is preparing your portion now!</p>
                  </div>
                )}

                {order.status === 'Ready' && (
                  <div className="mb-6 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                    <Zap size={18} className="text-green-600" />
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest leading-none">Your order is ready for pick up!</p>
                  </div>
                )}

                <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-[2rem] flex items-center gap-6">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                     <QrCode size={48} className="text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Claim Code</p>
                    <p className="text-3xl font-black text-gray-900 tracking-[0.3em]">{order.qrCode}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                   <button className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${order.status === 'Ready' ? 'bg-green-600 text-white shadow-green-100' : 'bg-gray-900 text-white shadow-gray-100'}`}>
                      {order.status === 'Ready' ? 'Get Direct Route' : 'Get Directions'}
                   </button>
                   {order.status === 'Reserved' && (
                     <button className="px-6 border border-gray-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors">Cancel</button>
                   )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
