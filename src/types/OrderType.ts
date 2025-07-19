// type Cart = {
//   productName: string;
//   quantity: number;
// };

import type { CartItem } from "./CartType";

export type OrderType = {
  id: number;
  email: string;
  cart: CartItem[];
  total: number;
  createdAt: Date;
};

export type GroupedOrders = {
  email: string;
  cart: number;
  total: number;
};

export type OrderContextType = {
  createOrder: (cart: OrderType["cart"], total: number) => Promise<void>;
  orders: OrderType[];
  orderLoading: boolean;
};
