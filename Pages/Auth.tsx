import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Globe } from 'lucide-react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';

const Auth: React.FC = () => {
  const { setUserRole } = useApp();
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  return (
    <div className="h-full flex flex-col p-8 bg-white">
      <div className="mt-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500">Sign in to continue your impact.</p>
      </div>

      <div className="bg-gray-100 p-1 rounded-2xl flex mb-10">
        <button 
          onClick={() => setRole(UserRole.USER)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${role === UserRole.USER ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}
        >
          User
        </button>
        <button 
          onClick={() => setRole(UserRole.STAFF)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${role === UserRole.STAFF ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}
        >
          Cafeteria Staff
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>
      </div>

      <button 
        onClick={() => setUserRole(role)}
        className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:bg-green-700 transition-colors mb-6"
      >
        <LogIn size={20} />
        Sign In
      </button>

      <div className="flex items-center gap-4 mb-8 text-gray-400 text-xs font-medium">
        <div className="flex-1 h-px bg-gray-100"></div>
        OR CONTINUE WITH
        <div className="flex-1 h-px bg-gray-100"></div>
      </div>

      <button 
        onClick={() => setUserRole(role)}
        className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
        Google Sign-in
      </button>

      <p className="mt-auto text-center text-gray-500 text-sm">
        Don't have an account? <span className="text-green-600 font-bold cursor-pointer">Sign up</span>
      </p>
    </div>
  );
};

export default Auth;
