// Pages/StaffDashboard.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useApp } from "../context/AppContext"
import { 
  Package, Star, Power, Plus, 
  TrendingUp, Activity, Edit2, Trash2, X, Users
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "@/firebaseConfig"
import api, { getStaffMenu, deleteMenuItem } from "@/services/api"
import AddStaffModal from "@/components/AddStaffModal"
import ManageTeamModal from "@/components/ManageTeamModal"

interface BackendMenuItem {
  item_id: string;
  name: string;
  price: number;
  description: string;
  is_available: boolean;
  image_url?: string; 
}

const StaffDashboard: React.FC = () => {
  const [backendOrders, setBackendOrders] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<BackendMenuItem[]>([])
  const [isMenuLoading, setIsMenuLoading] = useState(true)

  const [showAddStaff, setShowAddStaff] = useState(false)
  const [showManageTeam, setShowManageTeam] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const { cafeterias, managedCafeteriaId, staffProfile, toggleCafeteriaStatus } = useApp()

  useEffect(() => {
    // Fetch Total Orders Count for Stats
    const fetchStats = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        if (!token) return
        const res = await api.get("/staff/orders?status=PAID", {
           headers: { Authorization: `Bearer ${token}` }
        })
        setBackendOrders(res.data.orders || [])
      } catch (err) {}
    }

    // Fetch Menu
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

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!window.confirm(`Delete "${itemName}"?`)) return;
    try {
      setIsDeleting(itemId);
      await deleteMenuItem(itemId);
      setMenuItems(prev => prev.filter(item => item.item_id !== itemId));
    } catch (error) {
      alert("Delete failed.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!staffProfile) return <div className="p-10 text-center">Loading...</div>

  const myCafe = cafeterias.find((c) => c.id === managedCafeteriaId) || cafeterias[0]

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100 flex justify-between items-start z-10">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Control Panel</p>
          <h1 style={{ fontFamily: 'Geom' }} className="text-3xl font-bold text-gray-900">{myCafe.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${myCafe.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-500">{myCafe.isOpen ? "Store is Live" : "Store is Closed"}</span>
          </div>
        </div>
        <button onClick={() => toggleCafeteriaStatus(myCafe.id)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${myCafe.isOpen ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
          <Power size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Orders" value={backendOrders.length.toString()} icon={<Activity size={18} className="text-blue-600" />} />
          <StatCard label="Active Menu" value={menuItems.length.toString()} icon={<Package size={18} className="text-emerald-600" />} />
          <StatCard label="Rating" value={myCafe.rating.toString()} icon={<Star size={18} className="text-orange-500" />} />
          <StatCard label="Revenue" value="Coming Soon" icon={<TrendingUp size={18} className="text-purple-600" />} />
        </div>

        {staffProfile.role === "manager" && (
          <div>
            <h3 style={{ fontFamily: "Geom" }} className="text-lg font-bold text-gray-900 mb-4">Staff Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowAddStaff(true)} className="bg-black text-white py-4 rounded-xl flex flex-col items-center justify-center gap-2">
                <Plus size={16} strokeWidth={3} />
                <span className="font-semibold text-sm">Add Staff</span>
              </button>
              <button onClick={() => setShowManageTeam(true)} className="bg-white border border-gray-200 text-gray-900 py-4 rounded-xl flex flex-col items-center justify-center gap-2">
                <Users size={16} strokeWidth={2} />
                <span className="font-semibold text-sm">View Team</span>
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: 'Geom' }} className="text-lg font-bold text-gray-900">Active Menu</h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-1 rounded-md">{menuItems.length} ITEMS</span>
          </div>

          {isMenuLoading ? <div className="text-center py-10">Loading...</div> : (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div key={item.item_id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                    {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : "🍱"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 style={{ fontFamily: 'Geom' }} className="font-semibold text-gray-900 mb-0.5 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 truncate mb-1">{item.description}</p>
                    <span className="text-sm font-bold text-emerald-600">₹{item.price}</span>
                  </div>
                  <div className="flex flex-col gap-2 border-l border-gray-100 pl-4">
                      <button onClick={() => window.alert("Edit coming soon")} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"><Edit2 size={14} /></button>
                      <button disabled={isDeleting === item.item_id} onClick={() => handleDeleteItem(item.item_id, item.name)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 disabled:opacity-50">
                          {isDeleting === item.item_id ? <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} />}
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddStaff(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             <motion.div layout initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 p-6">
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Add Staff</h3><button onClick={() => setShowAddStaff(false)}><X size={20} /></button></div>
                <AddStaffModal onClose={() => setShowAddStaff(false)} />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showManageTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManageTeam(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div layout initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
              <ManageTeamModal onClose={() => setShowManageTeam(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

const StatCard: React.FC<{label: string; value: string; icon: React.ReactNode}> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
    <div className="flex justify-between items-start"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span><div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">{icon}</div></div>
    <span style={{ fontFamily: 'Geom' }} className="text-2xl font-bold text-gray-900">{value}</span>
  </div>
)

export default StaffDashboard