import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, LogOut, Bell, Shield, Store, UserCircle, Briefcase } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const Profile: React.FC = () => {
  const { resetApp, staffProfile, userRole } = useApp();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      resetApp();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // --- STAFF VIEW ---
  if (staffProfile || userRole === 'staff') {
    return (
      <div className="h-full bg-gray-50 overflow-y-auto">
        {/* Staff Header */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200">
              <Briefcase size={28} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Geom' }} className="text-xl font-bold text-gray-900">
                {user?.email?.split('@')[0] || "Staff Member"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                  {staffProfile?.role || "Staff"}
                </span>
                {/* CHANGED: Showing Stall Name here */}
                <span className="text-xs text-gray-400">
                  {staffProfile?.stallName || "GreenPlate Stall"}
                </span>
              </div>
            </div>
          </div>

          {/* Staff Stats */}
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                {/* CHANGED: Label and Value to Stall Name */}
                <p className="text-xs text-gray-400 font-bold uppercase">Stall Name</p>
                <p className="font-mono text-sm font-semibold text-gray-700 truncate">
                  {staffProfile?.stallName || "----"}
                </p>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase">Status</p>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> Active
                </p>
             </div>
          </div>
        </div>

        {/* Staff Menu Actions */}
        <div className="p-6 space-y-3">
          <MenuItem icon={<Store size={20} />} label="Stall Configuration" />
          <MenuItem icon={<Settings size={20} />} label="App Settings" />
          <MenuItem icon={<Shield size={20} />} label="Security & Access" />
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors mt-6"
          >
            <LogOut size={20} />
            <span className="font-semibold">Log Out</span>
          </button>
        </div>
        
        <div className="text-center py-6">
          <p className="text-xs text-gray-300 font-mono">Staff Terminal v2.1</p>
        </div>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Student Header */}
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full overflow-hidden shadow-emerald-200 shadow-lg p-0.5">
             <div className="w-full h-full bg-white rounded-full overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'User'}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Geom' }} className="text-xl font-bold text-gray-900">
              {user?.displayName || user?.email?.split('@')[0] || "Student"}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Student Stats */}
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-100 rounded-full opacity-50" />
          
          <div className="relative z-10">
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">Impact Created</p>
            <div className="flex items-baseline gap-1">
              <p style={{ fontFamily: 'Geom' }} className="text-3xl font-bold text-emerald-800">
                0
              </p>
              <span className="text-sm text-emerald-600 font-medium">Meals Saved</span>
            </div>
          </div>
          <div className="text-3xl relative z-10">🌱</div>
        </div>
      </div>

      {/* Student Menu Items */}
      <div className="p-6 space-y-3">
        <MenuItem icon={<UserCircle size={20} />} label="Account Details" />
        <MenuItem icon={<Settings size={20} />} label="Preferences" />
        <MenuItem icon={<Bell size={20} />} label="Notifications" />
        <MenuItem icon={<Shield size={20} />} label="Privacy Policy" />
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 text-red-600 hover:bg-red-50 transition-colors mt-4"
        >
          <LogOut size={20} />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>

      <div className="text-center py-6">
        <p className="text-xs text-gray-400">GreenPlate Student v2.0</p>
      </div>
    </div>
  );
};

// Reusable Menu Item Component
const MenuItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all active:scale-[0.98]">
    <div className="text-gray-500">{icon}</div>
    <span className="font-semibold text-gray-700 text-sm">{label}</span>
  </button>
);

export default Profile;