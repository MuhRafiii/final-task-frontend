import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    isAuthenticated: context.isAuthenticated,
    role: context.role,
    login: context.login,
    logout: context.logout,
  };
};
