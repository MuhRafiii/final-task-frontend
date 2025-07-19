import type { CartItem } from "@/types/CartType";
import { useState } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [idCounter, setIdCounter] = useState(1);

  const addItem = (item: CartItem) => {
    setCartLoading(true);
    const newItem = { ...item, id: idCounter };
    setCart((prev) => [newItem, ...prev]);
    setIdCounter((prev) => prev + 1);
    setTimeout(() => {
      setCartLoading(false);
    }, 200);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartLoading(true);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    setTimeout(() => {
      setCartLoading(false);
    }, 300);
  };

  const removeItem = (id: number) => {
    setCartLoading(true);
    setCart((prev) => prev.filter((item) => item.id !== id));
    setTimeout(() => {
      setCartLoading(false);
    }, 500);
  };

  const clearCart = () => {
    setCartLoading(true);
    setCart([]);
    setTimeout(() => {
      setCartLoading(false);
    }, 500);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        idCounter,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
