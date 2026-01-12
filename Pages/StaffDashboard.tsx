"use client"

import React from "react"
import { useApp } from "../context/AppContext"
import { TrendingUp, Users, Package, Clock, Edit3, Power, Star, Eye, Zap, Sparkles, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

const StaffDashboard: React.FC = () => {
  const { deals, orders, cafeterias, managedCafeteriaId, toggleCafeteriaStatus } = useApp()
  const myCafe = cafeterias.find((c) => c.id === managedCafeteriaId) || cafeterias[0]
  const myDeals = deals.filter((d) => d.cafeteriaId === myCafe.id && !d.isClaimed)
  const completedCount = orders.filter((o) => o.cafeteriaName === myCafe.name && o.status === "Completed").length

  return (
    <div className="p-6 pt-2 h-full overflow-y-auto hide-scrollbar pb-32 bg-background">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Hub Command</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Terminal:</span>
            <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">{myCafe.name}</span>
          </div>
        </div>
        <button onClick={() => toggleCafeteriaStatus(myCafe.id)} className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${myCafe.isOpen ? "bg-emerald-600 text-white shadow-emerald-200" : "bg-muted text-muted-foreground"}`}>
          <Power size={24} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <StatCard label="Claims Today" value={completedCount.toString()} trend="High" icon={<Users className="text-emerald-600" size={20} />} color="bg-emerald-50" />
        <StatCard label="Active Items" value={myDeals.length.toString()} trend="Live" icon={<Package className="text-blue-600" size={20} />} color="bg-blue-50" />
        <StatCard label="Review Score" value={myCafe.rating.toString()} trend="98%" icon={<Star className="text-orange-600" size={20} />} color="bg-orange-50" />
        <StatCard label="Uptime Today" value="100%" trend="Optimal" icon={<Zap className="text-purple-600" size={20} />} color="bg-purple-50" />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-foreground tracking-tight">Broadcast Control</h2>
        <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-200 flex items-center gap-1.5">
          <Sparkles size={10} /> Gemini AI Verified
        </div>
      </div>

      <div className="space-y-8">
        {myDeals.map((deal) => (
          <motion.div key={deal.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-[3.5rem] border border-border shadow-sm overflow-hidden group hover:shadow-lg transition-all">
            <div className="p-6 flex items-start gap-6">
              <div className="relative shrink-0 mt-1">
                <img src={deal.imageUrl || "/placeholder.svg"} className="w-28 h-28 rounded-[2.5rem] object-cover border-4 border-card group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="absolute -bottom-2 -right-2 bg-foreground text-background w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[14px] border-4 border-card shadow-lg">{deal.quantity}x</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-black text-2xl text-foreground leading-none tracking-tighter mb-1">{deal.name}</h4>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{deal.tags.join(" • ")}</span>
                  </div>
                  <div className="bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                    <Clock size={12} className="text-orange-600 animate-pulse" />
                    <span className="text-[10px] font-black text-orange-600 uppercase">{deal.timeLeftMinutes}m</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/50 mt-4">
                  <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
                </div>
              </div>
            </div>
            <div className="bg-muted/40 p-6 px-10 flex justify-between items-center border-t border-border">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Calories</span>
                  <span className="text-sm font-black text-foreground tracking-tighter">{deal.nutritionalInfo?.calories} kcal</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Revenue</span>
                  <span className="text-sm font-black text-foreground tracking-tighter">₹{deal.discountedPrice}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-4 bg-background rounded-2xl shadow-sm border border-border text-muted-foreground hover:text-blue-600 transition-all"><Edit3 size={20} /></button>
                <button className="p-4 bg-background rounded-2xl shadow-sm border border-border text-red-400 hover:bg-red-50 transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string; trend: string }> = ({ label, value, icon, color, trend }) => (
  <div className="bg-card p-7 rounded-[3rem] border border-border shadow-sm relative group hover:shadow-xl transition-all duration-500">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 group-hover:rotate-12`}>{icon}</div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-3xl font-black text-foreground tracking-tighter leading-none">{value}</p>
      </div>
      <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{trend}</span>
      </div>
    </div>
  </div>
)

export default StaffDashboard