
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Camera, Loader2, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const IDVerification: React.FC = () => {
  const { setVerified, userRole } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        startScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = () => {
    setStatus('scanning');
    setIsScanning(true);
    
    // Simulate Gemini AI Verification process
    setTimeout(() => {
      setIsScanning(false);
      setStatus('success');
    }, 3000);
  };

  const proceed = () => {
    setVerified(true);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white relative z-20">
      <div className="mt-8 mb-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldCheck className="text-green-600" size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Secure Verification</h1>
        <p className="text-gray-500 font-medium px-4 leading-relaxed">
          Please upload your {userRole === UserRole.USER ? 'Student ID' : 'Staff Badge'} to access the campus terminal.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div 
          onClick={() => status === 'idle' && fileInputRef.current?.click()}
          className={`relative w-full aspect-[1.6/1] rounded-[2.5rem] border-2 border-dashed transition-all duration-500 overflow-hidden flex flex-col items-center justify-center cursor-pointer ${
            status === 'idle' ? 'border-gray-200 bg-gray-50' : 
            status === 'scanning' ? 'border-green-400 bg-green-50/20' :
            status === 'success' ? 'border-green-600 bg-green-50' : 'border-red-200 bg-red-50'
          }`}
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} className="w-full h-full object-cover" alt="ID Preview" />
              {status === 'scanning' && (
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] z-10"
                />
              )}
              <div className="absolute inset-0 bg-black/20" />
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-md flex items-center justify-center text-green-600">
                <Camera size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Capture ID Card</p>
            </div>
          )}
          
          <AnimatePresence>
            {status === 'scanning' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-green-600/60 backdrop-blur-[4px] flex flex-col items-center justify-center text-white p-6 text-center"
              >
                <Loader2 className="animate-spin mb-4" size={40} />
                <h3 className="font-black text-xl tracking-tight">Verifying Credentials</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-2">Connecting to secure server...</p>
              </motion.div>
            )}
            
            {status === 'success' && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-green-600/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 text-green-600 shadow-2xl">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="font-black text-2xl tracking-tight">Identity Confirmed</h3>
                <p className="text-sm font-medium text-green-100 mt-2">Your {userRole === UserRole.USER ? 'student' : 'staff'} status has been validated.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleCapture} 
          className="hidden" 
          accept="image/*" 
        />
        
        <div className="mt-10 w-full">
           <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50 mb-8">
              <Shield className="text-blue-600 shrink-0" size={20} />
              <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest leading-relaxed">
                Your data is encrypted and handled according to campus privacy policies.
              </p>
           </div>
        </div>
      </div>

      <div className="pb-10">
        <button 
          onClick={proceed}
          disabled={status !== 'success'}
          className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-xl shadow-green-100 active:scale-95 transition-all disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none"
        >
          {status === 'success' ? (
            <>
              Enter Terminal <ArrowRight size={20} />
            </>
          ) : (
            'Awaiting ID Scan'
          )}
        </button>
      </div>
    </div>
  );
};

export default IDVerification;
