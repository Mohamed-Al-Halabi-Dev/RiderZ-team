import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, User, Ticket, ChevronDown } from "lucide-react";
import logo from "../assets/Logo/RiderZLogo.jpg";
import RiderZWord from "../assets/Logo/RiderZWord.PNG";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);           // قائمة الجوال
  const [userMenu, setUserMenu] = useState(false);   // قائمة المستخدم
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();

  const navLinks = [
    { to: "/", label: "الرئيسية" },
    { to: "/rides", label: "الجولات" },
    { to: "/Leaderboard", label: "Leaderboard" },
    { to: "/about", label: "من نحن" },
  ];

  /* ═══ قفل القوائم عند تغيّر الرابط ═══ */
  useEffect(() => {
    setOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  /* ═══ قفل الـ dropdown عند النقر برّا ═══ */
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* ═══ تسجيل الخروج ═══ */
  const handleLogout = () => {
    logout();
    setOpen(false);
    setUserMenu(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 
                       bg-[#070707]/60 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5">

        {/* ═══ الشعار ═══ */}
        <Link
          to="/"
          aria-label="الصفحة الرئيسية - RiderZ"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="شعار RiderZ"
            width={48}
            height={48}
            loading="eager"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-[#F9EA02]/30"
          />
          <img
            src={RiderZWord}
            alt="RiderZ"
            width={96}
            height={32}
            loading="eager"
            className="hidden h-7 w-auto object-contain sm:block sm:h-8"
          />
        </Link>

        {/* ═══ روابط الديسكتوب ═══ */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-colors
                 ${isActive
                   ? "text-[#F9EA02]"
                   : "text-white/80 hover:text-white hover:bg-white/5"
                 }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ═══ يمين الهيدر (ديسكتوب) ═══ */}
        <div className="hidden md:flex items-center gap-2">

          {user.isLoggedIn ? (
            /* ═══ قائمة المستخدم ═══ */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserMenu((v) => !v)}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 ps-3 pe-1.5
                           transition hover:border-[#F9EA02]/40 hover:bg-[#F9EA02]/10"
              >
                <span className="text-sm font-black text-white/90">حسابي</span>

                {/* الأيقونة الدائرية */}
                <span className="grid size-8 place-items-center rounded-full bg-[#F9EA02] text-black">
                  <User size={16} strokeWidth={2.5} />
                </span>

                <ChevronDown
                  size={14}
                  strokeWidth={2.5}
                  className={`text-white/50 transition-transform ${userMenu ? "rotate-180" : ""}`}
                />
              </button>

              {/* ═══ القائمة المنسدلة ═══ */}
              {userMenu && (
                <div className="absolute end-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl shadow-black/50 backdrop-blur-md">

                  {/* حسابي */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-[#F9EA02]"
                  >
                    <User size={15} strokeWidth={2.5} />
                    حسابي
                  </Link>

                  {/* حجوزاتي */}
                  <Link
                    to="/bookings/my"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-[#F9EA02]"
                  >
                    <Ticket size={15} strokeWidth={2.5} />
                    حجوزاتي
                  </Link>

                  {/* لوحة التحكم — للأدمن فقط */}
                  {user.role === "Admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-[#F9EA02]"
                    >
                      <LayoutDashboard size={15} strokeWidth={2.5} />
                      لوحة التحكم
                    </Link>
                  )}

                  <div className="border-t border-white/5" />

                  {/* تسجيل الخروج */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-start text-sm font-bold text-rose-300 transition hover:bg-rose-500/10"
                  >
                    <LogOut size={15} strokeWidth={2.5} />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ═══ زر الانضمام ═══ */
            <Link to="/Login">
              <button
                type="button"
                className="rounded-full bg-[#F9EA02] px-5 lg:px-6 py-2 text-sm lg:text-base font-bold text-[#0B0B0B]
                           transition-all duration-200 hover:bg-[#ffe93a] hover:shadow-[0_0_20px_rgba(249,234,2,0.45)] active:scale-95"
              >
                انضم الآن
              </button>
            </Link>
          )}
        </div>

        {/* ═══ زر الجوال ═══ */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ═══ قائمة الجوال ═══ */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden border-t border-white/10 bg-[#070707]/95 backdrop-blur-md
                    transition-[max-height,opacity] duration-300 ease-in-out
                    ${open ? "max-h-[40rem] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-base font-medium transition-colors
                 ${isActive
                   ? "bg-[#F9EA02]/10 text-[#F9EA02]"
                   : "text-white/85 hover:bg-white/5 hover:text-white"
                 }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="my-2 h-px bg-white/5" />

          {user.isLoggedIn ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-white/85 transition hover:bg-white/5 hover:text-[#F9EA02]"
              >
                <User size={18} strokeWidth={2.5} />
                حسابي
              </Link>

              <Link
                to="/bookings/my"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-white/85 transition hover:bg-white/5 hover:text-[#F9EA02]"
              >
                <Ticket size={18} strokeWidth={2.5} />
                حجوزاتي
              </Link>

              {user.role === "Admin" && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-[#F9EA02] transition hover:bg-[#F9EA02]/10"
                >
                  <LayoutDashboard size={18} strokeWidth={2.5} />
                  لوحة التحكم
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-start text-base font-medium text-rose-300 transition hover:bg-rose-500/10"
              >
                <LogOut size={18} strokeWidth={2.5} />
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link to="/Login" onClick={() => setOpen(false)} className="mt-2">
              <button
                type="button"
                className="w-full rounded-full bg-[#F9EA02] px-5 py-3 text-base font-bold text-[#0B0B0B]
                           transition-all hover:bg-[#ffe93a] active:scale-[0.98]"
              >
                انضم الآن
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}