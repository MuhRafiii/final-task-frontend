import { Navbar } from "@/components/Navbar";
import { api } from "@/services/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      const session = res.data.session; // { token, role }
      localStorage.setItem("session", JSON.stringify(session));

      login(true, session.role); // gunakan role dari backend
      navigate(session.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err: any) {
      console.error("Login error", err);
      setErrorMsg(err.response?.data?.message || "email atau password salah");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-sky-300">
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white dark:bg-zinc-900 p-6 rounded-md shadow space-y-4"
        >
          <h1 className="text-2xl font-bold text-center">Login</h1>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter Password"
              value={password}
              autoComplete="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <div className="flex flex-col items-center gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-sm text-center underline text-blue-700"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
