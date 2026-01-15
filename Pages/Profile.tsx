import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, LogOut, Bell, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const Profile: React.FC = () => {
  const { resetApp } = useApp();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      resetApp();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Profile Header */}
      <div className="bg-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Geom' }} className="text-xl font-bold text-gray-900">
              Alex Rivera
            </h2>
            <p className="text-sm text-gray-500">student@tint.edu.in</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-medium mb-1">Meals Saved</p>
              <p style={{ fontFamily: 'Geom' }} className="text-3xl font-bold text-emerald-700">
                12
              </p>
            </div>
            <div className="text-4xl">🌱</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-6 space-y-3">
        <MenuItem icon={<Settings size={20} />} label="Settings" />
        <MenuItem icon={<Bell size={20} />} label="Notifications" />
        <MenuItem icon={<Shield size={20} />} label="Privacy" />
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 text-red-600"
        >
          <LogOut size={20} />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>

      {/* Version */}
      <div className="text-center py-6">
        <p className="text-xs text-gray-400">GreenPlate v2.0</p>
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
    <div className="text-gray-600">{icon}</div>
    <span className="font-semibold text-gray-900">{label}</span>
  </button>
);

export default Profile;