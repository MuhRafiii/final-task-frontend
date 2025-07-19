import type { CartContextType } from "@/types/CartType";
import { createContext } from "react";

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
