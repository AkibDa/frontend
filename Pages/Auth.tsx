import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const Auth: React.FC = () => {
  const { setUserRole, setOnboarded, setVerified, setStaffProfile } = useApp();

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
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Firebase Auth (Login or SignUp)
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      // 2️⃣ Force Token Refresh to ensure we have the latest claims
      const user = auth.currentUser;
      if (!user) throw new Error('Authentication failed. No user found.');
      
      const token = await user.getIdToken(true);

      // =========================
      // 👨‍🎓 STUDENT FLOW
      // =========================
      if (role === UserRole.USER) {
        // 🔒 Use native fetch to avoid Axios interceptor conflicts
        const res = await fetch('http://localhost:8000/auth/verify-student', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({}) // Send empty object, not null
        });

        if (!res.ok) {
           // Try to parse error message from backend
           const errData = await res.json().catch(() => ({}));
           throw new Error(errData.message || `Verification failed: ${res.status}`);
        }

        setUserRole(UserRole.USER);
        setVerified(true);
        setOnboarded(true);
        return;
      }

      // =========================
      // 👔 STAFF FLOW
      // =========================
      
      // 1. Verify Staff
      const verifyRes = await fetch('http://localhost:8000/auth/verify-staff', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!verifyRes.ok) throw new Error("Staff verification failed");

      // 2. Activate Staff
      const activateRes = await fetch('http://localhost:8000/staff/activate', {
         method: 'POST',
         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
         body: JSON.stringify({})
      });
      if (!activateRes.ok) throw new Error("Staff activation failed");

      // 3. Get Profile
      const profileRes = await fetch('http://localhost:8000/staff/me', {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!profileRes.ok) throw new Error("Failed to load staff profile");
      
      const profile = await profileRes.json();

      setStaffProfile({
        role: profile.role,
        stallId: profile.stall_id,
        stallName: profile.stall_name,
        email: profile.email,
      });

      setUserRole(UserRole.STAFF);
      setVerified(true);
      setOnboarded(true);

    } catch (err: any) {
      console.error("Auth Error:", err);

      // Detailed Error Handling
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        setError('Account not found. Please Sign Up first.');
      } else if (err?.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please Sign In.');
      } else if (err.message.includes('401')) {
        setError('Access Denied. You may need to use a college email.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9F9F9] font-sans text-[#1d1d1f]">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
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
            {isSignUp
              ? 'Enter your details to get started'
              : 'Welcome back, please enter your details'}
          </p>
        </div>

        {/* Role Switch */}
        <div className="bg-gray-100/80 p-1 rounded-xl flex mb-8">
          <button
            onClick={() => setRole(UserRole.USER)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              role === UserRole.USER
                ? 'bg-white shadow-sm text-green-600'
                : 'text-gray-500'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole(UserRole.STAFF)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              role === UserRole.STAFF
                ? 'bg-white shadow-sm text-green-600'
                : 'text-gray-500'
            }`}
          >
            Staff
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4 mb-10">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full py-4 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full py-4 pl-12 pr-12 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : isSignUp ? 'Continue' : 'Sign In'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-green-600 font-medium hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Auth;