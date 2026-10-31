import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import {
  Users,
  Bike,
  CalendarCheck,
  ArrowRight,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Shield,
} from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

const STAT_CARDS = [
  {
    key: "totalUsers",
    label: "المستخدمون",
    icon: Users,
    accent: "yellow",
    link: "/admin/users",
  },
  {
    key: "totalRides",
    label: "الجولات",
    icon: Bike,
    accent: "purple",
    link: "/admin/rides",
  },
  {
    key: "totalBookings",
    label: "الحجوزات",
    icon: CalendarCheck,
    accent: "cyan",
    link: "/admin/bookings",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/stats");
      setStats(res.data?.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        "تعذر جلب الإحصائيات.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#08080c] text-white"
    >
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

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 transition hover:text-[#F9EA02]"
        >
          <ArrowRight size={14} /> رجوع للرئيسية
        </Link>

        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-[#F9EA02]/15 text-[#F9EA02]">
                <Shield size={16} />
              </span>
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#F9EA02]">
                Admin Panel
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">
              لوحة <span className="text-[#F9EA02]">التحكم</span>
            </h1>
            <p className="mt-2 text-sm font-bold text-white/50">
              نظرة سريعة على أداء التطبيق
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className={`${glass} flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50`}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            تحديث
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-bold text-rose-300">
            <AlertTriangle size={18} /> <p>{error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {STAT_CARDS.map(({ key, label, icon: Icon, accent, link }) => (
            <StatCard
              key={key}
              icon={Icon}
              label={label}
              value={stats?.[key]}
              loading={loading}
              accent={accent}
              link={link}
            />
          ))}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            // Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              to="/admin/users"
              icon={Users}
              title="إدارة المستخدمين"
              desc="تفعيل/تعطيل، تغيير الأدوار"
            />
            <QuickAction
              to="/admin/rides"
              icon={Bike}
              title="إدارة الجولات"
              desc="إضافة، تعديل، حذف"
            />
            <QuickAction
              to="/admin/bookings"
              icon={CalendarCheck}
              title="إدارة الحجوزات"
              desc="مراجعة وتأكيد الحجوزات"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, label, value, loading, accent, link }) {
  const accents = {
    yellow: {
      bg: "bg-[#F9EA02]/10",
      text: "text-[#F9EA02]",
      glow: "group-hover:shadow-[#F9EA02]/20",
      border: "group-hover:border-[#F9EA02]/30",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      glow: "group-hover:shadow-purple-500/20",
      border: "group-hover:border-purple-500/30",
    },
    cyan: {
      bg: "bg-cyan-400/10",
      text: "text-cyan-400",
      glow: "group-hover:shadow-cyan-400/20",
      border: "group-hover:border-cyan-400/30",
    },
  };
  const a = accents[accent] ?? accents.yellow;
  return (
    <Link
      to={link}
      className={`${glass} group relative overflow-hidden p-6 transition hover:scale-[1.02] ${a.border} ${a.glow}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`grid size-12 place-items-center rounded-2xl ${a.bg} ${a.text}`}
        >
          <Icon size={22} />
        </div>
        <ArrowRight
          size={16}
          className="rotate-180 text-white/20 transition group-hover:-translate-x-1 group-hover:text-white/60"
        />
      </div>
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center gap-2 text-white/30">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-xs font-bold">...</span>
          </div>
        ) : (
          <p dir="ltr" className="font-mono text-4xl font-black text-white">
            {value ?? 0}
          </p>
        )}
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/50">
          {label}
        </p>
      </div>
    </Link>
  );
}

function QuickAction({ to, icon: Icon, title, desc }) {
  return (
    <Link
      to={to}
      className={`${glass} group flex items-center gap-4 p-4 transition hover:border-[#F9EA02]/30 hover:bg-white/[0.06]`}
    >
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/5 text-white/70 transition group-hover:bg-[#F9EA02]/15 group-hover:text-[#F9EA02]">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black">{title}</p>
        <p className="mt-0.5 truncate text-[11px] font-bold text-white/40">
          {desc}
        </p>
      </div>
      <ArrowRight
        size={16}
        className="rotate-180 text-white/20 transition group-hover:-translate-x-1 group-hover:text-[#F9EA02]"
      />
    </Link>
  );
}