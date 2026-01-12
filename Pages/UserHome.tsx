"use client"

import React, { useState, useEffect } from "react"
import { Search, Plus, ShoppingCart, Minus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { auth } from "@/firebaseConfig"
import { initiatePayment } from "@/services/paymentService"
import { getUserMenu } from "@/services/api"

interface MenuItem {
  item_id: string
  name: string
  price: number
  description?: string
  image_url?: string
  category?: string
  is_available: boolean
}

interface Stall {
  stall_id: string
  stall_name: string
  menu_items: MenuItem[]
}

interface UserHomeProps {
  onSelectDeal?: (deal: any) => void
}

const UserHome: React.FC<UserHomeProps> = ({ onSelectDeal }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<Map<string, { item: MenuItem; stallId: string; quantity: number }>>(new Map())
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [stalls, setStalls] = useState<Stall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const menuData = await getUserMenu()
        setStalls(menuData.stalls || [])
        setError(null)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load menu")
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const addToCart = (item: MenuItem, stallId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const cartKey = `${stallId}-${item.item_id}`
    const newCart = new Map(cart)
    const existing = newCart.get(cartKey)
    if (existing) {
      newCart.set(cartKey, { ...existing, quantity: existing.quantity + 1 })
    } else {
      newCart.set(cartKey, { item, stallId, quantity: 1 })
    }
    setCart(newCart)
  }

  const removeFromCart = (item: MenuItem, stallId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const cartKey = `${stallId}-${item.item_id}`
    const newCart = new Map(cart)
    const existing = newCart.get(cartKey)
    if (existing && existing.quantity > 1) {
      newCart.set(cartKey, { ...existing, quantity: existing.quantity - 1 })
    } else {
      newCart.delete(cartKey)
    }
    setCart(newCart)
  }

  const cartTotal = Array.from(cart.values()).reduce((sum, item) => sum + item.item.price * item.quantity, 0)
  const cartItemCount = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = async () => {
    if (cart.size === 0) return
    setIsCheckingOut(true)
    try {
      const user = auth.currentUser
      if (!user) {
        alert("Please sign in to continue")
        return
      }
      const firstItem = Array.from(cart.values())[0]
      const cartItems = Array.from(cart.values()).map((item) => ({
        item_id: item.item.item_id,
        quantity: item.quantity,
      }))
      const result = await initiatePayment(cartItems, firstItem.stallId, user.email || "", user.displayName || "")
      if (result.success) {
        setCart(new Map())
        alert("✅ Payment successful!")
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col h-full bg-background items-center justify-center">
      <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
      <p className="text-muted-foreground font-semibold">Loading menu...</p>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-8 pt-4 shrink-0">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter">Market</h1>
            <p className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mt-2">Fresh Menu</p>
          </div>
          <div className="flex items-center gap-3 bg-card px-5 py-2.5 rounded-2xl border border-border shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Live</span>
          </div>
        </header>

        <div className="relative mb-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..."
            className="w-full bg-card border border-border py-6 pl-16 pr-8 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-foreground placeholder:text-muted-foreground transition-all font-bold text-base shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-40 hide-scrollbar">
        {stalls.map((stall) => (
          <section key={stall.stall_id} className="mb-14">
            <div className="px-8 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-card rounded-2xl overflow-hidden border border-border shadow-sm flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tighter leading-none mb-1">{stall.stall_name}</h2>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stall.menu_items.length} items</span>
                </div>
              </div>
            </div>

            <div className="flex gap-8 overflow-x-auto px-8 hide-scrollbar">
              {stall.menu_items.map((item) => {
                const cartKey = `${stall.stall_id}-${item.item_id}`
                const quantity = cart.get(cartKey)?.quantity || 0
                return (
                  <motion.div
                    key={item.item_id}
                    whileTap={{ scale: 0.96 }}
                    className="min-w-[300px] bg-card rounded-[3rem] overflow-hidden border border-border flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.04)]"
                  >
                    <div className="h-52 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                      <span className="text-6xl">{item.image_url || "🍽️"}</span>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h4 className="font-black text-2xl text-foreground tracking-tighter leading-tight mb-3">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{item.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-3xl font-black text-foreground tracking-tighter">₹{item.price}</span>
                        {quantity === 0 ? (
                          <button onClick={(e) => addToCart(item, stall.stall_id, e)} className="w-14 h-14 bg-foreground text-background rounded-[1.75rem] flex items-center justify-center shadow-xl active:scale-90 transition-all">
                            <Plus size={24} strokeWidth={4} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 bg-foreground rounded-[1.75rem] px-4 py-2">
                            <button onClick={(e) => removeFromCart(item, stall.stall_id, e)} className="text-background"><Minus size={18} strokeWidth={4} /></button>
                            <span className="text-background font-black text-lg">{quantity}</span>
                            <button onClick={(e) => addToCart(item, stall.stall_id, e)} className="text-background"><Plus size={18} strokeWidth={4} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {cartItemCount > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
          <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full bg-foreground text-background px-10 py-5 rounded-[2.5rem] font-black text-lg flex items-center justify-center gap-4 shadow-2xl hover:scale-105 active:scale-95 transition-all">
            <ShoppingCart size={24} strokeWidth={3} />
            <span>{cartItemCount} Items • ₹{cartTotal}</span>
            {isCheckingOut ? <Loader2 size={20} className="animate-spin" /> : <span>Checkout</span>}
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default UserHome