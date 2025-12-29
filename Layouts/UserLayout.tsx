import React, { useState } from 'react';
import { Home, Map as MapIcon, ShoppingBag, User as UserIcon, Leaf } from 'lucide-react';
import UserHome from '../Pages/UserHome';
import MapView from '../Pages/MapView';
import MyOrders from '../Pages/MyOrder';
import Profile from '../Pages/Profile';
import DealDetails from '../Pages/DealDetails';
import { FoodDeal } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const UserLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'orders' | 'profile'>('home');
  const [selectedDeal, setSelectedDeal] = useState<FoodDeal | null>(null);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="px-8 py-6 flex items-center justify-between z-[40] bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(22,163,74,0.2)]">
            <Leaf size={24} className="text-white fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter text-gray-900 leading-none">GreenPlate</span>
            <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mt-1">Market Core</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl border border-gray-100 overflow-hidden shadow-sm active:scale-95 transition-transform cursor-pointer">
           <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="Profile" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {activeTab === 'home' && <UserHome onSelectDeal={setSelectedDeal} />}
            {activeTab === 'map' && <MapView />}
            {activeTab === 'orders' && <MyOrders />}
            {activeTab === 'profile' && <Profile />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedDeal && (
          <DealDetails deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 left-0 right-0 max-w-md mx-auto px-8 z-[50]">
        <nav className="bg-white/95 backdrop-blur-3xl border border-gray-100 px-8 py-6 flex justify-between items-center rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.1)]">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={24} />} />
          <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapIcon size={24} />} />
          <NavButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={24} />} />
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon size={24} />} />
        </nav>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className="relative flex flex-col items-center group"
  >
    <div className={`p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-green-600 text-white shadow-xl shadow-green-100 scale-110' : 'text-gray-300 hover:text-gray-900'}`}>
      {icon}
    </div>
    {active && (
      <motion.div layoutId="nav-dot" className="absolute -bottom-2 w-1.5 h-1.5 bg-green-500 rounded-full" />
    )}
  </button>
);

export default UserLayout;
