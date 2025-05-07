import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./redux/actions/authActions";
import PrivateRoute from "./components/routing/PrivateRoute";
import RoleBasedRoute from "./components/routing/RoleBasedRoute";
import "./App.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Packages from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import LeaveReview from "./pages/LeaveReview";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import UserReviews from "./pages/UserReviews";
import UserMessages from "./pages/UserMessages";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPackages from "./pages/admin/Packages";
import AdminBookings from "./pages/admin/Bookings";
import AdminUsers from "./pages/admin/Users";
import AdminPayments from "./pages/admin/Payments";
import AdminSettings from "./pages/admin/Settings";
import AdminTransactions from "./pages/admin/Transactions";
import AdminReviews from "./pages/admin/Reviews";
import AdminContacts from "./pages/admin/Contacts";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";

// Check for token on initial load and set it in axios headers
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Layout component to conditionally render Header and Footer
const AppLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

const App = () => {
  // Load user data when app starts
  useEffect(() => {
    // When the app loads, check if we have a token and try to load the user
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Auth routes without navbar/footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          {/* Public routes with navbar/footer */}
          <Route
            path="/"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/about"
            element={
              <AppLayout>
                <About />
              </AppLayout>
            }
          />
          <Route
            path="/services"
            element={
              <AppLayout>
                <Services />
              </AppLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <AppLayout>
                <Contact />
              </AppLayout>
            }
          />
          <Route
            path="/terms-conditions"
            element={
              <AppLayout>
                <TermsConditions />
              </AppLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <AppLayout>
                <PrivacyPolicy />
              </AppLayout>
            }
          />
          <Route
            path="/checkout/:id"
            element={
              <AppLayout>
                <Checkout />
              </AppLayout>
            }
          />
          <Route
            path="/payment-success"
            element={
              <AppLayout>
                <PaymentSuccess />
              </AppLayout>
            }
          />
          <Route
            path="/payment-cancel"
            element={
              <AppLayout>
                <PaymentCancel />
              </AppLayout>
            }
          />

          {/* Protected routes with navbar/footer */}
          <Route
            path="/packages"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Packages />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/packagesDetail"
            element={
              <PrivateRoute>
                <AppLayout>
                  <PackageDetail />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Bookings />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <PrivateRoute>
                <AppLayout>
                  <BookingDetail />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/leave-review"
            element={
              <PrivateRoute>
                <AppLayout>
                  <LeaveReview />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <PrivateRoute>
                <AppLayout>
                  <UserReviews />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-messages"
            element={
              <PrivateRoute>
                <AppLayout>
                  <UserMessages />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* Admin routes with sidebar layout */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminPackages />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminBookings />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminPayments />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminTransactions />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminReviews />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <RoleBasedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminContacts />
                </AdminLayout>
              </RoleBasedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
