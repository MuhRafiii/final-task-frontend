export type AuthContextType = {
  isAuthenticated: boolean;
  role: "admin" | "user" | null;
  login: (isAuthenticated: boolean, role: "admin" | "user") => void;
  logout: () => void;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  picture: string;
};
