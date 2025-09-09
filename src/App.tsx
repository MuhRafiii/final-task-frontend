import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { CartProvider } from "./contexts/CartProvider";
import { OrderProvider } from "./contexts/OrderContext";
import PrivateRoute from "./lib/PrivateRoute";
import AddProduct from "./pages/admin/AddProduct";
import AdminDashboard from "./pages/admin/Dashboard";
import DeletedProducts from "./pages/admin/DeletedProducts";
import AdminOrders from "./pages/admin/Orders";
import { OrdersByUser } from "./pages/admin/OrdersGroupBy";
import AdminProducts from "./pages/admin/Products";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import { Cart } from "./pages/user/Cart";
import { Dashboard } from "./pages/user/Dashboard";
import { Orders } from "./pages/user/Orders";
import Products from "./pages/user/Products";
import { TransferPoints } from "./pages/user/TransferPoint";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />

              {/* Auth Routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminProducts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/product/add"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AddProduct />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/products/deleted"
                element={
                  <PrivateRoute requiredRole="admin">
                    <DeletedProducts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminOrders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/orders/group-by-user"
                element={
                  <PrivateRoute requiredRole="admin">
                    <OrdersByUser />
                  </PrivateRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute requiredRole="user">
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/products"
                element={
                  <PrivateRoute requiredRole="user">
                    <Products />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <PrivateRoute requiredRole="user">
                    <Cart />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute requiredRole="user">
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transfer-point"
                element={
                  <PrivateRoute requiredRole="user">
                    <TransferPoints />
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
