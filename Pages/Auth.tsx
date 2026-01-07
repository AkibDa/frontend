import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import api from '@/services/api';
import { auth } from '@/firebaseConfig';

interface AuthProps {
  verifyOnly?: boolean;
}

const Auth: React.FC<AuthProps> = ({ verifyOnly }: AuthProps) => {
  const {
    setUserRole,
    setOnboarded,
    setVerified,
    userRole,
  } = useApp();

  // Component State
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Auth mounted:', 'contextRole=', userRole, 'verifyOnly=', verifyOnly);
  }, [userRole, verifyOnly]);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase login success:', userCredential.user.email);

      // 2. If Staff is selected, verify against FastAPI backend
      if (role === UserRole.STAFF) {
        try {
          // This call sends the Firebase ID Token automatically via api.ts interceptor
          const response = await api.post('/auth/verify-staff');
          
          /**
           * Your backend now returns:
           * { "message": "Verified", "role": "manager", "stall_id": "...", "college_id": "..." }
           */
          const backendData = response.data;
          console.log('Staff verification success:', backendData);

          // Update context with the specific role assigned by the backend (manager/staff)
          // If your UserRole enum supports it, use backendData.role
          setUserRole(UserRole.STAFF); 
          
        } catch (err: any) {
          console.error("Backend verification failed", err);
          // This catches the CORS error or a 401/403 Unauthorized
          const errorMessage = err.response?.data?.detail || "You are not authorized as a staff member in our system.";
          throw new Error(errorMessage);
        }
      } else {
        // Handle standard student/user login
        setUserRole(UserRole.USER);
      }

      // 3. Update Global Context for successful session
      setOnboarded(true);
      setVerified(true);

    } catch (err: any) {
      setError(err.message || "An error occurred during sign in.");
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white">
      <div className="mt-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500">Sign in to continue your impact.</p>
      </div>

      {/* Role Switcher */}
      <div className="bg-gray-100 p-1 rounded-2xl flex mb-10">
        <button
          onClick={() => setRole(UserRole.USER)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
            role === UserRole.USER
              ? 'bg-white shadow-sm text-green-600'
              : 'text-gray-500'
          }`}
        >
          User
        </button>
        <button
          onClick={() => setRole(UserRole.STAFF)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
            role === UserRole.STAFF
              ? 'bg-white shadow-sm text-green-600'
              : 'text-gray-500'
          }`}
        >
          Cafeteria Staff
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>
      </div>

      {/* Sign In Button */}
      <button
        onClick={handleSignIn}
        disabled={loading}
        className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600'} text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:bg-green-700 transition-colors mb-6`}
      >
        {loading ? (
          "Authenticating..."
        ) : (
          <>
            <LogIn size={20} />
            Sign In
          </>
        )}
      </button>

      <div className="flex items-center gap-4 mb-8 text-gray-400 text-xs font-medium">
        <div className="flex-1 h-px bg-gray-100"></div>
        OR CONTINUE WITH
        <div className="flex-1 h-px bg-gray-100"></div>
      </div>

      <button
        className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <img
          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
          className="w-5 h-5"
          alt="Google"
        />
        Google Sign-in
      </button>

      <div className="mt-auto text-center text-gray-500 text-sm">
        <div className="mb-2">
          Current role in context:{' '}
          <span className="font-bold text-gray-800">
            {String(userRole)}
          </span>
        </div>
        <div>
          Don't have an account?{' '}
          <span className="text-green-600 font-bold cursor-pointer">
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;