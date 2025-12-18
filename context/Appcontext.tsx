
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, AppState, FoodDeal, Order, Cafeteria } from '../types';
import { INITIAL_DEALS, INITIAL_CAFETERIAS } from '../constants';

interface AppContextType extends AppState {
  setUserRole: (role: UserRole | null) => void;
  setOnboarded: (val: boolean) => void;
  setVerified: (val: boolean) => void;
  claimDeal: (dealId: string) => void;
  addDeal: (deal: Omit<FoodDeal, 'id' | 'isClaimed'>) => void;
  acceptOrder: (orderId: string) => void;
  markAsReady: (orderId: string) => void;
  markAsPickedUp: (orderId: string) => void;
  toggleCafeteriaStatus: (id: string) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [managedCafeteriaId, setManagedCafeteriaId] = useState('cafe-1'); // Default for demo
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>(INITIAL_CAFETERIAS);
  const [deals, setDeals] = useState<FoodDeal[]>(INITIAL_DEALS);
  const [orders, setOrders] = useState<Order[]>([]);

  const claimDeal = (dealId: string) => {
    setDeals(prevDeals => prevDeals.map(d => 
      d.id === dealId ? { ...d, isClaimed: true, quantity: Math.max(0, d.quantity - 1) } : d
    ));
    
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        dealId: deal.id,
        foodName: deal.name,
        cafeteriaName: deal.cafeteriaName,
        status: 'Reserved',
        timestamp: Date.now(),
        qrCode: 'GP-' + Math.floor(1000 + Math.random() * 9000)
      };
      setOrders(prev => [newOrder, ...prev]);
    }
  };

  const addDeal = (dealData: Omit<FoodDeal, 'id' | 'isClaimed'>) => {
    const newDeal: FoodDeal = {
      ...dealData,
      id: Math.random().toString(36).substr(2, 9),
      isClaimed: false
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  const acceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Claimed' } : o));
  };

  const markAsReady = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Ready' } : o));
  };

  const markAsPickedUp = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Completed' } : o));
  };

  const toggleCafeteriaStatus = (id: string) => {
    setCafeterias(prev => prev.map(c => c.id === id ? { ...c, isOpen: !c.isOpen } : c));
  };

  const resetApp = () => {
    setUserRole(null);
    setOnboarded(false);
    setVerified(false);
    setDeals(INITIAL_DEALS);
    setOrders([]);
  };

  return (
    <AppContext.Provider value={{ 
      userRole, onboarded, isVerified, managedCafeteriaId, cafeterias, deals, orders, 
      setUserRole, setOnboarded, setVerified, claimDeal, addDeal, acceptOrder, markAsReady, markAsPickedUp, toggleCafeteriaStatus, resetApp 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
