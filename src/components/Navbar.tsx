import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/lib/ThemeToggle";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="w-full flex flex-wrap p-4 justify-between border-b mb-4 bg-white dark:bg-zinc-900">
      {isAuthenticated && (
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/">Dashboard</Link>
          </Button>
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
        </div>
      )}

      <div className="flex gap-4">
        {isAuthenticated ? (
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex items-end">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" className="flex items-end">
              <Link to="/register">Register</Link>
            </Button>
          </div>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
