import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";
import {
  Mail, Phone, Bike as BikeIcon, Shield, LogOut,
  Route as RouteIcon, Edit3,
  LayoutDashboard, AlertTriangle, Calendar, ExternalLink, User, Plus, X,
} from "lucide-react";
import { getLevel } from "../constants/levels";
import Seo from "../components/Seo";

const IconInstagram = ({ size = 16, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const IconFacebook = ({ size = 16, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const glass = "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";

const fixUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("/")) return `${import.meta.env.VITE_API_URL || ""}${url}`;
  return url;
};

const buildSocialUrl = (value, baseUrl) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "").replace(/^\/+/, "");
  return `${baseUrl}/${handle}`;
};

const extractHandle = (value) => {
  if (!value) return null;
  let v = String(value).trim();
  if (!v) return null;
  v = v.replace(/^https?:\/\/(www\.)?/i, "");
  v = v.replace(/^(instagram\.com|facebook\.com)\//i, "");
  v = v.split("?")[0];
  v = v.replace(/^@/, "").replace(/\/+$/, "");
  const parts = v.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : null;
};

function CardHeader({ title, icon: Icon, iconColor = "text-[#F9EA02]/70" }) {
  return (
    <h2 className={`mb-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${iconColor}`}>
      {Icon && <Icon size={11} />} {title}
    </h2>
  );
}

function Row({ icon: Icon, label, value, ltr }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5">
      {Icon && <Icon size={15} className="shrink-0 text-white/40" />}
      <span className="shrink-0 text-[11px] font-bold text-white/40">{label}</span>
      <span dir={ltr ? "ltr" : undefined} className="ms-auto min-w-0 truncate text-[13px] font-bold text-white">
        {value || "—"}
      </span>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bike, setBike] = useState(null);
  const [status, setStatus] = useState("loading");
  
  const [imageModalUrl, setImageModalUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/profile" } });
      return;
    }

    const ctrl = new AbortController();
    Promise.all([
      api.get("/api/users/me", { signal: ctrl.signal }),
      api.get("/api/bikes/me", { signal: ctrl.signal }).catch(() => null),
    ])
      .then(([u, b]) => {
        setUser(u.data.data);
        if (b?.data?.data) setBike(b.data.data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "CanceledError") return;
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setStatus("error");
        }
      });
    return () => ctrl.abort();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  if (status === "loading")
    return (
      <div className="grid h-screen place-items-center bg-[#08080c]">
        <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
      </div>
    );

  if (status === "error" || !user)
    return (
      <div className="grid h-screen place-items-center bg-[#08080c] text-white">حدث خطأ.</div>
    );

  const level = getLevel(user.level);
  const fullName = `${user.firstName} ${user.lastName}`.trim() || "بدون اسم";
  const isAdmin = user.role === "Admin" || user.role === "Supervisor";
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ar-SY", { month: "long", year: "numeric" })
    : null;

  const coverUrl = fixUrl(user.profile_Cover_URL);
  const avatarUrl = fixUrl(user.profile_Image_URL);
  const bikeImgUrl = fixUrl(bike?.imageUrl);
  const hasBikeImage = user.hasBike && bikeImgUrl && !bikeImgUrl.includes("testimage");

  const instagramUrl = buildSocialUrl(user.instagram_URL, "https://instagram.com");
  const facebookUrl = buildSocialUrl(user.facebook_URL, "https://facebook.com");
  const instagramHandle = extractHandle(user.instagram_URL);
  const facebookHandle = extractHandle(user.facebook_URL);
  const hasSocial = !!(instagramUrl || facebookUrl);

  return (
    <>
      <Seo title="الملف الشخصي" description="صفحة الملف الشخصي." noindex={true} />
      <main dir="rtl" className="relative min-h-screen text-white">
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
          <div className="grid gap-4 lg:grid-cols-[360px_1fr] lg:gap-5">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className={`${glass} overflow-hidden`}>
                <div className="group relative h-32 w-full bg-gradient-to-br from-[#F9EA02]/30 via-purple-500/20 to-cyan-400/10 sm:h-36">
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt="Cover"
                      width={1200}
                      height={400}
                      decoding="async"
                      className="absolute inset-0 size-full cursor-pointer object-cover transition group-hover:opacity-90"
                      onClick={() => setImageModalUrl(coverUrl)}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>

                <div className="flex flex-col px-6 pb-6">
                  <div
                    className="group relative -mt-14 cursor-pointer self-center"
                    onClick={() => avatarUrl && setImageModalUrl(avatarUrl)}
                    title="تكبير الصورة"
                  >
                    <div className="size-24 rounded-full bg-gradient-to-br from-[#F9EA02] to-purple-500 p-[3px] transition group-hover:scale-105 sm:size-28">
                      <div className="size-full overflow-hidden rounded-full bg-[#0a0a0a]">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={fullName}
                            width={112}
                            height={112}
                            decoding="async"
                            className="size-full object-cover transition group-hover:opacity-80"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-4xl font-black text-[#F9EA02]">
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="absolute -bottom-1 -end-1 grid size-8 place-items-center rounded-full bg-[#F9EA02] text-black shadow-lg">
                        <Shield size={13} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <h1 className="text-xl font-black leading-tight">{fullName}</h1>
                    <p dir="ltr" className="mt-1 font-mono text-[13px] font-bold text-[#F9EA02]">
                      @{user.username}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    <span className={`rounded-full ${level.bg} px-2.5 py-0.5 text-[10px] font-black uppercase text-white`}>
                      {level.label}
                    </span>
                    {isAdmin && (
                      <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-white/70">
                        <Shield size={9} /> {user.role === "Admin" ? "أدمن" : "مشرف"}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-3 rtl:divide-x-reverse">
                    <div className="flex flex-col items-center">
                      <p dir="ltr" className="font-mono text-xl font-black leading-none">
                        {user.number_Rounds || 0}
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/40">جولات</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p dir="ltr" className="font-mono text-xl font-black leading-none">
                        {(user.totalKilometers || 0).toFixed(0)}
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/40">كم</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-base font-black leading-none">{bike?.bikeType || "—"}</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/40">دراجة</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {joinedDate && (
                      <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-white/40">
                        <Calendar size={12} /> عضو منذ {joinedDate}
                      </div>
                    )}
                    <Link
                      to="/profile/edit"
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#F9EA02] py-3 text-[12px] font-black text-black transition hover:bg-[#F9EA02]/90"
                    >
                      <Edit3 size={14} /> تعديل الملف
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#F9EA02]/30 bg-[#F9EA02]/10 py-2.5 text-[11px] font-black text-[#F9EA02] transition hover:bg-[#F9EA02]/20"
                      >
                        <LayoutDashboard size={12} /> لوحة التحكم
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-4">
              <div className={`${glass} p-5`}>
                <CardHeader title="التواصل" icon={Mail} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Row icon={Mail} label="البريد" value={user.email} ltr />
                  <Row icon={Phone} label="الهاتف" value={user.phone} ltr />
                </div>
              </div>

              <div className={`${glass} p-5`}>
                <CardHeader title="السوشيال" icon={User} />

                {hasSocial ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {instagramUrl && instagramHandle && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-[#E4405F]/30 hover:bg-[#E4405F]/5"
                      >
                        <IconInstagram size={18} className="shrink-0 text-[#E4405F]" />
                        <div className="min-w-0 flex-1">
                          <p dir="ltr" className="truncate text-end text-[13px] font-bold text-white sm:text-start">
                            @{instagramHandle}
                          </p>
                          <p className="text-end text-[10px] font-bold text-white/40 sm:text-start">Instagram</p>
                        </div>
                        <ExternalLink size={13} className="shrink-0 text-white/30 transition-colors group-hover:text-[#E4405F]" />
                      </a>
                    )}
                    {facebookUrl && facebookHandle && (
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5"
                      >
                        <IconFacebook size={18} className="shrink-0 text-[#1877F2]" />
                        <div className="min-w-0 flex-1">
                          <p dir="ltr" className="truncate text-end text-[13px] font-bold text-white sm:text-start">
                            @{facebookHandle}
                          </p>
                          <p className="text-end text-[10px] font-bold text-white/40 sm:text-start">Facebook</p>
                        </div>
                        <ExternalLink size={13} className="shrink-0 text-white/30 transition-colors group-hover:text-[#1877F2]" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] px-4 py-6 text-center">
                    <div className="grid size-10 place-items-center rounded-full bg-white/[0.04] text-white/25">
                      <User size={16} />
                    </div>
                    <p className="text-[12px] font-bold text-white/40">
                      لا توجد حسابات سوشيال مرتبطة
                    </p>
                    <Link
                      to="/profile/edit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#F9EA02]/30 bg-[#F9EA02]/10 px-3 py-1 text-[10px] font-black text-[#F9EA02] transition hover:bg-[#F9EA02]/20"
                    >
                      <Plus size={11} /> إضافة حساب
                    </Link>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-rose-500/25 bg-rose-500/[0.06] p-5 backdrop-blur-md shadow-xl shadow-black/40">
                <CardHeader title="الطوارئ" icon={AlertTriangle} iconColor="text-rose-400" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-rose-500/15 bg-white/[0.02] px-3.5 py-2.5">
                    <span className="shrink-0 text-[11px] font-bold text-white/40">جهة الاتصال</span>
                    <span className="ms-auto min-w-0 truncate text-[13px] font-bold text-white">
                      {user.emergencyContactName || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-rose-500/15 bg-white/[0.02] px-3.5 py-2.5">
                    <span className="shrink-0 text-[11px] font-bold text-white/40">الرقم</span>
                    <span dir="ltr" className="ms-auto min-w-0 truncate text-[13px] font-bold text-white">
                      {user.emergencyContactPhone || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${glass} p-5`}>
                <CardHeader title="الدراجة" icon={BikeIcon} />
                {user.hasBike ? (
                  <div className={`grid gap-4 ${hasBikeImage ? "sm:grid-cols-[1fr_auto]" : ""}`}>
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
                      <BikeIcon size={18} className="text-[#F9EA02]" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">النوع</p>
                        <p className="text-[14px] font-black">{bike?.bikeType || "غير محدد"}</p>
                      </div>
                      <span className="ms-auto rounded-full bg-[#F9EA02]/10 px-2.5 py-1 text-[10px] font-black text-[#F9EA02]">
                        خاصة
                      </span>
                    </div>

                    {hasBikeImage && (
                      <div
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 sm:w-48"
                        onClick={() => setImageModalUrl(bikeImgUrl)}
                      >
                        <img
                          src={bikeImgUrl}
                          alt="Bike"
                          width={400}
                          height={225}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          style={{ aspectRatio: "16/9" }}
                          onError={(e) => {
                            e.currentTarget.parentElement.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="py-2 text-[13px] text-white/40">لا تمتلك دراجة مسجلة.</p>
                )}
              </div>

              {!user.isActive && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-300 backdrop-blur-md">
                  <AlertTriangle size={16} /> هذا الحساب موقوف مؤقتاً.
                </div>
              )}

              <div className={`${glass} flex items-center justify-between px-5 py-3`}>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                  RiderZ · {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-white/50 transition-colors hover:text-rose-400"
                >
                  <LogOut size={13} /> تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>

        {imageModalUrl && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setImageModalUrl(null)}
          >
            <div
              className="relative flex max-h-[90vh] max-w-4xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setImageModalUrl(null)}
                className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition hover:text-[#F9EA02] md:-right-12 md:top-0"
                title="إغلاق"
              >
                <X size={24} />
              </button>
              <img
                src={imageModalUrl}
                alt="Enlarged view"
                className="max-h-[85vh] w-auto max-w-full rounded-2xl border border-white/10 object-contain shadow-2xl"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}