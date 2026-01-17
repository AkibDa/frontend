import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { UserRole, AppState, FoodDeal, Order, Cafeteria } from '../types';
import { INITIAL_DEALS, INITIAL_CAFETERIAS } from '../constants';
import { auth } from '@/firebaseConfig';

type StaffProfile = {
  role:"manager" | "staff";
  stallId: string;
  email: string;
}

interface AppContextType extends AppState {
  setUserRole: (role: UserRole | null) => void;
  setOnboarded: (val: boolean) => void;
  setVerified: (val: boolean) => void;
  staffProfile: StaffProfile | null; //this is the new staff rbac
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

  // const claimDeal = (dealId: string) => {
  //   let claimedDeal: FoodDeal | undefined;

  //   setDeals(prevDeals =>
  //     prevDeals.map(d => {
  //       if (d.id === dealId && d.quantity > 0) {
  //         claimedDeal = { ...d };
  //         return {
  //           ...d,
  //           isClaimed: true,
  //           quantity: Math.max(0, d.quantity - 1),
  //         };
  //       }
  //       return d;
  //     })
  //   );

  //   if (!claimedDeal) return;

  //   const newOrder: Order = {
  //     id: Math.random().toString(36).substring(2, 11),
  //     dealId: claimedDeal.id,
  //     foodName: claimedDeal.name,
  //     cafeteriaName: claimedDeal.cafeteriaName,
  //     status: 'Reserved',
  //     timestamp: Date.now(),
  //     qrCode: 'GP-' + Math.floor(1000 + Math.random() * 9000),
  //   };

  //   setOrders(prev => [newOrder, ...prev]);
  // };
  const loadOrders = useCallback(async () => {
    if (userRole !== UserRole.USER) return; // 🔒 HARD STOP

    try {
      const token = await auth.currentUser?.getIdToken(true);
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
      
      // 🔍 Debugging: Check what the backend is actually sending
      console.log("API Response for Orders:", data);

      // 🛡️ FIX: Handle different response structures safely
      if (data && typeof data === "object" && "orders" in data && Array.isArray((data as any).orders)) {
        setOrders((data as any).orders); // Case 1: Backend returns { orders: [...] }
      } else if (Array.isArray(data)) {
        setOrders(data);                 // Case 2: Backend returns [...] (Direct array)
      } else {
        console.warn("Unexpected orders format, defaulting to empty list");
        setOrders([]);                   // Fallback to prevent crash
      }

    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]); // Ensure app doesn't crash on error
    }
  }, [userRole]);

  const addDeal = (dealData: Omit<FoodDeal, 'id' | 'isClaimed'>) => {
    const newDeal: FoodDeal = {
      ...dealData,
      id: Math.random().toString(36).substring(2, 11),
      isClaimed: false,
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  // const acceptOrder = (orderId: string) => {
  //   setOrders(prev =>
  //     prev.map(o =>
  //       o.id === orderId ? { ...o, status: 'Claimed' } : o
  //     )
  //   );
  // };

  // const markAsReady = (orderId: string) => {
  //   setOrders(prev =>
  //     prev.map(o =>
  //       o.id === orderId ? { ...o, status: 'Ready' } : o
  //     )
  //   );
  // };

  // const markAsPickedUp = (orderId: string) => {
  //   setOrders(prev =>
  //     prev.map(o =>
  //       o.id === orderId ? { ...o, status: 'Completed' } : o
  //     )
  //   );
  // };

  const toggleCafeteriaStatus = (id: string) => {
    setCafeterias(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isOpen: !c.isOpen } : c
      )
    );
  };

  //on logout
  const resetApp = () => {
    setUserRole(null);
    setStaffProfile(null);
    setOnboarded(false);
    setVerified(false);
    setDeals(INITIAL_DEALS);
    setOrders([]);
  };

useEffect(() => {
  const unsub = auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    await user.getIdToken(true);

    // Only students load orders
    if (userRole === UserRole.USER) {
      loadOrders();
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
        // claimDeal,
        addDeal,
        // acceptOrder,
        // markAsReady,
        // markAsPickedUp,
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

