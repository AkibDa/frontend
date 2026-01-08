
import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Settings, LogOut, Shield, Globe, ChevronRight, Award, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';


const Profile: React.FC = () => {
  const { userRole, resetApp } = useApp();
  const isUser = userRole === UserRole.USER;

  //handlelogout function 
  const handleLogout = async () => {
  try {
    await signOut(auth); // Sign out of Firebase
    resetApp(); // Clear AppContext
    
    window.location.href = '/'; 
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
  return (
    <div className="p-8 pb-32 relative z-10">
      <div className="flex flex-col items-center mb-12">
        <div className="relative mb-8">
          <div className="w-36 h-36 rounded-[3.5rem] border-[10px] border-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden bg-gray-50">
            <img 
              src={isUser ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300" : "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=300"} 
              className="w-full h-full object-cover" 
              alt="Profile" 
            />
          </div>
          <motion.div 
            initial={{ scale: 0, rotate: -45 }} 
            animate={{ scale: 1, rotate: 0 }} 
            className="absolute -bottom-3 -right-3 bg-green-600 text-white p-4 rounded-3xl shadow-2xl border-[6px] border-white"
          >
            <Award size={24} />
          </motion.div>
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter text-center leading-none">
          {isUser ? 'Alex Rivera' : 'Campus Admin'}
        </h2>
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">
          {isUser ? 'Impact Hero' : 'Sustainability Lead'}
        </p>
      </div>

      <div className="mb-14">
        <div className="bg-green-600 rounded-[2.5rem] p-8 text-white shadow-xl flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-100 mb-2 opacity-70">Saved Meals</p>
              <p className="text-5xl font-black tracking-tight">12</p>
            </div>
            <div className="w-24 h-24 bg-green-500/20 rounded-full absolute -right-4 -bottom-4 z-0 group-hover:scale-150 transition-transform duration-700"></div>
            <Leaf size={48} className="text-green-200/30 relative z-10" />
        </div>
      </div>

      <div className="space-y-4">
        <MenuItem icon={<Settings size={22} />} label="Settings" color="text-blue-600" bgColor="bg-blue-50/50" />
        <MenuItem icon={<Shield size={22} />} label="Security" color="text-orange-600" bgColor="bg-orange-50/50" />
        <MenuItem icon={<Globe size={22} />} label="Language" color="text-green-600" bgColor="bg-green-50/50" />
        
        {/* Updated button to call handleLogout */}
        <button 
          onClick={handleLogout} 
          className="w-full mt-10 flex items-center justify-between p-7 bg-red-50/60 text-red-600 rounded-[2.5rem] border border-red-100/30 active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-5">
            <LogOut size={24} />
            <span className="font-black text-xl tracking-tighter">Sign Out</span>
          </div>
          <ChevronRight size={22} />
        </button>
      </div>
      
      <div className="mt-12 text-center text-gray-300">
        <div className="inline-flex items-center gap-2">
          <Leaf size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">GreenPlate v2.1.0</span>
        </div>
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; color: string; bgColor: string }> = ({ icon, label, color, bgColor }) => (
  <button className="w-full flex items-center justify-between p-6 bg-white/60 backdrop-blur-sm border border-white/50 rounded-[2.25rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
    <div className="flex items-center gap-6">
      <div className={`w-14 h-14 ${bgColor} ${color} rounded-[1.25rem] flex items-center justify-center`}>{icon}</div>
      <span className="font-black text-gray-800 text-lg tracking-tight">{label}</span>
    </div>
    <ChevronRight size={22} className="text-gray-300" />
  </button>
);

export default Profile;
