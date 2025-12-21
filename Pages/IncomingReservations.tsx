
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, User, Clock, Package, Zap, CheckCircle2, Utensils, ShoppingBag, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IncomingReservations: React.FC = () => {
  const { orders, markAsReady, markAsPickedUp } = useApp();
  const [activeView, setActiveView] = useState<'pending' | 'ready'>('pending');

  // Filter orders based on their kitchen/counter state
  const pendingOrders = orders.filter(o => o.status === 'Claimed');
  const readyOrders = orders.filter(o => o.status === 'Ready');

  return (
    <div className="p-6 h-full flex flex-col bg-transparent">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Pickup Hub</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">Operational Control Center</p>
      </header>

      {/* Workflow Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-[2rem] mb-8 relative">
        <button 
          /* Fixed: replaced setActiveTab with setActiveView */
          onClick={() => setActiveView('pending')}
          className={`flex-1 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest z-10 transition-all flex items-center justify-center gap-2 ${activeView === 'pending' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400'}`}
        >
          <Timer size={14} />
          In Preparation ({pendingOrders.length})
        </button>
        <button 
          /* Fixed: replaced setActiveTab with setActiveView */
          onClick={() => setActiveView('ready')}
          className={`flex-1 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest z-10 transition-all flex items-center justify-center gap-2 ${activeView === 'ready' ? 'bg-white shadow-md text-green-600' : 'text-gray-400'}`}
        >
          <Package size={14} />
          Ready ({readyOrders.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        <AnimatePresence mode="wait">
          {activeView === 'pending' ? (
            <motion.div 
              key="pending-prep-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {pendingOrders.length === 0 ? (
                <EmptyState 
                  icon={<Utensils className="text-gray-200" size={56} />} 
                  title="Kitchen is Clear" 
                  desc="Accept new reservations to begin preparing items." 
                />
              ) : (
                pendingOrders.map(order => (
                  <OperationCard 
                    key={order.id} 
                    order={order} 
                    actionLabel="Mark as Prepared" 
                    onAction={() => markAsReady(order.id)}
                    icon={<Zap size={18} className="text-blue-500" />}
                    statusColor="bg-blue-50"
                    btnColor="bg-blue-600 shadow-blue-100"
                  />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="collection-ready-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {readyOrders.length === 0 ? (
                <EmptyState 
                  icon={<ShoppingBag className="text-gray-200" size={56} />} 
                  title="Shelf is Empty" 
                  desc="Completed items will appear here for student collection." 
                />
              ) : (
                readyOrders.map(order => (
                  <OperationCard 
                    key={order.id} 
                    order={order} 
                    actionLabel="Confirm Handover" 
                    onAction={() => markAsPickedUp(order.id)}
                    icon={<CheckCircle2 size={18} className="text-green-600" />}
                    statusColor="bg-green-50"
                    btnColor="bg-green-600 shadow-green-100"
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

const OperationCard: React.FC<{ 
  order: any; 
  actionLabel: string; 
  onAction: () => void; 
  icon: React.ReactNode;
  statusColor: string;
  btnColor: string;
}> = ({ order, actionLabel, onAction, icon, statusColor, btnColor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-7 rounded-[3rem] border border-gray-50 shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
         <div className="w-14 h-14 bg-gray-900 rounded-[1.75rem] flex items-center justify-center text-white shadow-xl">
           <User size={26} />
         </div>
         <div>
           <h3 className="font-black text-xl text-gray-900 tracking-tight leading-none mb-1.5">User #ID-{order.qrCode.split('-')[1]}</h3>
           <div className="flex items-center gap-2">
              <Clock size={12} className="text-gray-300" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Logged: {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
           </div>
         </div>
      </div>
      <div className="text-right">
         <span className="block text-2xl font-black text-gray-900 tracking-tighter">{order.qrCode}</span>
         <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Verification Key</span>
      </div>
    </div>

    <div className={`${statusColor} p-5 rounded-[2.25rem] flex items-center gap-4 mb-6 border border-white/80`}>
       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
         {icon}
       </div>
       <div className="flex-1">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Kitchen Request</p>
          <p className="text-base font-black text-gray-900 tracking-tight leading-none">{order.foodName}</p>
       </div>
    </div>

    <button 
      onClick={onAction}
      className={`w-full ${btnColor} text-white py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg`}
    >
       <Check size={18} />
       {actionLabel}
    </button>
  </motion.div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="text-center py-24 bg-gray-50/50 rounded-[3.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
     <div className="mb-6 opacity-40">{icon}</div>
     <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">{title}</h3>
     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest max-w-[200px] leading-relaxed">{desc}</p>
  </div>
);

export default IncomingReservations;
