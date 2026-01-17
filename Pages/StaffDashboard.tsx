"use client"

import React, { useEffect, useState } from "react"
import { useApp } from "../context/AppContext"
import {  Package, Star, Power, Plus, 
  TrendingUp, Activity, Edit2, Trash2, X, Users
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "@/firebaseConfig"
import api from "@/services/api"
import AddStaffModal from "@/components/AddStaffModal"
import ManageTeamModal from "@/components/ManageTeamModal"


const StaffDashboard: React.FC = () => {
  const [backendOrders, setBackendOrders] = useState<any[]>([])
  const [, setShowAddStaff] = useState(false)
  const [showManageTeam, setShowManageTeam] = useState(false);

  const { deals, cafeterias, managedCafeteriaId, staffProfile, toggleCafeteriaStatus } = useApp()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        if (!token) return

        const res = await api.get("/staff/orders?status=PAID", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setBackendOrders(res.data.orders || [])
      } catch (err) {
        console.error("Failed to fetch staff orders", err)
      }
    }
    fetchOrders()
  }, [])

  if (!staffProfile) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-sm text-gray-500">Loading staff profile...</p>
      </div>
    )
  }

  const myCafe = cafeterias.find((c) => c.id === managedCafeteriaId) || cafeterias[0]
  const myDeals = deals.filter((d) => d.cafeteriaId === myCafe.id && !d.isClaimed)
  const completedCount = backendOrders.length

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      
      {/* 1. Header Section */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100 flex justify-between items-start z-10">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Control Panel
          </p>
          <h1 style={{ fontFamily: 'Geom' }} className="text-3xl font-bold text-gray-900">
            {myCafe.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${myCafe.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-500">
              {myCafe.isOpen ? "Store is Live" : "Store is Closed"}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => toggleCafeteriaStatus(myCafe.id)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            myCafe.isOpen 
              ? "bg-emerald-50 text-emerald-600 hover:bg-red-50 hover:text-red-600" 
              : "bg-gray-100 text-gray-400 hover:bg-emerald-600 hover:text-white"
          }`}
        >
          <Power size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* 2. Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            label="Total Orders" 
            value={completedCount.toString()} 
            icon={<Activity size={18} className="text-blue-600" />} 
          />
          <StatCard 
            label="Active Menu" 
            value={myDeals.length.toString()} 
            icon={<Package size={18} className="text-emerald-600" />} 
          />
          <StatCard 
            label="Rating" 
            value={myCafe.rating.toString()} 
            icon={<Star size={18} className="text-orange-500" />} 
          />
          <StatCard 
            label="Revenue" 
            value="Coming Soon" 
            icon={<TrendingUp size={18} className="text-purple-600" />} 
          />
        </div>

        {/* Manager Actions */}
        {/* Manager Actions */}
        {staffProfile.role === "manager" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontFamily: "Geom" }} className="text-lg font-bold text-gray-900">
                Staff Management
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Existing Add Button */}
              <button
                onClick={() => setShowAddStaff(true)}
                className="bg-black text-white py-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Plus size={16} strokeWidth={3} />
                </div>
                <span className="font-semibold text-sm">Add Staff</span>
              </button>

              {/* NEW: Manage Team Button */}
              <button
                onClick={() => setShowManageTeam(true)}
                className="bg-white border border-gray-200 text-gray-900 py-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-900">
                  <Users size={16} strokeWidth={2} />
                </div>
                <span className="font-semibold text-sm">View Team</span>
              </button>
            </div>
          </div>
        )}

        {/* Menu Management List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: 'Geom' }} className="text-lg font-bold text-gray-900">
              Active Menu
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-1 rounded-md">
              {myDeals.length} ITEMS
            </span>
          </div>

          <div className="space-y-3">
            {myDeals.map((deal) => (
              <div 
                key={deal.id} 
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center"
              >
                {/* Image */}
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {deal.imageUrl ? (
                    <img src={deal.imageUrl} alt={deal.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    "🍱"
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 style={{ fontFamily: 'Geom' }} className="font-semibold text-gray-900 mb-1 truncate">
                    {deal.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-600">₹{deal.discountedPrice}</span>
                    <span className="text-xs text-gray-400 font-medium line-through">₹{deal.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
                   <button
                     type="button"
                     onClick={() => window.alert("Edit menu item functionality will be available soon.")}
                     className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                   >
                     <Edit2 size={16} />
                   </button>
                   <button
                     type="button"
                     onClick={() => window.alert("Delete menu item functionality will be available soon.")}
                     className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                   >
      <AnimatePresence>
        {showAddStaff && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStaff(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 style={{ fontFamily: 'Geom' }} className="text-xl font-bold text-gray-900">
                    Add Team Member
                  </h3>
                  <button 
                    onClick={() => setShowAddStaff(false)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Your Existing Form Component Goes Here */}
                <div className="p-6">
                  <AddStaffModal onClose={() => setShowAddStaff(false)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* 4. Manage Team Modal Popup */}
      <AnimatePresence>
        {showManageTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManageTeam(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Centered Modal Content */}
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <ManageTeamModal onClose={() => setShowManageTeam(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Minimalist Stat Card Component
const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
    <div className="flex justify-between items-start">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <span style={{ fontFamily: 'Geom' }} className="text-2xl font-bold text-gray-900">
      {value}
    </span>
  </div>
)

export default StaffDashboard