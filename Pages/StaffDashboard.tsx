// Pages/StaffDashboard.tsx
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

const StaffDashboard: React.FC = () => {
  const [backendOrders, setBackendOrders] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<BackendMenuItem[]>([])
  const [isMenuLoading, setIsMenuLoading] = useState(true)
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [showManageTeam, setShowManageTeam] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const {
    cafeterias,
    managedCafeteriaId,
    staffProfile,
    toggleCafeteriaStatus,
  } = useApp()

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

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!window.confirm(`Delete "${itemName}"?`)) return
    try {
      setIsDeleting(itemId)
      await deleteMenuItem(itemId)
      setMenuItems((prev) =>
        prev.filter((item) => item.item_id !== itemId)
      )
    } catch {
      alert("Delete failed.")
    } finally {
      setIsDeleting(null)
    }
  }

  if (!staffProfile)
    return <div className="p-10 text-center">Loading...</div>

  const myCafe =
    cafeterias.find((c) => c.id === managedCafeteriaId) || cafeterias[0]

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100 flex justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">
            Control Panel
          </p>
          <h1 className="text-3xl font-bold">{myCafe.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`w-2 h-2 rounded-full ${
                myCafe.isOpen ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-500">
              {myCafe.isOpen ? "Store is Live" : "Store is Closed"}
            </span>
          </div>
        </div>

        <button
          onClick={() => toggleCafeteriaStatus(myCafe.id)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            myCafe.isOpen
              ? "bg-emerald-50 text-emerald-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <Power size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Total Orders"
            value={backendOrders.length.toString()}
            icon={<Activity size={18} />}
          />
          <StatCard
            label="Active Menu"
            value={menuItems.length.toString()}
            icon={<Package size={18} />}
          />
          <StatCard
            label="Rating"
            value={myCafe.rating.toString()}
            icon={<Star size={18} />}
          />
          <StatCard
            label="Revenue"
            value="Coming Soon"
            icon={<TrendingUp size={18} />}
          />
        </div>

        {/* Staff actions */}
        {staffProfile.role === "manager" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Staff Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowAddStaff(true)}
                className="bg-black text-white py-4 rounded-xl flex flex-col items-center gap-2"
              >
                <Plus size={16} />
                Add Staff
              </button>
              <button
                onClick={() => setShowManageTeam(true)}
                className="bg-white border py-4 rounded-xl flex flex-col items-center gap-2"
              >
                <Users size={16} />
                View Team
              </button>
            </div>
          </div>
        )}

        {/* Menu */}
        <div>
          <h3 className="text-lg font-bold mb-4">Active Menu</h3>
          {isMenuLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div key={item.item_id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                    {item.image_ref ? (
                      <img
                        src={getMenuImage(item.image_ref)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "🍱"
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 style={{ fontFamily: 'Geom' }} className="font-semibold text-gray-900 mb-0.5 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 truncate mb-1">{item.description}</p>
                    <span className="text-sm font-bold text-emerald-600">₹{item.price}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="p-2 bg-gray-50 rounded">
                      <Edit2 size={14} />
                    </button>
                    <button
                      disabled={isDeleting === item.item_id}
                      onClick={() =>
                        handleDeleteItem(item.item_id, item.name)
                      }
                      className="p-2 bg-gray-50 rounded"
                    >
                      {isDeleting === item.item_id ? "…" : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              ))}
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
      </AnimatePresence>
    </div>
  )
}

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <motion.div
      className="absolute inset-0 bg-black/40"
      onClick={onClose}
    />
    <motion.div className="relative bg-white rounded-3xl p-6 z-10">
      <button onClick={onClose} className="absolute top-4 right-4">
        <X size={16} />
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
  <div className="bg-white p-4 rounded-2xl shadow-sm h-28 flex flex-col justify-between">
    <div className="flex justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      {icon}
    </div>
    <span className="text-2xl font-bold">{value}</span>
  </div>
)

export default StaffDashboard
