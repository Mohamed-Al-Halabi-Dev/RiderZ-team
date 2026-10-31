import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Rides from "./pages/Rides";
import RideDetails from "./pages/RideDetails";
import Leaderboard from "./pages/Leaderboard";
import PublicProfile from "./pages/PublicProfile";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRides from "./pages/AdminRides";
import AdminRideForm from "./pages/AdminRideForm";
import AdminRideDetails from "./pages/AdminRideDetails";
import AdminBookings from "./pages/AdminBookings";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

/* ═══ حماية الصفحات اللي تحتاج تسجيل دخول ═══ */
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user.isLoggedIn) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }
  return children;
}

/* ═══ صفحات الضيف فقط (مسجل دخول ما بيفتحها) ═══ */
function GuestOnly({ children }) {
  const { user } = useAuth();
  if (user.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#08080c]">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* ═══ عام ═══ */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/rides/:id" element={<RideDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/leaderboard/:username" element={<PublicProfile />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ═══ ضيف فقط ═══ */}
          <Route
            path="/login"
            element={
              <GuestOnly>
                <Login />
              </GuestOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestOnly>
                <SignUp />
              </GuestOnly>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestOnly>
                <ForgotPassword />
              </GuestOnly>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestOnly>
                <ResetPassword />
              </GuestOnly>
            }
          />

          {/* ═══ محمي (تسجيل دخول) ═══ */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/bookings/my"
            element={
              <RequireAuth>
                <MyBookings />
              </RequireAuth>
            }
          />

          {/* ═══ أدمن / مشرف ═══ */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/rides" element={<AdminRides />} />
            <Route path="/admin/rides/add" element={<AdminRideForm />} />
            <Route path="/admin/rides/edit/:id" element={<AdminRideForm />} />
            <Route path="/admin/rides/:id" element={<AdminRideDetails />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
          </Route>

          {/* ═══ 404 ═══ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}