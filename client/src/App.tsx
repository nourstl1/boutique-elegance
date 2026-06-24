import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Store from "./pages/Store"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import OrderConfirmed from "./pages/OrderConfirmed"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Account from "./pages/Account"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminOrders from "./pages/admin/AdminOrders"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="store" element={<Store />} />
        <Route path="products/:handle" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order/confirmed" element={<OrderConfirmed />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/products"
          element={
            <ProtectedRoute admin>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/orders"
          element={
            <ProtectedRoute admin>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
