import type { AuthContextType } from "@/types/AuthContextType";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
});
