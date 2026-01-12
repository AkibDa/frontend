"use client"

import type React from "react"
import { useApp } from "../context/AppContext"
import { UserRole } from "../types"
import { Settings, LogOut, Shield, Globe, ChevronRight, Award, Leaf } from "lucide-react"
import { motion } from "framer-motion"
import { signOut } from "firebase/auth"
import { auth } from "@/firebaseConfig"

const Profile: React.FC = () => {
  const { userRole, resetApp } = useApp()
  const isUser = userRole === UserRole.USER

  const handleLogout = async () => {
    try {
      await signOut(auth)
      resetApp()
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="p-6 pb-32 relative z-10 bg-background">
      {/* Profile Header Section */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-[2.5rem] border-4 border-card shadow-xl overflow-hidden bg-muted">
            <img
              src={
                isUser
                  ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300"
                  : "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=300"
              }
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg border-4 border-background"
          >
            <Award size={20} />
          </motion.div>
        </div>
        <h2 className="text-3xl font-black text-foreground text-center tracking-tighter">
          {isUser ? "Alex Rivera" : "Campus Admin"}
        </h2>
        <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] mt-2">
          {isUser ? "Impact Hero" : "Sustainability Lead"}
        </p>
      </div>

      {/* Stats Card */}
      <div className="mb-8">
        <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100/70 mb-1">Saved Meals</p>
            <p className="text-5xl font-black tracking-tighter">12</p>
          </div>
          <Leaf size={80} className="text-white/10 absolute -right-4 -bottom-4 z-0 rotate-12" />
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-4">
        <MenuItem icon={<Settings size={20} />} label="Settings" color="text-blue-500" bgColor="bg-blue-500/10" />
        <MenuItem icon={<Shield size={20} />} label="Security" color="text-orange-500" bgColor="bg-orange-500/10" />
        <MenuItem icon={<Globe size={20} />} label="Language" color="text-emerald-500" bgColor="bg-emerald-500/10" />
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-10 flex items-center justify-between px-8 py-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-[2rem] border border-red-500/20 active:scale-95 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <LogOut size={22} strokeWidth={3} />
          <span className="font-black text-lg tracking-tight">Sign Out</span>
        </div>
        <ChevronRight size={20} />
      </button>

      {/* Footer */}
      <div className="mt-12 text-center text-muted-foreground/30">
        <div className="inline-flex items-center gap-2">
          <Leaf size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">GreenPlate v2.1.0</span>
        </div>
      </div>
    </div>
  )
}

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; color: string; bgColor: string }> = ({
  icon,
  label,
  color,
  bgColor,
}) => (
  <button className="w-full flex items-center justify-between px-6 py-5 bg-card border border-border rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${bgColor} ${color} rounded-2xl flex items-center justify-center`}>{icon}</div>
      <span className="font-black text-foreground text-lg tracking-tight">{label}</span>
    </div>
    <ChevronRight size={20} className="text-muted-foreground/30" />
  </button>
)

export default Profile