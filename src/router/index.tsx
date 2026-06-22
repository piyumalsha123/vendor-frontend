import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./RequireAuth"; 
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VendorDashboard from "../pages/VendorDashboard";
import ProductList from "../pages/ProductList";
import OrderList from "../pages/OrderList";
import CustomerDashboard from "../pages/CustomerDashboard";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import MyOrders from "../pages/Myorders";
import StorePage from "../pages/StorePage";
import Profile from "../pages/Profile";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <RequireAuth roles={["VENDOR"]}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<OrderList />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/customer"
          element={
            <RequireAuth roles={["VENDOR", "CUSTOMER", "USER"]}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<CustomerDashboard />} /> 
          <Route path="cart" element={<Cart />} /> 
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="profile" element={<Profile />} />
        </Route> 

<Route path="/store/:vendorId" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;