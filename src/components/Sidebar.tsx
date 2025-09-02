import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-3">
        <Link to="/admin/dashboard" className="block hover:text-gray-300">
          Dashboard
        </Link>
        <Link to="/admin/products" className="block hover:text-gray-300">
          Products
        </Link>
        <Link to="/admin/orders" className="block hover:text-gray-300">
          Orders
        </Link>
      </nav>
      <Button variant="destructive" onClick={logout} className="w-full">
        Logout
      </Button>
    </aside>
  );
}
