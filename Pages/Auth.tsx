import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import api from '@/services/api';
import { auth } from '@/firebaseConfig';

const Auth: React.FC = () => {
  const { setUserRole, setOnboarded, setVerified } = useApp();

  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (role === UserRole.USER && !email.endsWith('.edu.in')) {
      setError("Only institutional emails (.edu.in) are permitted.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      if (role === UserRole.USER) {
        await api.post('/auth/verify-student');
        setUserRole(UserRole.USER);
      } else {
        await api.post('/auth/verify-staff');
        setUserRole(UserRole.STAFF);
      }

      setVerified(true);
      setOnboarded(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') setError('Account not found.');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password.');
      else setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9F9F9] font-sans text-[#1d1d1f]">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
        
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="text-green-600" size={32} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
            {isSignUp ? 'Create your account' : 'Sign in to GreenPlate'}
          </h2>
          <p className="text-sm text-gray-500">
            {isSignUp ? 'Enter your details to get started' : 'Welcome back, please enter your details'}
          </p>
        </div>

        {/* Role Switcher (Apple Style) */}
        <div className="bg-gray-100/80 p-1 rounded-xl flex mb-8">
          <button
            onClick={() => setRole(UserRole.USER)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              role === UserRole.USER ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole(UserRole.STAFF)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              role === UserRole.STAFF ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Staff
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium text-center animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-10">
          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-gray-50/50 border border-gray-200 py-4 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all text-sm"
            />
          </div>

          {/* Password Input with Eye Icon */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-gray-50/50 border border-gray-200 py-4 pl-12 pr-12 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all text-sm"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className={`w-full ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'} bg-[#1d1d1f] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md mb-6`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn size={18} />
              {isSignUp ? 'Continue' : 'Sign In'}
            </span>
          )}
        </button>

        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-gray-500 hover:text-[#1d1d1f] font-medium text-xs transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-[11px] uppercase tracking-widest">
        {role === UserRole.USER && (
          <span>Institutional access only • .edu.in required</span>
        )}
      </div>
    </div>
  );
};

export default Auth;