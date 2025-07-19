import type { AuthContextType } from "@/types/AuthContextType";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (session?.token && session?.role) {
      setIsAuthenticated(true);
      setRole(session.role);
    }
  }, []);

  const login = (auth: boolean, userRole: "admin" | "user") => {
    setIsAuthenticated(auth);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("session");
    setIsAuthenticated(false);
    setRole(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    role,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
