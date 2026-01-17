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
      // 1️⃣ Firebase auth
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      // 🔧 FIX 1: force-refresh token
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) throw new Error('Failed to obtain auth token');

      // =========================
      // 👨‍🎓 STUDENT FLOW
      // =========================
      if (role === UserRole.USER) {
        await api.post(
          '/auth/verify-student',
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserRole(UserRole.USER);
        setVerified(true);
        setOnboarded(true);
        return;
      }

      // =========================
      // 🧑‍🍳 STAFF FLOW with Error Handling
      // =========================
      let staffVerified = false;
      let staffActivated = false;

      try {
        // Step 1: Verify staff existence
        await api.post(
          '/auth/verify-staff',
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        staffVerified = true;

        // Step 2: Activate staff account
        await api.post(
          '/staff/activate',
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        staffActivated = true;

        // Step 3: Fetch staff profile
        const res = await api.get(
          '/staff/me',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const profile = res.data;

        // Step 4: Update app state only after all API calls succeed
        setStaffProfile({
          role: profile.role,
          stallId: profile.stall_id,
          email: profile.email,
        });

        setUserRole(UserRole.STAFF);
        setVerified(true);
        setOnboarded(true);
      } catch (staffError: any) {
        // Rollback: If activation or profile fetch failed after verification,
        // we need to handle cleanup
        if (staffVerified && !staffActivated) {
          console.error('Staff verification succeeded but activation failed. Manual cleanup may be required.');
          // Note: Ideally, the backend should handle this transactionally
          // or provide a deactivate/rollback endpoint
        }
        
        // Re-throw the error to be handled by the outer catch block
        throw staffError;
      }

    } catch (err: any) {
      if (err?.code === 'auth/user-not-found') {
        setError('Account not found.');
      } else if (err?.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err?.response?.status === 401) {
        const msg = err?.response?.data?.message;
        setError(msg || 'You are not authorized for this role.');
      } else {
        setError(err?.response?.data?.message || err.message || 'Authentication failed.');
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
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              role === UserRole.USER
                ? 'bg-white shadow-sm text-green-600'
                : 'text-gray-500'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole(UserRole.STAFF)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              role === UserRole.STAFF
                ? 'bg-white shadow-sm text-green-600'
                : 'text-gray-500'
            }`}
          >
            Staff
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium text-center">
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
              className="w-full py-4 pl-12 pr-4 rounded-xl border"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full py-4 pl-12 pr-12 rounded-xl border"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl"
        >
          {loading ? 'Processing…' : isSignUp ? 'Continue' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
