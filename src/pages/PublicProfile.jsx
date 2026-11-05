import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight, Route as RouteIcon, Bike as BikeIcon,
  Shield, ArrowUpLeft, Trophy, X, // ✅ أضفنا أيقونة X
} from "lucide-react";
import Seo from "../components/Seo";

import { API_URL } from "../config/api";

const glass = "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

const fixUrl = (url) => {
  if (!url) return null;
  if (url.includes("example.com")) return null;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return url;
};

const buildSocialUrl = (value, base) => {
  if (!value) return null;
  const v = String(value).trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "").replace(/^\/+/, "");
  return `${base}/${handle}`;
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

export default function PublicProfile() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // ✅ حالة (State) للتحكم بفتح وإغلاق نافذة الصورة
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();

    axios
      .get(`${API_URL}/api/users/${username}/profile`, { signal: ctrl.signal })
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (!data) return setError(true);
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "CanceledError") return;
        setError(true);
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [username]);

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-[#08080c]">
        <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <main dir="rtl" className="grid min-h-screen place-items-center bg-[#08080c] text-white">
        <div className="text-center">
          <p className="mb-4 text-white/50">لم يتم العثور على هذا الراكب.</p>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#F9EA02] px-5 py-2.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90"
          >
            <ArrowRight size={14} /> رجوع للوحة الصدارة
          </Link>
        </div>
      </main>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim() || "بدون اسم";
  const initials = (fullName.charAt(0) || "?").toUpperCase();
  const isAdmin = user.role === "Admin" || user.role === "Supervisor";
  const coverUrl = fixUrl(user.profile_Cover_URL);
  const avatarUrl = fixUrl(user.profile_Image_URL);

  const instagramUrl = buildSocialUrl(user.instagram_URL, "https://instagram.com");
  const facebookUrl = buildSocialUrl(user.facebook_URL, "https://facebook.com");
  const instagramHandle = extractHandle(user.instagram_URL);
  const facebookHandle = extractHandle(user.facebook_URL);
  const hasSocial = !!(instagramUrl || facebookUrl);

  return (
    <>
      <Seo
        title={`${fullName} (@${user.username}) | RiderZ`}
        description={`الملف الشخصي لـ ${fullName} في RiderZ. ${user.totalKilometers || 0} كم مقطوعة، ${user.number_Rounds || 0} جولة.`}
        canonicalPath={`/leaderboard/${user.username}`}
        noindex={true}
      />
      <main dir="rtl" className="relative min-h-screen overflow-hidden bg-[#08080c] text-white">

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -top-40 -start-40 size-[500px] rounded-full bg-[#F9EA02]/15 blur-[120px]" />
          <div className="absolute -bottom-40 -end-40 size-[500px] rounded-full bg-purple-500/15 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 size-[400px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">

          <Link
            to="/leaderboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 transition hover:text-[#F9EA02]"
          >
            <ArrowRight size={14} /> رجوع للوحة الصدارة
          </Link>

          <div className={`${glass} overflow-hidden`}>

            <div className="relative h-36 w-full bg-gradient-to-br from-[#F9EA02]/20 via-purple-500/20 to-cyan-400/10 sm:h-48">
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt={`غلاف ${fullName}`}
                  width={1200}
                  height={400}
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
            </div>

            <div className="relative -mt-16 px-5 pb-6 sm:-mt-20 sm:px-8">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-start">

                {/* ✅ أضفنا onClick و cursor-pointer عشان نفتح الصورة */}
                <div 
                  className="relative shrink-0 cursor-pointer group"
                  onClick={() => avatarUrl && setIsImageOpen(true)}
                  title="تكبير الصورة"
                >
                  <div className="size-28 rounded-full bg-gradient-to-br from-[#F9EA02] to-purple-500 p-[3px] sm:size-32 transition group-hover:scale-105">
                    <div className="size-full overflow-hidden rounded-full bg-[#0a0a0a]">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={fullName}
                          width={128}
                          height={128}
                          decoding="async"
                          className="size-full object-cover transition group-hover:opacity-80"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.innerHTML = `<div class="grid size-full place-items-center text-4xl font-black text-[#F9EA02]">${initials}</div>`;
                          }}
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-4xl font-black text-[#F9EA02]">
                          {initials}
                        </div>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="absolute -bottom-1 -end-1 grid size-9 place-items-center rounded-full border-2 border-[#0a0a0a] bg-[#F9EA02] text-black shadow-lg">
                      <Shield size={15} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex-1 sm:ms-6 sm:mt-0 sm:pb-2">
                  <h1 className="text-2xl font-black sm:text-3xl">{fullName}</h1>
                  <p dir="ltr" className="mt-1 font-mono text-sm font-bold text-[#F9EA02]">
                    @{user.username}
                  </p>
                  {isAdmin && (
                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <span className="flex items-center gap-1 rounded-full border border-[#F9EA02]/30 bg-[#F9EA02]/10 px-2.5 py-0.5 text-[10px] font-black text-[#F9EA02]">
                        <Shield size={9} /> {user.role === "Admin" ? "أدمن" : "مشرف"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">

            <div className={`${glass} flex items-center gap-4 p-5`}>
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F9EA02]/10 text-[#F9EA02]">
                <RouteIcon size={22} />
              </div>
              <div>
                <p dir="ltr" className="font-mono text-2xl font-black text-white sm:text-3xl">
                  {(user.totalKilometers || 0).toLocaleString("en-US")}
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  كيلومتر
                </p>
              </div>
            </div>

            <div className={`${glass} flex items-center gap-4 p-5`}>
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F9EA02]/10 text-[#F9EA02]">
                <BikeIcon size={22} />
              </div>
              <div>
                <p className="text-sm font-black text-white sm:text-base">
                  {user.hasBike ? "يمتلك دراجة" : "بدون دراجة"}
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  الدراجة
                </p>
              </div>
            </div>
          </div>

          {hasSocial && (
            <div className={`${glass} mt-4 p-5`}>
              <h2 className="mb-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F9EA02]/70">
                // السوشيال
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {instagramUrl && instagramHandle && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 transition hover:border-[#E4405F]/30 hover:bg-[#E4405F]/5"
                  >
                    <IconInstagram size={18} className="shrink-0 text-[#E4405F]" />
                    <div className="min-w-0 flex-1">
                      <p dir="ltr" className="truncate text-[13px] font-bold text-white">
                        @{instagramHandle}
                      </p>
                      <p className="text-[10px] font-bold text-white/40">Instagram</p>
                    </div>
                    <ArrowUpLeft size={13} className="shrink-0 text-white/30 transition group-hover:text-[#E4405F]" />
                  </a>
                )}
                {facebookUrl && facebookHandle && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 transition hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5"
                  >
                    <IconFacebook size={18} className="shrink-0 text-[#1877F2]" />
                    <div className="min-w-0 flex-1">
                      <p dir="ltr" className="truncate text-[13px] font-bold text-white">
                        @{facebookHandle}
                      </p>
                      <p className="text-[10px] font-bold text-white/40">Facebook</p>
                    </div>
                    <ArrowUpLeft size={13} className="shrink-0 text-white/30 transition group-hover:text-[#1877F2]" />
                  </a>
                )}
              </div>
            </div>
          )}

          <Link
            to="/leaderboard"
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
          >
            <Trophy size={16} className="text-[#F9EA02]" />
            عرض كل الراكبين
          </Link>

        </div>

        {/* ✅ نافذة عرض الصورة المكبرة (Modal) */}
        {isImageOpen && avatarUrl && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsImageOpen(false)}
          >
            <div 
              className="relative max-h-[90vh] max-w-4xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند الضغط على الصورة نفسها
            >
              <button 
                onClick={() => setIsImageOpen(false)} 
                className="absolute -top-12 right-0 md:-right-12 md:top-0 text-white hover:text-[#F9EA02] bg-white/10 p-2 rounded-full backdrop-blur-md transition"
                title="إغلاق"
              >
                <X size={24} />
              </button>
              <img 
                src={avatarUrl} 
                alt={fullName} 
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10" 
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}