
export enum UserRole {
  USER = 'USER',
  STAFF = 'STAFF'
}

export interface NutritionalInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Cafeteria {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  isOpen: boolean;
  rating: number;
  busyLevel: 'Quiet' | 'Moderate' | 'Busy';
}

export interface FoodDeal {
  id: string;
  cafeteriaId: string;
  name: string;
  description: string;
  ingredients: string[];
  nutritionalInfo?: NutritionalInfo;
  carbonSavedKg: number;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  timeLeftMinutes: number;
  cafeteriaName: string;
  distance: string;
  imageUrl: string;
  isClaimed: boolean;
  tags: string[];
}

export interface Order {
  id: string;
  dealId: string;
  foodName: string;
  cafeteriaName: string;
  status: 'Reserved' | 'Claimed' | 'Ready' | 'Completed';
  timestamp: number;
  qrCode: string;
}

export interface AppState {
  userRole: UserRole | null;
  onboarded: boolean;
  isVerified: boolean;
  managedCafeteriaId: string;
  cafeterias: Cafeteria[];
  deals: FoodDeal[];
  orders: Order[];
}
