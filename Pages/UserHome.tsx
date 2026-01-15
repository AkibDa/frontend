import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Loader2, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/firebaseConfig';
import { initiatePayment } from '@/services/paymentService';
import { getUserMenu ,verifyOrder} from '@/services/api';

interface MenuItem {
  item_id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category?: string;
  is_available: boolean;
}

interface Stall {
  stall_id: string;
  stall_name: string;
  menu_items: MenuItem[];
}

const UserHome: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Map<string, { item: MenuItem; stallId: string; quantity: number }>>(new Map());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const menuData = await getUserMenu();
        setStalls(menuData.stalls || []);
      } catch (err) {
        console.error('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (item: MenuItem, stallId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const cartKey = `${stallId}-${item.item_id}`;
    const newCart = new Map(cart);
    const existing = newCart.get(cartKey);
    if (existing) {
      newCart.set(cartKey, { ...existing, quantity: existing.quantity + 1 });
    } else {
      newCart.set(cartKey, { item, stallId, quantity: 1 });
    }
    setCart(newCart);
  };

  const removeFromCart = (item: MenuItem, stallId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const cartKey = `${stallId}-${item.item_id}`;
    const newCart = new Map(cart);
    const existing = newCart.get(cartKey);
    if (existing && existing.quantity > 1) {
      newCart.set(cartKey, { ...existing, quantity: existing.quantity - 1 });
    } else {
      newCart.delete(cartKey);
    }
    setCart(newCart);
  };

  const cartTotal = Array.from(cart.values()).reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const cartItemCount = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.size === 0) return;
    setIsCheckingOut(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in');
        return;
      }

      // 1. Prepare Data
      const firstItem = Array.from(cart.values())[0];
      const cartItems = Array.from(cart.values()).map((item) => ({
        item_id: item.item.item_id,
        quantity: item.quantity,
      }));

      // 2. Trigger Razorpay Checkout
      const result = await initiatePayment(
        cartItems, 
        firstItem.stallId, 
        user.email || '', 
        user.displayName || ''
      );

      console.log("🔥 VERIFY PAYLOAD", {
      razorpay_payment_id: result.paymentId,
      razorpay_order_id: result.orderId,
      razorpay_signature: result.signature,
      internal_order_id: result.internalOrderId,
    });

      // 3. verify payment on backend
      if (result.success) {
        await verifyOrder({
          razorpay_payment_id: result.paymentId!,
          razorpay_order_id: result.orderId!, 
          razorpay_signature: result.signature!,
          internal_order_id: result.internalOrderId!,
        });

        setCart(new Map());
        setShowCart(false);
        alert('✅ Order placed successfully!');
      } else {
        alert(`❌ Payment failed: ${result.error}`);
      }

    } catch (error: any) {
      console.error("Checkout Error:", error);
      alert(`❌ Error: ${error.message || 'Something went wrong'}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Search Header */}
      <div className="px-6 pt-6 pb-4 bg-white">
        <h1 style={{ fontFamily: 'Geom' }} className="text-2xl font-bold text-gray-900 mb-4">
          Menu
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className="w-full bg-gray-50 border border-gray-200 py-2.5 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto pb-32">
        {stalls.map((stall) => (
          <div key={stall.stall_id} className="mb-8">
            <div className="px-6 mb-3">
              <h2 style={{ fontFamily: 'Geom' }} className="text-lg font-bold text-gray-900">
                {stall.stall_name}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{stall.menu_items.length} items available</p>
            </div>

            <div className="space-y-3 px-6">
              {stall.menu_items.map((item) => {
                const cartKey = `${stall.stall_id}-${item.item_id}`;
                const qty = cart.get(cartKey)?.quantity || 0;
                return (
                  <div
                    key={item.item_id}
                    className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-4"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      {item.image_url || '🍽️'}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 style={{ fontFamily: 'Geom' }} className="font-semibold text-gray-900 text-sm mb-0.5">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.description}</p>
                      <p style={{ fontFamily: 'Geom' }} className="text-base font-bold text-gray-900">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Add/Remove Buttons */}
                    <div className="flex items-center">
                      {qty === 0 ? (
                        <button
                          onClick={(e) => addToCart(item, stall.stall_id, e)}
                          className="w-9 h-9 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors"
                        >
                          <Plus size={18} strokeWidth={2.5} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
                          <button
                            onClick={(e) => removeFromCart(item, stall.stall_id, e)}
                            className="w-7 h-7 flex items-center justify-center text-emerald-700"
                          >
                            <Minus size={16} strokeWidth={2.5} />
                          </button>
                          <span style={{ fontFamily: 'Geom' }} className="font-bold text-sm text-emerald-700 min-w-[16px] text-center">
                            {qty}
                          </span>
                          <button
                            onClick={(e) => addToCart(item, stall.stall_id, e)}
                            className="w-7 h-7 flex items-center justify-center text-emerald-700"
                          >
                            <Plus size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-20 left-6 right-6 z-50"
          >
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium opacity-90">View Cart</p>
                  <p style={{ fontFamily: 'Geom' }} className="text-sm font-bold">
                    {cartItemCount} items • ₹{cartTotal}
                  </p>
                </div>
              </div>
              <span style={{ fontFamily: 'Geom' }} className="font-bold">Checkout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 style={{ fontFamily: 'Geom' }} className="text-xl font-bold">Your Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {Array.from(cart.values()).map(({ item, stallId, quantity }) => (
                  <div key={`${stallId}-${item.item_id}`} className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {item.image_url || '🍽️'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">₹{item.price} × {quantity}</p>
                    </div>
                    <p style={{ fontFamily: 'Geom' }} className="font-bold">₹{item.price * quantity}</p>
                  </div>
                ))}
              </div>

              {/* Checkout Button */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total</span>
                  <span style={{ fontFamily: 'Geom' }} className="text-2xl font-bold">₹{cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserHome;