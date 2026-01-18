
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';

import { UserRole, AppState, FoodDeal, Order, Cafeteria } from '../types';
import { INITIAL_DEALS, INITIAL_CAFETERIAS } from '../constants';
import { auth } from '@/firebaseConfig';

type StaffProfile = {
  role: "manager" | "staff";
  stallId: string;
  stallName: string;
  email: string;
}

interface AppContextType extends AppState {
  setUserRole: (role: UserRole | null) => void;
  setOnboarded: (val: boolean) => void;
  setVerified: (val: boolean) => void;
  staffProfile: StaffProfile | null;
  setStaffProfile: (p: StaffProfile | null) => void;
  addDeal: (deal: Omit<FoodDeal, 'id' | 'isClaimed'>) => void;
  toggleCafeteriaStatus: (id: string) => void;
  loadOrders: () => Promise<void>;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);

  const managedCafeteriaId = 'cafe-1';

  const [cafeterias, setCafeterias] = useState<Cafeteria[]>(INITIAL_CAFETERIAS);
  const [deals, setDeals] = useState<FoodDeal[]>(INITIAL_DEALS);
  const [orders, setOrders] = useState<Order[]>([]);

  // ------------------------------------------------------------------
  // 🛠️ HELPER: Standardized Authenticated Fetch
  // This handles the Token logic, 401 errors, and Retries automatically.
  // ------------------------------------------------------------------
  const apiFetch = useCallback(async (endpoint: string) => {
    if (!auth.currentUser) throw new Error("No user logged in");

    // 1. Get cached token (fast)
    let token = await auth.currentUser.getIdToken();
    
    let res = await fetch(`http://localhost:8000${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2. If 401 Unauthorized, force refresh token and retry ONCE
    if (res.status === 401) {
      console.warn(`401 on ${endpoint} - Refreshing token and retrying...`);
      token = await auth.currentUser.getIdToken(true); // Force Refresh
      
      res = await fetch(`http://localhost:8000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (!res.ok) throw new Error(`Request to ${endpoint} failed with ${res.status}`);
    
    return res.json();
  }, []);

  // ------------------------------------------------------------------
  // 🔄 Load Orders using the Helper
  // ------------------------------------------------------------------
  const loadOrders = useCallback(async () => {
    if (userRole !== UserRole.USER || !auth.currentUser) return;

    try {
      const data = await apiFetch("/user/orders");

      // Handle different response formats safely
      if (data && typeof data === "object" && "orders" in data && Array.isArray((data as any).orders)) {
        setOrders((data as any).orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  }, [userRole, apiFetch]);


  const addDeal = (dealData: Omit<FoodDeal, 'id' | 'isClaimed'>) => {
    const newDeal: FoodDeal = {
      ...dealData,
      id: Math.random().toString(36).substring(2, 11),
      isClaimed: false,
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  const toggleCafeteriaStatus = (id: string) => {
    setCafeterias(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isOpen: !c.isOpen } : c
      )
    );
  };

  const resetApp = () => {
    setUserRole(null);
    setStaffProfile(null);
    setOnboarded(false);
    setVerified(false);
    setDeals(INITIAL_DEALS);
    setOrders([]);
  };


  // ------------------------------------------------------------------
  // 🔄 useEffect: Listens for Auth Changes
  // ------------------------------------------------------------------
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        if (userRole === UserRole.USER) {
          loadOrders();
        }
      } else {
        setOrders([]); // Clear data on logout
      }
    });

    return () => unsub();
  }, [userRole, loadOrders]);


  return (
    <AppContext.Provider
      value={{
        userRole,
        onboarded,
        isVerified,
        staffProfile,
        setStaffProfile,
        managedCafeteriaId,
        cafeterias,
        deals,
        orders,
        loadOrders,
        setUserRole,
        setOnboarded,
        setVerified,
        addDeal,
        toggleCafeteriaStatus,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};