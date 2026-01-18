import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { UserRole, AppState, FoodDeal, Order, Cafeteria } from '../types';
import { INITIAL_DEALS, INITIAL_CAFETERIAS } from '../constants';
import { auth } from '@/firebaseConfig';

type StaffProfile = {
  role: "manager" | "staff";
  stallId: string;
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
  loadOrders: () => Promise<void>
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

  // ✅ FIX 1: Wrap loadOrders in useCallback to prevent infinite loop
  const loadOrders = useCallback(async () => {
    if (userRole !== UserRole.USER) return;

    try {
      // ✅ FIX 2: Removed 'true' (forceRefresh). Only refresh if expired.
      const token = await auth.currentUser?.getIdToken(); 
      if (!token) return;

      const res = await fetch("http://localhost:8000/user/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      
      if (data && typeof data === "object" && "orders" in data && Array.isArray((data as any).orders)) {
        setOrders((data as any).orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }

    } catch (err) {
      console.error("Failed to load orders", err);
      // setOrders([]); // Optional: clear orders on error
    }
  }, [userRole]); // Dependency: Only recreate if userRole changes

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

  // ✅ FIX 3: Simplified useEffect. 
  // We don't need onAuthStateChanged here if we just want to load data when role exists.
  useEffect(() => {
    if (userRole === UserRole.USER) {
      loadOrders();
    }
  }, [userRole, loadOrders]);

  // Keep a separate listener for Auth state persistence if needed, 
  // but don't mix it with data loading loops.
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Handle logout cleanup if necessary
      }
    });
    return () => unsub();
  }, []);

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