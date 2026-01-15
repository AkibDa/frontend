import React, { useState } from 'react';
import { Home, Receipt, User as UserIcon, Store } from 'lucide-react';
import UserHome from '../Pages/UserHome';
import MapView from '../Pages/MapView';
import MyOrders from '../Pages/MyOrder';
import Profile from '../Pages/Profile';
import { motion } from 'framer-motion';

const UserLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'orders' | 'profile'>('home');

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Clean Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GP</span>
          </div>
          <span style={{ fontFamily: 'Geom' }} className="font-bold text-lg text-gray-900">
            GreenPlate
          </span>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activeTab === 'home' && <UserHome />}
          {activeTab === 'map' && <MapView />}
          {activeTab === 'orders' && <MyOrders />}
          {activeTab === 'profile' && <Profile />}
        </motion.div>
      </div>

      {/* Modern Bottom Navigation */}
      <nav className="border-t border-gray-100 bg-white px-6 py-2 safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <NavButton
            icon={<Home size={22} strokeWidth={2.5} />}
            label="Home"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavButton
            icon={<Store size={22} strokeWidth={2.5} />}
            label="Map"
            active={activeTab === 'map'}
            onClick={() => setActiveTab('map')}
          />
          <NavButton
            icon={<Receipt size={22} strokeWidth={2.5} />}
            label="Orders"
            active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
          />
          <NavButton
            icon={<UserIcon size={22} strokeWidth={2.5} />}
            label="Profile"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 py-2 px-4 relative"
  >
    <div className={`transition-colors ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span
      style={{ fontFamily: 'Mona Sans' }}
      className={`text-[10px] font-medium transition-colors ${
        active ? 'text-emerald-600' : 'text-gray-400'
      }`}
    >
      {label}
    </span>
    {active && (
      <motion.div
        layoutId="nav-indicator"
        className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"
      />
    )}
  </button>
);

export default UserLayout;