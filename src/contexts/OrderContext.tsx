import type { OrderContextType, OrderType } from "@/types/OrderType";
import { createContext, useState } from "react";

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);

  const createOrder = async (cart: OrderType["cart"], total: number) => {
    setOrderLoading(true);
    try {
      // Simulasi request ke backend
      const newOrder: OrderType = {
        id: Date.now(),
        email: JSON.parse(localStorage.getItem("session") || "{}")?.email,
        cart,
        total,
        createdAt: new Date(),
      };

      // Contoh post ke backend: await axios.post("/api/orders", newOrder);

      setOrders((prev) => [...prev, newOrder]);
      console.log("Order saved:", newOrder);
    } catch (err) {
      console.error("Error saving order:", err);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{ createOrder, orders, orderLoading }}>
      {children}
    </OrderContext.Provider>
  );
};
