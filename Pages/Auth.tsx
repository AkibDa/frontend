import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, Send, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { 
  signInWithEmailAndPassword, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink 
} from 'firebase/auth';
import api from '@/services/api';
import { auth } from '@/firebaseConfig';

interface AuthProps {
  verifyOnly?: boolean;
}

const Auth: React.FC<AuthProps> = ({ verifyOnly }: AuthProps) => {
  const { setUserRole, setOnboarded, setVerified, userRole } = useApp();

  // Component State
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);

  // --- Step 1: Handle Magic Link Redirection ---
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      
      // If user opened link on a different device/browser, ask for email confirmation
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }

      if (emailForSignIn) {
        setLoading(true);
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(async (result) => {
            window.localStorage.removeItem('emailForSignIn');
            console.log('Passwordless login success for:', result.user.email);
            
            // Student role is assumed for email-link logins in this flow
            setUserRole(UserRole.USER);
            setVerified(true);
            setOnboarded(true);
          })
          .catch((err) => {
            console.error("SignInWithEmailLink Error:", err);
            setError("The login link is invalid or has expired.");
          })
          .finally(() => setLoading(false));
      }
    }
  }, [setUserRole, setVerified, setOnboarded]);

  const handleSignIn = async () => {
    setError(null);

    // --- STUDENT FLOW (Passwordless + Domain Check) ---
    if (role === UserRole.USER) {
      if (!email.endsWith('.edu.in')) {
        setError("Only institutional emails ending in .edu.in are permitted.");
        return;
      }

      setLoading(true);
      try {
        const actionCodeSettings = {
          // The URL to redirect back to. Must be whitelisted in Firebase Console!
          url: window.location.origin + '/auth', 
          handleCodeInApp: true,
        };
        
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        setLinkSent(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- STAFF FLOW (Standard Password + Backend Verification) ---
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // 1. Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      
      // 2. FastAPI Verification
      const response = await api.post('/auth/verify-staff');
      console.log('Staff verification success:', response.data);

      setUserRole(UserRole.STAFF);
      setVerified(true);
      setOnboarded(true);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Unauthorized staff access.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // UI for post-email send
  if (linkSent) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="bg-green-50 p-6 rounded-full mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h2>
        <p className="text-gray-500 mb-8">
          A secure login link was sent to <br/>
          <strong>{email}</strong>
        </p>
        <button 
          onClick={() => setLinkSent(false)}
          className="text-green-600 font-semibold hover:underline"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-8 bg-white">
      <div className="mt-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500">Sign in to access your canteen dashboard.</p>
      </div>

      {/* Role Switcher */}
      <div className="bg-gray-100 p-1 rounded-2xl flex mb-10">
        <button
          onClick={() => setRole(UserRole.USER)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
            role === UserRole.USER ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setRole(UserRole.STAFF)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
            role === UserRole.STAFF ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'
          }`}
        >
          Staff
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-8">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={role === UserRole.USER ? "yourname@tint.edu.in" : "Staff Email"}
            className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>

        {/* Password only visible for Staff */}
        {role === UserRole.STAFF && (
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
        )}
      </div>

      <button
        onClick={handleSignIn}
        disabled={loading}
        className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600'} text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:bg-green-700 transition-colors mb-6`}
      >
        {loading ? "Processing..." : (
          <>
            {role === UserRole.USER ? <Send size={20} /> : <LogIn size={20} />}
            {role === UserRole.USER ? "Send Login Link" : "Sign In"}
          </>
        )}
      </button>

      <div className="mt-auto text-center text-gray-500 text-sm">
        <div>
          Institutional login requires a <span className="font-bold">*.edu.in</span> domain.
        </div>
      </div>
    </div>
  );
};

export default Auth;