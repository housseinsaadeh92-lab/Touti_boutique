
export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  specs: string[];
  hidden?: boolean;
  sizes?: string[];
  stock?: {
    [size: string]: {
      total: number;
      sold: number;
    };
  };
}

export interface City {
  name: string;
  deliveryFee: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  joinedAt?: string;
}

export type OrderSource = 'website' | 'whatsapp';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Cancelled';
  source: OrderSource;
  address?: string;
}

export interface AdminSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  notificationEmail: string;
}
