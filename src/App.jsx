import { Suspense, lazy, memo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import PageBackground from "./components/PageBackground"; // ✅ استيراد الخلفية

// ✅ Lazy Loading: الصفحات ما بتنزل إلا لما تحتاجها
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

/* ═══ شاشة التحميل أثناء تنقل الصفحات (Lazy Loading) ═══ */
const PageLoader = memo(function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
    </div>
  );
});

/* ═══ حماية الصفحات ═══ */
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
  return (
    <div className="relative flex min-h-screen flex-col bg-[#08080c]">
      {/* ✅ الخلفية هنا مرة وحدة */}
      <PageBackground />
      
      {/* ✅ z-10 عشان المحتوى يطلع فوق الخلفية */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
              <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
              <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
              <Route path="/reset-password" element={<GuestOnly><ResetPassword /></GuestOnly>} />

              {/* ═══ محمي (تسجيل دخول) ═══ */}
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
              <Route path="/bookings/my" element={<RequireAuth><MyBookings /></RequireAuth>} />

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