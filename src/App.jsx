import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./Components/User/Layout";
import Home from "./Pages/User/Home";
import Marketplace from "./Pages/User/Marketplace";
import Artisans from "./Pages/User/Artisans";
import Login from "./Pages/User/Login";
import Signup from "./Pages/User/Signup";
import VendorSignup from "./Pages/Vendor/VendorSignup";
import VendorLayout from "./Components/Vendor/Layout";
import Dashboard from "./Pages/Vendor/Dashboard";
import Product from "./Pages/Vendor/Product";
import Order from "./Pages/Vendor/Order";
import PaymentManagement from "./Pages/Vendor/PaymentManagement";
import Settings from "./Pages/Vendor/Settings";
import AdminLayout from "./Components/Admin/AdminLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminDashboard from "./Pages/Admin/Dashboard";
import UserManagement from "./Pages/Admin/UserManagement";
import VendorManagement from "./Pages/Admin/VendorManagement";
import ArtistManagement from "./Pages/Admin/ArtistManagement";
import AddCategory from "./Pages/Admin/AddCategory";
import Trending from "./Pages/Admin/Trending";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="artisans" element={<Artisans />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={["ROLE_VENDOR"]}>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="product" element={<Product />} />
            <Route path="order" element={<Order />} />
            <Route path="payment" element={<PaymentManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="vendors" element={<VendorManagement />} />
            <Route path="artists" element={<ArtistManagement />} />
            <Route path="category" element={<AddCategory />} />
            <Route path="trending" element={<Trending />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="!font-sans !text-sm"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
