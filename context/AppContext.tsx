import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, AppState, FoodDeal, Order, Cafeteria } from '../types';
import { INITIAL_DEALS, INITIAL_CAFETERIAS } from '../constants';
import { auth } from '@/firebaseConfig';


interface AppContextType extends AppState {
  setUserRole: (role: UserRole | null) => void;
  setOnboarded: (val: boolean) => void;
  setVerified: (val: boolean) => void;
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
  const loadOrders = async () => {
    try{
      const token = await auth.currentUser?.getIdToken();
      if(!token)return;

      const res = await fetch("http://localhost:8000/user/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if(!res.ok){
      throw new Error("Failed to fetch orders")
    }
    const orders: Order[] = await res.json();
    setOrders(orders);
    }
    catch(err){
      console.error("Failed to load orders",err);
    }
  }

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

  const resetApp = () => {
    setUserRole(null);
    setOnboarded(false);
    setVerified(false);
    setDeals(INITIAL_DEALS);
    setOrders([]);
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if(user){
        loadOrders()
      }
    })
    return () => unsub();
  },[])

  return (
    <AppContext.Provider
      value={{
        userRole,
        onboarded,
        isVerified,
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

