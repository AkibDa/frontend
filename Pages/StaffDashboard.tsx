"use client"

import React, { useEffect, useState } from "react"
import { useApp } from "../context/AppContext"
import {
  Package,
  Star,
  Power,
  Plus,
  TrendingUp,
  Activity,
  Edit2,
  Trash2,
  X,
  Users,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "@/firebaseConfig"
import api, { getStaffMenu, deleteMenuItem } from "@/services/api"
import AddStaffModal from "@/components/AddStaffModal"
import ManageTeamModal from "@/components/ManageTeamModal"

const MENU_IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/AkibDa/backend/main/images_for_demo";

const getMenuImage = (imageRef?: string) => {
  if (!imageRef) return undefined;
  return `${MENU_IMAGE_BASE_URL}/${imageRef}.jpg`;
};

interface BackendMenuItem {
  item_id: string;
  name: string;
  price: number;
  description: string;
  is_available: boolean;
  image_ref?: string; 
}

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}

const StaffDashboard: React.FC = () => {
  const [backendOrders, setBackendOrders] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<BackendMenuItem[]>([])
  const [isMenuLoading, setIsMenuLoading] = useState(true)
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [showManageTeam, setShowManageTeam] = useState(false)
  
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const {
    cafeterias,
    managedCafeteriaId,
    staffProfile,
    toggleCafeteriaStatus,
  } = useApp()

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        if (!token) return
        const res = await api.get("/staff/orders?status=PAID", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBackendOrders(res.data.orders || [])
      } catch (err) {
        console.error("Failed to fetch orders", err)
      }
    }

    const fetchMenu = async () => {
      try {
        setIsMenuLoading(true)
        const data = await getStaffMenu()
        setMenuItems(data.menu_items || [])
      } catch (err) {
        console.error("Failed menu load", err)
      } finally {
        setIsMenuLoading(false)
      }
    }

    if (auth.currentUser) {
      fetchStats()
      fetchMenu()
    }
  }, [])

  const handleDeleteClick = (itemId: string, itemName: string) => {
    setItemToDelete({ id: itemId, name: itemName });
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const { id, name } = itemToDelete;
    
    // Close modal
    setItemToDelete(null);
    // Show spinner
    setIsDeleting(id);

    try {
      await deleteMenuItem(id)
      setMenuItems((prev) =>
        prev.filter((item) => item.item_id !== id)
      )
      showNotification(`"${name}" deleted successfully.`, 'success');
    } catch {
      showNotification("Delete failed. Please try again.", 'error');
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditClick = (itemName: string) => {
      showNotification(`Editing "${itemName}" is coming soon!`, 'info');
  }

  if (!staffProfile)
    return <div className="p-10 text-center">Loading...</div>

  const myCafe =
    cafeterias.find((c) => c.id === managedCafeteriaId) || cafeterias[0]

  return (
    <div style={{ fontFamily: 'Geom' }} className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute top-6 left-4 right-4 z-[70] p-4 rounded-2xl shadow-xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-emerald-600 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-600 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="flex-shrink-0" size={24} />}
            {notification.type === 'error' && <AlertTriangle className="flex-shrink-0" size={24} />}
            {notification.type === 'info' && <Info className="flex-shrink-0" size={24} />}
            
            <div>
              <h4 className="font-bold text-sm capitalize">{notification.type}</h4>
              <p className="text-xs opacity-90 font-medium">{notification.message}</p>
            </div>
            
            <button onClick={() => setNotification(null)} className="ml-auto p-1 bg-white/20 rounded-full hover:bg-white/30">
               <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100 flex justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">Control Panel</p>
          <h1 className="text-3xl font-bold">{staffProfile.stallName || myCafe.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${myCafe.isOpen ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-sm text-gray-500">{myCafe.isOpen ? "Store is Live" : "Store is Closed"}</span>
          </div>
        </div>

        <button
          onClick={() => toggleCafeteriaStatus(myCafe.id)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${myCafe.isOpen ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}
        >
          <Power size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Orders" value={backendOrders.length.toString()} icon={<Activity size={18} />} />
          <StatCard label="Active Menu" value={menuItems.length.toString()} icon={<Package size={18} />} />
          <StatCard label="Rating" value={myCafe.rating.toString()} icon={<Star size={18} />} />
          <StatCard label="Revenue" value="Coming Soon" icon={<TrendingUp size={18} />} />
        </div>

        {staffProfile.role === "manager" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Staff Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowAddStaff(true)} className="bg-black text-white py-4 rounded-xl flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <Plus size={16} /> Add Staff
              </button>
              <button onClick={() => setShowManageTeam(true)} className="bg-white border py-4 rounded-xl flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <Users size={16} /> View Team
              </button>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-bold mb-4">Active Menu</h3>
          {isMenuLoading ? (
            <div className="text-center py-10 text-gray-400 text-sm">Loading Menu...</div>
          ) : (
            <div className="space-y-3 pb-20">
              {menuItems.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.item_id} 
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                    {item.image_ref ? (
                      <img src={getMenuImage(item.image_ref)} alt={item.name} className="w-full h-full object-cover" />
                    ) : "🍱"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 style={{ fontFamily: 'Geom' }} className="font-semibold text-gray-900 mb-0.5 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 truncate mb-1">{item.description}</p>
                    <span className="text-sm font-bold text-emerald-600">₹{item.price}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => handleEditClick(item.name)}
                        className="p-2 bg-gray-50 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      disabled={isDeleting === item.item_id}
                      onClick={() => handleDeleteClick(item.item_id, item.name)}
                      className="p-2 bg-gray-50 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {isDeleting === item.item_id ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                          <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
              {menuItems.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      No items in menu. Start by adding some!
                  </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddStaff && (
          <Modal onClose={() => setShowAddStaff(false)}>
            <AddStaffModal onClose={() => setShowAddStaff(false)} />
          </Modal>
        )}
        {showManageTeam && (
          <Modal onClose={() => setShowManageTeam(false)}>
            <ManageTeamModal onClose={() => setShowManageTeam(false)} />
          </Modal>
        )}
        
        {itemToDelete && (
          <Modal onClose={() => setItemToDelete(null)}>
            <div className="text-center pt-2">
               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <Trash2 size={28} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item?</h3>
               <p className="text-sm text-gray-500 mb-8 max-w-[240px] mx-auto">
                 Are you sure you want to delete <span className="font-bold text-gray-800">"{itemToDelete.name}"</span>? This action cannot be undone.
               </p>
               <div className="flex gap-3">
                  <button 
                    onClick={() => setItemToDelete(null)} 
                    className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete} 
                    className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                  >
                    Yes, Delete
                  </button>
               </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// FIX: Removed 'backdrop-blur-sm'
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50" 
      onClick={onClose}
    />
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl p-6 z-10 w-full max-w-sm mx-4 shadow-2xl"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
        <X size={20} />
      </button>
      {children}
    </motion.div>
  </div>
)

const StatCard: React.FC<{
  label: string
  value: string
  icon: React.ReactNode
}> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm h-28 flex flex-col justify-between border border-gray-100">
    <div className="flex justify-between items-start">
      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</span>
      <div className="text-gray-400">{icon}</div>
    </div>
    <span className="text-2xl font-bold text-gray-900">{value}</span>
  </div>
)

export default StaffDashboard