import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Search, Trophy, Crown, X, ChevronLeft } from "lucide-react";
import { API_URL } from "../config/api";
import Seo from "../components/Seo";

const glass = "rounded-2xl border bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

const fixUrl = (url) => {
  if (!url) return null;
  if (url.includes("example.com")) return null;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return url;
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    axios.get(`${API_URL}/api/users/leaderboard`, { signal: ctrl.signal })
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <>
      <Seo 
        title="لوحة الصدارة" 
        description="ترتيب أفضل راكبي الدراجات في RiderZ حسب المسافة المقطوعة. تحدّى نفسك وتصدّر القائمة."
        canonicalPath="/leaderboard" 
      />
      <main dir="rtl" className="relative min-h-screen overflow-hidden bg-[#08080c] text-white">

        {/* ═════ خلفية الشبكة + التوهجات ═════ */}
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

        <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">

          {/* ═════ Header ═════ */}
          <div className="mb-8">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 transition hover:text-[#F9EA02]"
            >
              <ArrowRight size={14} /> رجوع للرئيسية
            </Link>

            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F9EA02]">
                  // الترتيب
                </span>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">لوحة الصدارة</h1>
                <p className="mt-1 text-sm text-white/40">حسب المسافة المقطوعة</p>
              </div>
              <div className={`${glass} flex items-center gap-2 border-white/10 px-4 py-2`}>
                <Trophy size={16} className="text-[#F9EA02]" />
                <span dir="ltr" className="font-mono text-lg font-black">{users.length}</span>
              </div>
            </div>
          </div>

          {/* ═════ البحث ═════ */}
          <div className={`${glass} mb-6 flex items-center gap-3 border-white/10 p-2 ps-4`}>
            <Search size={16} className="shrink-0 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن متسابق..."
              className="w-full bg-transparent py-2 text-sm font-semibold text-white placeholder:text-white/30 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-white/40 transition hover:bg-white/5 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ═════ Loading ═════ */}
          {loading && (
            <div className="flex justify-center py-20">
              <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
            </div>
          )}

          {/* ═════ Empty ═════ */}
          {!loading && filtered.length === 0 && (
            <div className={`${glass} border-white/10 p-12 text-center text-white/40`}>
              {query ? `لا نتائج لـ "${query}"` : "لا يوجد متسابقين."}
            </div>
          )}

          {/* ═════ القائمة ═════ */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-2">
              {filtered.map((user, i) => (
                <Row key={user.id || user.username} user={user} rank={i + 1} />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}

/* ═══════════════════════════════════════════════
   Row - صف زجاجي
═══════════════════════════════════════════════ */
function Row({ user, rank }) {
  const isTop1 = rank === 1;
  const isTop2 = rank === 2;
  const isTop3 = rank === 3;

  const avatar = fixUrl(user.profile_Image_URL);
  const initials = (user.firstName || user.username || "?")[0].toUpperCase();

  const borderClass = isTop1
    ? "border-[#F9EA02]/40"
    : isTop2
    ? "border-gray-300/30"
    : isTop3
    ? "border-amber-600/30"
    : "border-white/[0.07]";

  const rankColor = isTop1
    ? "text-[#F9EA02]"
    : isTop2
    ? "text-gray-200"
    : isTop3
    ? "text-amber-500"
    : "text-white/30";

  const ringClass = isTop1
    ? "ring-2 ring-[#F9EA02]/60"
    : isTop2
    ? "ring-2 ring-gray-300/50"
    : isTop3
    ? "ring-2 ring-amber-600/50"
    : "ring-1 ring-white/10";

  return (
    <Link
      to={`/leaderboard/${user.username}`}
      className={`${glass} group flex items-center gap-3 border p-3 transition hover:border-white/20 sm:gap-4 sm:p-4 ${borderClass}`}
    >
      {/* ─── الرقم ─── */}
      <div className="flex w-10 shrink-0 flex-col items-center">
        <span dir="ltr" className={`font-mono text-lg font-black leading-none sm:text-xl ${rankColor}`}>
          {String(rank).padStart(2, "0")}
        </span>
        {isTop1 && <Crown size={12} className="mt-1 text-[#F9EA02]" fill="currentColor" />}
      </div>

      {/* ✅ Avatar: ضفنا loading, width, height, decoding */}
      <div className={`size-11 shrink-0 overflow-hidden rounded-full bg-white/5 sm:size-12 ${ringClass}`}>
        {avatar ? (
          <img
            src={avatar}
            alt={user.username}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.innerHTML = `<div class="grid size-full place-items-center text-xs font-black text-white/40">${initials}</div>`;
            }}
          />
        ) : (
          <div className="grid size-full place-items-center text-xs font-black text-white/40">
            {initials}
          </div>
        )}
      </div>

      {/* ─── الاسم ─── */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-black transition group-hover:text-[#F9EA02] sm:text-base ${isTop1 ? "text-[#F9EA02]" : "text-white"}`}>
          {user.firstName} {user.lastName}
        </p>
        <p className="truncate font-mono text-[11px] text-white/40">
          @{user.username}
        </p>
      </div>

      {/* ─── المسافة ─── */}
      <div className="shrink-0 text-end">
        <p dir="ltr" className={`font-mono text-base font-black sm:text-lg ${isTop1 ? "text-[#F9EA02]" : "text-white"}`}>
          {(user.totalKilometers || 0).toLocaleString("en-US")}
        </p>
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">كم</p>
      </div>

      {/* ─── سهم ─── */}
      <ChevronLeft size={16} className="hidden shrink-0 text-white/20 transition group-hover:text-[#F9EA02] sm:block" />
    </Link>
  );
}