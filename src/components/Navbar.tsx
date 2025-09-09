import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/lib/ThemeToggle";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="w-full flex flex-wrap p-4 justify-between mb-4 bg-sky-50 dark:bg-zinc-900 shadow-lg">
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/">Home</Link>
        </Button>
        {isAuthenticated && (
          <>
            {/* <Button asChild variant="outline">
              <Link to="/dashboard">Dashboard</Link>
            </Button> */}
            <Button asChild variant="outline">
              <Link to="/products">Products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/cart">Cart</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/orders">Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/transfer-point">Transfer Point</Link>
            </Button>
          </>
        )}
      </div>

      <div className="flex gap-4">
        {isAuthenticated ? (
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        ) : (
          <>
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
