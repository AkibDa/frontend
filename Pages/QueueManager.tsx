
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, User, ChevronRight, PlayCircle, CheckCircle2, History, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QueueManager: React.FC = () => {
  const { orders, acceptOrder, markAsPickedUp } = useApp();
  const [activeView, setActiveView] = useState<'reserve' | 'claim'>('reserve');
  
  // Filter orders
  // Reserve: New incoming orders (Status: Reserved)
  const reservedOrders = orders.filter(o => o.status === 'Reserved');
  
  // Claim: Orders ready for pickup or already claimed (Status: Ready or Completed)
  const claimViewOrders = orders.filter(o => o.status === 'Ready' || o.status === 'Completed');

  return (
    <div className="p-6 h-full flex flex-col bg-transparent">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Kitchen Queue</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">Operational Flow Management</p>
      </header>

      {/* Navigation Switcher */}
      <div className="flex bg-gray-50 p-1.5 rounded-[2.25rem] mb-8 border border-gray-100 relative">
        <button 
          onClick={() => setActiveView('reserve')}
          className={`flex-1 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest z-10 transition-all flex items-center justify-center gap-2 ${activeView === 'reserve' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`}
        >
          <Bell size={14} />
          Reserve ({reservedOrders.length})
        </button>
        <button 
          onClick={() => setActiveView('claim')}
          className={`flex-1 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest z-10 transition-all flex items-center justify-center gap-2 ${activeView === 'claim' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
        >
          <History size={14} />
          Claim ({claimViewOrders.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        <AnimatePresence mode="wait">
          {activeView === 'reserve' ? (
            <motion.div 
              key="reserve-orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {reservedOrders.length === 0 ? (
                <EmptyState 
                  icon={<Bell className="text-gray-200" size={56} />} 
                  title="No Reservations" 
                  desc="New student requests will appear here for you to accept." 
                />
              ) : (
                reservedOrders.map(order => (
                  <ReservationCard 
                    key={order.id} 
                    order={order} 
                    onAccept={() => acceptOrder(order.id)} 
                  />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="claim-orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {claimViewOrders.length === 0 ? (
                <EmptyState 
                  icon={<ShoppingBag className="text-gray-200" size={56} />} 
                  title="Queue Empty" 
                  desc="Orders ready for pickup or recently claimed will show here." 
                />
              ) : (
                claimViewOrders.map(order => (
                  <ClaimCard 
                    key={order.id} 
                    order={order} 
                    onManualClaim={() => markAsPickedUp(order.id)} 
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ReservationCard: React.FC<{ order: any; onAccept: () => void }> = ({ order, onAccept }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-7 rounded-[3rem] border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] relative group"
  >
    <div className="flex justify-between items-center mb-6">
       <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-50 rounded-[1.75rem] flex items-center justify-center text-gray-900 border border-gray-100">
             <User size={26} />
          </div>
          <div>
             <h4 className="font-black text-xl text-gray-900 leading-none tracking-tight">ID: {order.qrCode}</h4>
             <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                Awaiting Prep
             </p>
          </div>
       </div>
       <div className="text-right">
          <span className="text-base font-black text-gray-900 tracking-tight">{Math.floor((Date.now() - order.timestamp) / 60000)}m</span>
       </div>
    </div>

    <div className="bg-gray-50 p-5 rounded-[2.25rem] border border-gray-100 flex items-center gap-4 mb-6">
       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <PlayCircle size={22} className="text-green-600" />
       </div>
       <div className="flex-1">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Items</p>
          <p className="text-base font-black text-gray-900 leading-none">{order.foodName}</p>
       </div>
    </div>

    <button 
      onClick={onAccept}
      className="w-full bg-gray-900 text-white py-6 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-3"
    >
       Accept Order
       <ChevronRight size={18} />
    </button>
  </motion.div>
);

const ClaimCard: React.FC<{ order: any; onManualClaim: () => void }> = ({ order, onManualClaim }) => {
  const isReady = order.status === 'Ready';

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white p-7 rounded-[3rem] border border-gray-100 flex flex-col shadow-sm transition-all ${!isReady ? 'opacity-50' : 'ring-2 ring-green-500/10 shadow-lg'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-[1.75rem] flex items-center justify-center ${isReady ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
            {isReady ? <ShoppingBag size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div>
            <h4 className="font-black text-xl text-gray-900 tracking-tight leading-none mb-2">{order.foodName}</h4>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Student ID: {order.qrCode}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${isReady ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-green-100 text-green-600 border border-green-200'}`}>
            {isReady ? 'On Counter' : 'Claimed'}
          </span>
        </div>
      </div>

      {isReady && (
        <button 
          onClick={onManualClaim}
          className="w-full bg-green-600 text-white py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-green-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Check size={18} />
          Manual Claim
        </button>
      )}
    </motion.div>
  );
};

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="text-center py-24 bg-gray-50/50 rounded-[3.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
     <div className="mb-6 opacity-40">{icon}</div>
     <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">{title}</h3>
     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest max-w-[220px] leading-relaxed">{desc}</p>
  </div>
);

export default QueueManager;
