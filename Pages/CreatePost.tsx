import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Loader2, Trash2, Save, Plus, CheckCircle, AlertTriangle } from 'lucide-react'; // Added icons
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';

interface ScannedItem {
  name: string;
  price: number | string;
  description: string;
}

// Simple Notification Type
interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

const CreatePost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { staffProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [showReview, setShowReview] = useState(false);

  // 1. New State for Custom Notification
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Helper to show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setShowReview(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/staff/menu/scan-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, 
      });

      const data = response.data;

      if (data.detected_items && data.detected_items.length > 0) {
        setItems(data.detected_items.map((i: any) => ({
          name: i.name,
          price: i.price || '',
          description: i.description || ''
        })));
        setShowReview(true);
        showNotification("Items scanned successfully!", 'success');
      } else {
        showNotification("No items detected. Please try again.", 'error');
      }
    } catch (error: any) {
      console.error("Scan failed:", error);
      showNotification("Failed to read menu. Try manual entry.", 'error');
      setItems([]);
      setShowReview(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateItem = (index: number, field: keyof ScannedItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([{ name: '', price: '', description: '' }, ...items]);
  };

  const handlePublishMenu = async () => {
    if (items.length === 0) return;
    setIsUploading(true);

    try {
      const meResponse = await api.get('/staff/me');
      const correctStallId = meResponse.data.stall_id;

      if (!correctStallId) throw new Error("Could not verify staff identity.");

      await api.post('/staff/menu', {
        stall_id: correctStallId,
        items: items.map(item => ({
          name: item.name,
          price: Number(item.price) || 0,
          description: item.description,
          is_available: true
        }))
      });

      // 2. Show Success Notification instead of alert
      showNotification("Menu uploaded successfully!", 'success');
      
      setItems([]);
      setShowReview(false);

      // 3. Close the modal after a short delay so user sees the message
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error("Upload failed:", error);
      const msg = error.response?.data?.message || "Failed to save menu.";
      showNotification(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Geom' }}>
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-white flex flex-col max-w-md mx-auto overflow-hidden"
    >
      
      {/* 4. Notification Toast UI */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute top-6 left-4 right-4 z-[70] p-4 rounded-2xl shadow-xl flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="flex-shrink-0" size={24} />
            ) : (
              <AlertTriangle className="flex-shrink-0" size={24} />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {notification.type === 'success' ? 'Success' : 'Error'}
              </h4>
              <p className="text-xs opacity-90 font-medium">
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
           <X size={24} />
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Upload Menu</h2>
            <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">
              {staffProfile?.stallName || "GreenPlate Stall"} Hub
            </span>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar pb-32">
        {/* Scanner */}
        {!showReview && (
          <div 
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            className="w-full aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-all hover:bg-gray-100"
          >
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform text-green-600">
                <Camera size={36} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-black text-gray-900">Scan Menu Card</h3>
              <p  className="text-xs text-gray-400 font-medium max-w-[200px]">
                Take a clear photo of your printed menu. AI will extract all items instantly.
              </p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-green-600/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center z-20">
                  <Loader2 className="animate-spin mb-4" size={48} />
                  <h3 className="text-xl font-black tracking-tight">Analyzing Menu...</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-green-100 mt-2">Extracting items & prices</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Review List */}
        {showReview && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Review Items ({items.length})</h3>
                <button 
                  type="button" 
                  onClick={handleAddItem}
                  className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1 active:scale-95"
                >
                  <Plus size={14} /> Add Item
                </button>
             </div>

             <div className="space-y-3">
                {items.map((item, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={idx}
                    className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm group focus-within:ring-2 focus-within:ring-green-500/20 transition-all"
                  >
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-2">
                        <input 
                          value={item.name}
                          onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                          placeholder="Item Name"
                          className="w-full font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none bg-transparent"
                        />
                        <input 
                          value={item.description}
                          onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                          placeholder="Short description (optional)"
                          className="w-full text-xs text-gray-500 placeholder:text-gray-300 focus:outline-none bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col items-end justify-between gap-2">
                          <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
                            <span className="text-xs font-bold text-gray-400">₹</span>
                            <input 
                              type="number"
                              value={item.price}
                              onChange={(e) => handleUpdateItem(idx, 'price', e.target.value)}
                              placeholder="0"
                              className="w-12 text-right font-black text-gray-900 bg-transparent focus:outline-none"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {showReview && (
        <div className="p-6 border-t border-gray-100 bg-white/80 backdrop-blur-md flex gap-3">
          <button 
            type="button"
            onClick={() => {
                setItems([]);
                setShowReview(false);
            }}
            className="px-6 py-4 rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            Rescan
          </button>
          <button 
            type="button"
            onClick={handlePublishMenu}
            disabled={isUploading || items.length === 0}
            className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-100 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
               <Loader2 className="animate-spin" size={18} /> Saving...
              </>
            ) : (
              <>
               <Save size={18} /> Publish Menu
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
    </div>
  );
};

export default CreatePost;