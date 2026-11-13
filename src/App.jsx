import { Suspense, lazy, memo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import PageBackground from "./components/PageBackground";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Rides = lazy(() => import("./pages/Rides"));
const RideDetails = lazy(() => import("./pages/RideDetails"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminRides = lazy(() => import("./pages/AdminRides"));
const AdminRideForm = lazy(() => import("./pages/AdminRideForm"));
const AdminRideDetails = lazy(() => import("./pages/AdminRideDetails"));
const AdminBookings = lazy(() => import("./pages/AdminBookings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

const PageLoader = memo(function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
    </div>
  );
});

// ✅ شاشة تحميل كاملة (تظهر لحظة ما التطبيق يطلب Refresh Token من الكوكي)
const FullPageLoader = memo(function FullPageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#08080c]">
      <div className="flex flex-col items-center gap-3">
        <span className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
        <span className="text-xs font-bold text-white/40">جارٍ التحميل...</span>
      </div>
    </div>
  );
});

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

function GuestOnly({ children }) {
  const { user } = useAuth();
  if (user.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppLayout() {
  // ✅ نستنى الـ bootstrapping يخلص قبل ما نعرض أي شي
  // عشان نمنع وميض "غير مسجل دخول" لحظة فتح الموقع
  const { bootstrapping } = useAuth();

  if (bootstrapping) {
    return <FullPageLoader />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#08080c]">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <ScrollToTop />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/rides" element={<Rides />} />
              <Route path="/rides/:id" element={<RideDetails />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/leaderboard/:username" element={<PublicProfile />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
              <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
              <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
              <Route path="/reset-password" element={<GuestOnly><ResetPassword /></GuestOnly>} />

              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
              <Route path="/bookings/my" element={<RequireAuth><MyBookings /></RequireAuth>} />

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/rides" element={<AdminRides />} />
                <Route path="/admin/rides/add" element={<AdminRideForm />} />
                <Route path="/admin/rides/edit/:id" element={<AdminRideForm />} />
                <Route path="/admin/rides/:id" element={<AdminRideDetails />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
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