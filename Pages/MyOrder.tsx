import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, MapPin, ShoppingBag, BellRing, ChefHat, 
  CheckCircle2, X, ChevronRight, UtensilsCrossed, Store 
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '@/firebaseConfig'; 

const COLLEGE_ID = "tMEBxMvwxTkfeYU5mXDW";

const getOrderTotal = (items: any[]) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const getItemsCount = (items: any[]) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

const MyOrders: React.FC = () => {
  const { orders, loadOrders } = useApp();
  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [stallNames, setStallNames] = useState<Record<string, string>>({});
  const fetchedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => { loadOrders(); }, 5000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  useEffect(() => {
    const fetchMissingNames = async () => {
      const uniqueIDs = new Set<string>();

      orders.forEach(o => {
        const id = (o as any).stall_id || o.cafeteriaName; 
        if (id && !stallNames[id] && !fetchedIds.current.has(id) && id.length > 3) { 
           uniqueIDs.add(id);
        }
      });

      if (uniqueIDs.size === 0) return;

      uniqueIDs.forEach(id => fetchedIds.current.add(id));

      const newNames: Record<string, string> = {};
      
      await Promise.all(Array.from(uniqueIDs).map(async (stallId) => {
        try {
          const docRef = doc(db, "colleges", COLLEGE_ID, "stalls", stallId);
          const snap = await getDoc(docRef);
          
          if (snap.exists()) {
            newNames[stallId] = snap.data().name || "Unnamed Stall";
          } else {
            newNames[stallId] = "Unknown Stall"; 
          }
        } catch (err) {
          console.error(`Error fetching stall ${stallId}:`, err);
          newNames[stallId] = "Stall (Offline)"; 
        }
      }));

      if (Object.keys(newNames).length > 0) {
        setStallNames(prev => ({ ...prev, ...newNames }));
      }
    };

    if (orders.length > 0) {
      fetchMissingNames();
    }
  }, [orders, stallNames]); 


  // ---  FILTERING LOGIC ---
  const filteredOrders = orders.filter(o => {
    const isPast = ['Claimed', 'Completed', 'Cancelled'].includes(o.status as string);
    if (activeTab === 'Active') return !isPast;
    return isPast;
  });

  const selectedOrder = orders.find(o => o.id === selectedId);

  useEffect(() => {
    if (selectedId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  const getStallName = (order: any) => {
    const id = order.stall_id || order.cafeteriaName;
    if (stallNames[id]) return stallNames[id];
    return "Loading..."; 
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'Ready') {
      return (
        <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-emerald-50 text-emerald-600">
          <BellRing size={12} />
          <span className="text-xs font-semibold">Ready for Pickup</span>
        </div>
      );
    }
    if (['Reserved', 'Payment Pending', 'Paid'].includes(status)) {
      return (
        <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-blue-50 text-blue-600">
          <ChefHat size={12} />
          <span className="text-xs font-semibold">Preparing</span>
        </div>
      );
    }
    if (['Claimed', 'Completed'].includes(status)) {
      return (
        <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-gray-100 text-gray-600">
          <CheckCircle2 size={12} />
          <span className="text-xs font-semibold">Completed</span>
        </div>
      );
    }
    return (
      <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-gray-50 text-gray-500">
        <span className="text-xs font-semibold">{status}</span>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col h-full bg-gray-50 relative" 
      style={{ fontFamily: 'Geom' }}
    >
      
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white z-10 relative">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>
        <div className="flex gap-4 border-b border-gray-200">
          {(['Active', 'Past'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="relative pb-3 px-1">
              <span className={`text-sm font-semibold transition-colors ${activeTab === tab ? 'text-emerald-600' : 'text-gray-500'}`}>
                {tab}
              </span>
              {activeTab === tab && (
                <motion.div layoutId="order-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-4">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center h-64 text-center mt-12">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="text-gray-300" size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No orders here</h3>
              <p className="text-sm text-gray-500 max-w-[240px]">Your {activeTab.toLowerCase()} orders will appear here</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const itemsCount = getItemsCount(order.items);
                const totalAmount = getOrderTotal(order.items);
                const displayName = getStallName(order);

                return (
                  <motion.div
                    layoutId={`myorders-card-${order.id}`} 
                    key={order.id}
                    onClick={() => setSelectedId(order.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-white rounded-2xl p-4 border relative cursor-pointer ${order.status === 'Ready' ? 'border-emerald-200 shadow-sm shadow-emerald-100/50' : 'border-gray-100 shadow-sm'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <motion.h3 layoutId={`myorders-title-${order.id}`} className="text-base font-bold text-gray-900">
                          {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}
                        </motion.h3>
                        <motion.div layoutId={`myorders-meta-${order.id}`} className="flex items-center gap-1.5 text-gray-500 mt-1">
                          <Store size={14} className="text-emerald-600" />
                          <span className="text-xs font-medium text-gray-800">{displayName}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-900 font-medium">₹{totalAmount}</span>
                        </motion.div>
                      </div>
                      <motion.div layoutId={`myorders-status-${order.id}`}>
                        {renderStatusBadge(order.status)}
                      </motion.div>
                    </div>

                    <div className="space-y-1 mb-2">
                        {order.items?.slice(0, 2).map((item: any, idx: number) => (
                          <div key={idx} className="text-xs text-gray-500 flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 2 && (
                          <div className="text-xs text-gray-400 font-medium">+ {(order.items?.length || 0) - 2} more items...</div>
                        )}
                    </div>
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-emerald-600">
                      <span>View Details & QR</span>
                      <ChevronRight size={14} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedId && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            {/* FIX: Matched layoutId with the list item */}
            <motion.div layoutId={`myorders-card-${selectedId}`} className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]" style={{ fontFamily: 'Geom' }}>
              
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => { e.stopPropagation(); setSelectedId(null); }} className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <X size={18} />
              </motion.button>

              <div className="overflow-y-auto p-6 scrollbar-hide flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2 pr-10">
                    <div>
                      <motion.h3 layoutId={`myorders-title-${selectedId}`} className="text-xl font-bold text-gray-900">Order Details</motion.h3>
                      <motion.div layoutId={`myorders-meta-${selectedId}`} className="flex items-center gap-1.5 text-gray-500 mt-1">
                        <MapPin size={14} className="text-emerald-600" />
                        <span className="text-sm font-medium text-gray-700">{getStallName(selectedOrder)}</span>
                      </motion.div>
                    </div>
                    <motion.div layoutId={`myorders-status-${selectedId}`}>
                        {renderStatusBadge(selectedOrder.status)}
                    </motion.div>
                  </div>

                  {/* Status Messages */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    {['Reserved', 'Payment Pending', 'Paid'].includes(selectedOrder.status) && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2">
                        <UtensilsCrossed size={16} className="text-blue-600 flex-shrink-0" />
                        <p className="text-xs font-medium text-blue-700">Chef is preparing your order</p>
                      </div>
                    )}
                    {selectedOrder.status === 'Ready' && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <BellRing size={16} className="text-emerald-600 flex-shrink-0" />
                        <p className="text-xs font-medium text-emerald-700">Your order is ready! Show the code below.</p>
                      </div>
                    )}
                    {['Claimed', 'Completed'].includes(selectedOrder.status) && (
                        <div className="p-3 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-gray-500 flex-shrink-0" />
                          <p className="text-xs font-medium text-gray-600">This order has been picked up.</p>
                        </div>
                    )}
                  </motion.div>
                </div>

                {/* QR Code */}
                {['Reserved', 'Ready', 'Paid'].includes(selectedOrder.status) && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 mb-6 text-center">
                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm p-2">
                        <QrCode size={140} className="text-gray-900" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Pickup Code</p>
                        <p className="text-3xl font-bold text-gray-900 tracking-wider">{selectedOrder.qrCode || '----'}</p>
                    </div>
                    </motion.div>
                )}

                {/* Item List */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                  <div className="space-y-3 mb-6">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <span className="bg-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm border border-gray-100">×{item.quantity}</span>
                            <div>
                               <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                               <p className="text-xs text-gray-500">₹{item.price}/each</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 px-2">
                        <span className="text-sm font-medium text-gray-500">Total Amount</span>
                        <span className="text-xl font-bold text-gray-900">₹{getOrderTotal(selectedOrder.items)}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Actions / Status Indicator */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }} 
                  className="mt-auto pt-2"
                >
                  {/* CASE 1: READY FOR PICKUP */}
                  {selectedOrder.status === 'Ready' && (
                    <div className="w-full py-4 rounded-xl text-sm font-bold bg-emerald-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                      <BellRing size={20} className="animate-pulse" />
                      <span>Order Ready for Pickup</span>
                    </div>
                  )}

                  {/* CASE 2: PREPARING */}
                  {['Reserved', 'Payment Pending', 'Paid'].includes(selectedOrder.status) && (
                    <div className="w-full py-4 rounded-xl text-sm font-bold bg-blue-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                      <ChefHat size={20} />
                      <span>Kitchen is Preparing</span>
                    </div>
                  )}

                  {/* CASE 3: COMPLETED */}
                  {['Claimed', 'Completed'].includes(selectedOrder.status) && (
                    <div className="w-full py-4 rounded-xl text-sm font-bold bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>Order Completed</span>
                    </div>
                  )}

                  {/* CASE 4: CANCELLED */}
                  {(selectedOrder.status as string) === 'Cancelled' && (
                    <div className="w-full py-4 rounded-xl text-sm font-bold bg-red-50 text-red-500 border border-red-100 flex items-center justify-center gap-2">
                      <X size={20} />
                      <span>Order Cancelled</span>
                    </div>
                  )}
                </motion.div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyOrders;