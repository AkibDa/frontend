import React, { useState } from 'react';
import { LayoutDashboard, User, Plus, Leaf, ChefHat, PackageCheck } from 'lucide-react';
import StaffDashboard from '../Pages/StaffDashboard';
import QueueManager from '../Pages/QueueManager';
import IncomingReservations from '../Pages/IncomingReservations';
import Profile from '../Pages/Profile';
import CreatePost from '../Pages/CreatePost';
import { motion, AnimatePresence } from 'framer-motion';

const StaffLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queue' | 'pickup' | 'profile'>('dashboard');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <StaffDashboard />;
      case 'queue': return <QueueManager />;
      case 'pickup': return <IncomingReservations />;
      case 'profile': return <Profile />;
      default: return <StaffDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Persistent Staff Header */}
      <header className="px-6 py-5 flex items-center justify-between z-40 bg-white/60 backdrop-blur-xl sticky top-0 border-b border-white/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-[1rem] flex items-center justify-center shadow-[0_10px_20px_rgba(76,175,80,0.35)]">
            <Leaf size={22} className="text-white fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl leading-none tracking-tighter text-gray-900">GreenPlate</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none mt-1">Staff Terminal</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCreatePost && (
          <CreatePost onClose={() => setShowCreatePost(false)} />
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-32 right-8 w-16 h-16 bg-green-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-green-200 hover:bg-green-700 transition-all hover:scale-110 active:scale-90 z-40"
      >
        <Plus size={36} />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/70 backdrop-blur-2xl border-t border-white/50 px-6 py-5 flex justify-between items-center z-50 rounded-t-[3rem] shadow-[0_-15px_50px_rgba(0,0,0,0.06)]">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={22} />} 
          label="Stats" 
        />
        <NavButton 
          active={activeTab === 'queue'} 
          onClick={() => setActiveTab('queue')} 
          icon={<ChefHat size={22} />} 
          label="Kitchen" 
        />
        <NavButton 
          active={activeTab === 'pickup'} 
          onClick={() => setActiveTab('pickup')} 
          icon={<PackageCheck size={22} />} 
          label="Pickup" 
        />
        <NavButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          icon={<User size={22} />} 
          label="Profile" 
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all duration-500 ${active ? 'text-green-600 scale-105' : 'text-gray-300 hover:text-gray-500'}`}
  >
    <div className={`p-2.5 rounded-2xl transition-all duration-500 ${active ? 'bg-green-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]' : ''}`}>
      {icon}
    </div>
    <span className={`text-[8px] font-black tracking-widest uppercase transition-all duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {label}
    </span>
  </button>
);

export default StaffLayout;
