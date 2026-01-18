import React, { useEffect, useState } from 'react';
import { Package, CheckCircle2, ShoppingBag, Loader2, X, KeyRound, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStaffOrders, verifyPickup } from '@/services/api';

// Types
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReadyOrder {
  order_id: string;
  pickup_code: string; 
  status: string;
  items: OrderItem[];
  user_details?: { name: string };
}

const IncomingReservations: React.FC = () => {
  const [readyOrders, setReadyOrders] = useState<ReadyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ReadyOrder | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // New: Feedback Popup State
  const [feedback, setFeedback] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const fetchReady = async () => {
    try {
      if (readyOrders.length === 0) setLoading(true);
      const data = await getStaffOrders("READY");
      setReadyOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to load pickups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReady();
    const interval = setInterval(fetchReady, 15000);
    return () => clearInterval(interval);
  }, []);

  const openVerifyModal = (order: ReadyOrder) => {
    setSelectedOrder(order);
    setOtpInput("");
    setShowVerifyModal(true);
  };

  const closeVerifyModal = () => {
    setShowVerifyModal(false);
    setSelectedOrder(null);
    setOtpInput("");
    setIsVerifying(false);
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ show: true, type, message });
    // Auto hide success after 3 seconds
    if (type === 'success') {
      setTimeout(() => setFeedback(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder || !otpInput || otpInput.length < 4) {
      showFeedback('error', "Please enter a valid 4-digit code.");
      return;
    }

    setIsVerifying(true);

    try {
      await verifyPickup(selectedOrder.order_id, otpInput);
      
      // Success Handling
      closeVerifyModal(); // Close input modal first
      showFeedback('success', "Verification Successful! Handover Complete.");
      
      // Update UI
      setReadyOrders(prev => prev.filter(o => o.order_id !== selectedOrder.order_id));

    } catch (err: any) {
      console.error("Verification error:", err);
      // Fix: Read 'message' from backend response, not 'detail'
      const errorMessage = err.response?.data?.message || "Verification failed. Please check the code.";
      showFeedback('error', errorMessage);
      setIsVerifying(false); 
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-transparent relative">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Pickup Hub</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">
          Ready for Collection ({readyOrders.length})
        </p>
      </header>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {loading ? (
           <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : readyOrders.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-[3.5rem] border-2 border-dashed border-gray-100">
             <ShoppingBag className="text-gray-200 mx-auto mb-4" size={56} />
             <h3 className="text-xl font-black text-gray-900">Shelf Empty</h3>
             <p className="text-xs font-bold text-gray-400 uppercase">No orders waiting for pickup</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {readyOrders.map(order => (
                <motion.div 
                  key={order.order_id}
                  layout
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-white p-7 rounded-[3rem] border border-gray-50 shadow-sm group"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[1.75rem] flex items-center justify-center">
                         <Package size={26} />
                       </div>
                       <div>
                         {/* --- CHANGE 1: Displaying Order ID fragment instead of secret code --- */}
                         <h3 className="font-black text-xl text-gray-900 tracking-tight leading-none mb-1.5 uppercase">
                           #{order.order_id.slice(-6)} 
                         </h3>
                         <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-1 rounded-md">
                             Ready
                           </span>
                           <span className="text-xs font-bold text-gray-500 truncate max-w-[120px]">
                             {order.user_details?.name || 'Student'}
                           </span>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-[2.25rem] mb-6 border border-gray-100">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => openVerifyModal(order)}
                    className="w-full bg-emerald-600 text-white py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-100"
                  >
                     <KeyRound size={18} />
                     Verify & Handover
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input Modal */}
      <AnimatePresence>
        {showVerifyModal && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={closeVerifyModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 p-8"
            >
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">Verify Pickup</h3>
                    <p className="text-xs text-gray-500 font-bold mt-1">Order #{selectedOrder.order_id.slice(-6).toUpperCase()}</p>
                  </div>
                  <button onClick={closeVerifyModal} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100"><X size={20} /></button>
               </div>

               <form onSubmit={handleVerifySubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">
                      Ask student for their code
                    </label>
                    <input 
                      type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4}
                      value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="• • • •"
                      className="w-full bg-gray-50 border-2 border-gray-100 text-center text-4xl font-black tracking-[0.5em] py-5 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-300"
                      autoFocus
                    />
                  </div>
                  <button 
                    type="submit" disabled={isVerifying || otpInput.length < 4}
                    className="w-full bg-emerald-600 text-white py-5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 active:scale-95 transition-all disabled:opacity-70"
                  >
                     {isVerifying ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                     {isVerifying ? "Verifying..." : "Confirm Handover"}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CHANGE 2: Feedback Popup Modal --- */}
      <AnimatePresence>
        {feedback.show && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center pointer-events-none p-6">
             <motion.div
               initial={{ opacity: 0, y: 50, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 20, scale: 0.95 }}
               className={`pointer-events-auto w-full max-w-sm p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border ${
                 feedback.type === 'success' 
                   ? 'bg-white border-emerald-100' 
                   : 'bg-white border-red-100'
               }`}
             >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  feedback.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
                }`}>
                  {feedback.type === 'success' ? <Check size={24} strokeWidth={3} /> : <AlertCircle size={24} strokeWidth={3} />}
                </div>
                <div className="flex-1">
                   <h4 className={`text-lg font-black leading-none mb-1 ${
                     feedback.type === 'success' ? 'text-gray-900' : 'text-red-600'
                   }`}>
                     {feedback.type === 'success' ? 'Success!' : 'Failed'}
                   </h4>
                   <p className="text-xs font-bold text-gray-500 leading-tight">
                     {feedback.message}
                   </p>
                </div>
                <button 
                  onClick={() => setFeedback(prev => ({ ...prev, show: false }))}
                  className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncomingReservations;