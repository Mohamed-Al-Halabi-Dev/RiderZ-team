import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import {
  ArrowRight,
  Search,
  Users,
  Loader2,
  AlertTriangle,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Phone,
  MoreVertical,
  Star,
  Bike,
  Route,
  Calendar,
  Clock,
  AlertCircle,
  Ban,
} from "lucide-react";

const IconInstagram = ({ size = 16, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const IconFacebook = ({ size = 16, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";
const PAGE_SIZE = 8;
const ALL_LEVELS = [
  "Beginner_A",
  "Beginner_B",
  "Beginner_C",
  "Intermediate_A",
  "Intermediate_B",
  "Intermediate_C",
  "Advanced_A",
  "Advanced_B",
  "Advanced_C",
];
const ALL_ROLES = [
  {
    value: "Member",
    label: "عضو",
    icon: UserIcon,
    color: "cyan",
    desc: "مستخدم عادي",
  },
  {
    value: "Supervisor",
    label: "مشرف",
    icon: Shield,
    color: "purple",
    desc: "إدارة الجولات",
  },
  {
    value: "Admin",
    label: "أدمن",
    icon: ShieldCheck,
    color: "rose",
    desc: "صلاحيات كاملة",
  },
];
const ROLE_CONFIG = {
  Admin: {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    ring: "ring-rose-500/40",
    icon: ShieldCheck,
  },
  Supervisor: {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    ring: "ring-purple-500/40",
    icon: Shield,
  },
  Member: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    ring: "ring-cyan-500/40",
    icon: UserIcon,
  },
};
const ROLE_FILTERS = [
  { key: "all", label: "الكل", icon: Users },
  { key: "Admin", label: "أدمن", icon: ShieldCheck },
  { key: "Supervisor", label: "مشرف", icon: Shield },
  { key: "Member", label: "عضو", icon: UserIcon },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/users");
      const list = res.data?.data ?? [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0] ||
          "تعذر جلب المستخدمين."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((u) => {
        const full = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
        return (
          full.includes(q) ||
          (u.username ?? "").toLowerCase().includes(q) ||
          (u.email ?? "").toLowerCase().includes(q) ||
          (u.phone ?? "").toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const handleAction = (user, type) => {
    setOpenMenuId(null);
    setDialog({ user, type, level: user.level, targetRole: user.role });
  };

  const handleConfirm = async () => {
    if (!dialog) return;
    setSubmitting(true);
    try {
      const { user, type, level, targetRole } = dialog;
      if (type === "toggle") {
        await api.patch(`/api/admin/users/${user.id}/status`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, isActive: !u.isActive } : u
          )
        );
      } else if (type === "role") {
        await api.put(`/api/admin/users/${user.id}/role`, {
          role: targetRole,
        });
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: targetRole } : u))
        );
      } else if (type === "level") {
        await api.put(`/api/admin/users/${user.id}/level`, { level });
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, level } : u))
        );
      }
      setDialog(null);
    } catch (err) {
      alert(err?.response?.data?.message || "فشل تنفيذ الإجراء");
    } finally {
      setSubmitting(false);
    }
  };

  const counts = useMemo(
    () =>
      users.reduce(
        (acc, u) => {
          acc[u.role] = (acc[u.role] ?? 0) + 1;
          return acc;
        },
        { Admin: 0, Supervisor: 0, Member: 0 }
      ),
    [users]
  );

  return (
    <main
      dir="rtl"
      className="relative min-h-screen bg-[#08080c] text-white"
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

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 transition hover:text-[#F9EA02]"
        >
          <ArrowRight size={14} /> رجوع للوحة التحكم
        </Link>

        <div className="mb-8">
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#F9EA02]">
            Admin / Users
          </span>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            إدارة <span className="text-[#F9EA02]">المستخدمين</span>
          </h1>
          <p className="mt-1 text-sm font-bold text-white/50">
            {loading
              ? "جارٍ التحميل..."
              : search || roleFilter !== "all"
                ? `${filtered.length} نتيجة من ${users.length} مستخدم`
                : `${users.length} مستخدم مسجل`}
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {ROLE_FILTERS.map(({ key, label, icon: Icon }) => {
            const isActive = roleFilter === key;
            const count = key === "all" ? users.length : counts[key] ?? 0;
            return (
              <button
                key={key}
                onClick={() => setRoleFilter(key)}
                className={`flex flex-wrap items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-black transition ${
                  isActive
                    ? "bg-[#F9EA02] text-black shadow-lg shadow-[#F9EA02]/25"
                    : "border border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? "bg-black/20 text-black"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className={`${glass} mb-6 flex items-center gap-3 p-2 ps-4`}>
          <Search size={16} className="shrink-0 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، اسم المستخدم، الإيميل، أو الهاتف..."
            className="w-full bg-transparent py-2 text-sm font-semibold text-white placeholder:text-white/30 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="grid size-8 shrink-0 place-items-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-bold text-rose-300">
            <AlertTriangle size={18} />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#F9EA02]" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div
            className={`${glass} flex flex-col items-center gap-3 py-20 text-center`}
          >
            <Users size={40} className="text-white/20" />
            <p className="text-sm font-bold text-white/40">
              {search
                ? `لا نتائج لـ "${search}"`
                : roleFilter !== "all"
                  ? `لا يوجد ${ROLE_FILTERS.find((r) => r.key === roleFilter)?.label}`
                  : "لا يوجد مستخدمون"}
            </p>
          </div>
        )}

        {!loading && pageUsers.length > 0 && (
          <div className="space-y-4">
            {pageUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isMenuOpen={openMenuId === user.id}
                onToggleMenu={() =>
                  setOpenMenuId(openMenuId === user.id ? null : user.id)
                }
                onAction={(type) => handleAction(user, type)}
              />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`${glass} grid size-10 place-items-center text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-30`}
            >
              <ChevronRight size={16} />
            </button>
            <span className="px-3 text-sm font-bold text-white/60">
              صفحة <span className="text-[#F9EA02]">{currentPage}</span> من{" "}
              {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`${glass} grid size-10 place-items-center text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-30`}
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>

      <ActionModal
        dialog={dialog}
        onClose={() => !submitting && setDialog(null)}
        onConfirm={handleConfirm}
        onChangeLevel={(lvl) => setDialog((d) => ({ ...d, level: lvl }))}
        onChangeRole={(rl) => setDialog((d) => ({ ...d, targetRole: rl }))}
        submitting={submitting}
      />
    </main>
  );
}

function UserCard({ user, isMenuOpen, onToggleMenu, onAction }) {
  const initials = (
    user.firstName?.[0] ??
    user.username?.[0] ??
    "?"
  ).toUpperCase();
  const avatar = user.profile_Image_URL;
  const role = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.Member;
  const RoleIcon = role.icon;

  return (
    <div
      className={`${glass} group relative transition hover:border-white/20`}
    >
      <div
        className={`h-1 w-full rounded-t-3xl bg-gradient-to-l ${
          user.isActive
            ? "from-transparent via-emerald-400 to-transparent"
            : "from-transparent via-rose-400 to-transparent"
        }`}
      />
      <div className="p-4 sm:p-5">
        {/* ✅ تعديل: ضفنا w-full للموبايل عشان الترتيب يكون طولي دائماً */}
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:flex-nowrap sm:items-center">
          
          {/* Avatar + Name (Mobile: Row, Desktop: Row) */}
          <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-1">
            <div className="relative shrink-0">
              <div
                className={`size-14 sm:size-16 overflow-hidden rounded-2xl bg-white/5 ring-2 ${role.ring}`}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.username}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-lg font-black text-white/50">
                    {initials}
                  </div>
                )}
              </div>
              <span
                className={`absolute -bottom-1 -end-1 size-4 rounded-full border-2 border-[#08080c] ${
                  user.isActive ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <p className="text-base sm:text-lg font-black truncate">
                  {user.firstName} {user.lastName}
                </p>
                <span className="font-mono text-[10px] text-white/30">
                  #{user.id}
                </span>
              </div>
              <p
                dir="ltr"
                className="truncate font-mono text-xs text-white/40"
              >
                @{user.username}
              </p>
            </div>
            
            {/* 3 Dots (Mobile: Top Right, Desktop: End) */}
            <div className="relative shrink-0 sm:hidden">
              <button
                onClick={onToggleMenu}
                className={`grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-white/20 hover:bg-white/10 hover:text-white ${
                  isMenuOpen ? "border-[#F9EA02]/40 bg-[#F9EA02]/10 text-[#F9EA02]" : ""
                }`}
              >
                <MoreVertical size={16} />
              </button>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={onToggleMenu} />
                  <DropdownMenu user={user} onAction={onAction} />
                </>
              )}
            </div>
          </div>

          {/* Badges + 3 Dots (Mobile: Row below, Desktop: Row end) */}
          <div className="flex w-full flex-wrap items-center justify-center gap-1.5 sm:w-auto sm:justify-end">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${role.bg} ${role.text}`}
            >
              <RoleIcon size={11} />
              {user.role}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${
                user.isActive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-rose-500/15 text-rose-400"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  user.isActive ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              {user.isActive ? "مفعّل" : "معطّل"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-black text-white/60">
              <Star size={11} />
              {user.level}
            </span>
            
            {/* Desktop 3 Dots */}
            <div className="relative hidden shrink-0 sm:block ms-2">
              <button
                onClick={onToggleMenu}
                className={`grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-white/20 hover:bg-white/10 hover:text-white ${
                  isMenuOpen ? "border-[#F9EA02]/40 bg-[#F9EA02]/10 text-[#F9EA02]" : ""
                }`}
              >
                <MoreVertical size={16} />
              </button>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={onToggleMenu} />
                  <DropdownMenu user={user} onAction={onAction} />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-white/5" />

        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Section title="الاتصال">
            <InfoRow icon={Mail} label="الإيميل" value={user.email} ltr />
            <InfoRow icon={Phone} label="الهاتف" value={user.phone} ltr />
            {user.instagram_URL && (
              <InfoRow
                icon={IconInstagram}
                label="Instagram"
                value={user.instagram_URL}
                ltr
                link
              />
            )}
            {user.facebook_URL && (
              <InfoRow
                icon={IconFacebook}
                label="Facebook"
                value={user.facebook_URL}
                ltr
                link
              />
            )}
          </Section>

          <Section title="الإحصائيات">
            <div className="grid w-full grid-cols-3 gap-1.5">
              <StatBox
                icon={Route}
                value={user.totalKilometers ?? 0}
                label="كم"
                highlight
              />
              <StatBox
                icon={Bike}
                value={user.number_Rounds ?? 0}
                label="جولة"
              />
              <StatBox
                icon={Ban}
                value={user.ban_Points ?? 0}
                label="نقاط"
                danger={user.ban_Points > 0}
              />
            </div>
          </Section>

          <Section title="جهة الطوارئ" warning>
            {user.emergencyContactName || user.emergencyContactPhone ? (
              <>
                <InfoRow
                  icon={AlertCircle}
                  label="الاسم"
                  value={user.emergencyContactName ?? "—"}
                />
                <InfoRow
                  icon={Phone}
                  label="الرقم"
                  value={user.emergencyContactPhone ?? "—"}
                  ltr
                />
              </>
            ) : (
              <p className="text-[11px] font-bold text-white/30">
                — غير محددة —
              </p>
            )}
          </Section>

          <Section title="التواريخ">
            <InfoRow
              icon={Calendar}
              label="مسجّل من"
              value={formatDate(user.createdAt)}
            />
            <InfoRow
              icon={Clock}
              label="آخر تحديث"
              value={formatDate(user.updatedAt)}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

function DropdownMenu({ user, onAction }) {
  const MenuItem = ({ icon: Icon, label, onClick, color = "default" }) => {
    const colors = {
      default: "text-white/70 hover:bg-white/5 hover:text-white",
      rose: "text-rose-300 hover:bg-rose-500/10 hover:text-rose-200",
      emerald:
        "text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200",
      yellow: "text-[#F9EA02] hover:bg-[#F9EA02]/10",
      purple: "text-purple-300 hover:bg-purple-500/10 hover:text-purple-200",
    };
    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition ${
          colors[color] ?? colors.default
        }`}
      >
        <Icon size={14} />
        <span className="flex-1 text-right">{label}</span>
      </button>
    );
  };
  return (
    <div
      // ✅ التعديل هون: القائمة تنفتح لليسار (عشان ما تطلع برا الشاشة على الموبايل)
      className="absolute left-0 top-full z-[100] mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] shadow-2xl shadow-black/60 backdrop-blur-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem
        icon={user.isActive ? UserX : UserCheck}
        label={user.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
        color={user.isActive ? "rose" : "emerald"}
        onClick={() => onAction("toggle")}
      />
      <MenuItem
        icon={Star}
        label="تعديل المستوى"
        color="yellow"
        onClick={() => onAction("level")}
      />
      <div className="my-1 h-px bg-white/5" />
      <MenuItem
        icon={Shield}
        label="تعديل الصلاحية"
        color="purple"
        onClick={() => onAction("role")}
      />
    </div>
  );
}

function ActionModal({
  dialog,
  onClose,
  onConfirm,
  onChangeLevel,
  onChangeRole,
  submitting,
}) {
  if (!dialog) return null;
  const { user, type, targetRole } = dialog;
  const fullName = `${user.firstName} ${user.lastName}`;
  const configs = {
    toggle: {
      icon: user.isActive ? UserX : UserCheck,
      color: user.isActive ? "rose" : "emerald",
      title: user.isActive ? "تعطيل الحساب" : "تفعيل الحساب",
      message: user.isActive
        ? `سيتم منع "${fullName}" من الدخول للتطبيق حتى إعادة التفعيل.`
        : `سيتم السماح لـ "${fullName}" بالدخول للتطبيق مرة أخرى.`,
      confirmLabel: user.isActive ? "نعم، عطّل" : "نعم، فعّل",
    },
    role: {
      icon: Shield,
      color: "purple",
      title: "تعديل الصلاحية",
      message: `اختر الصلاحية الجديدة لـ "${fullName}".`,
      confirmLabel: "حفظ الصلاحية",
    },
    level: {
      icon: Star,
      color: "yellow",
      title: "تعديل المستوى",
      message: `اختر المستوى الجديد لـ "${fullName}".`,
      confirmLabel: "حفظ المستوى",
    },
  };
  const cfg = configs[type];
  const Icon = cfg.icon;
  const currentLevel = dialog.level ?? user.level;
  const colors = {
    rose: {
      bg: "bg-rose-500/15",
      text: "text-rose-400",
      btn: "bg-rose-500 hover:bg-rose-400 text-white",
    },
    emerald: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      btn: "bg-emerald-500 hover:bg-emerald-400 text-white",
    },
    purple: {
      bg: "bg-purple-500/15",
      text: "text-purple-400",
      btn: "bg-purple-500 hover:bg-purple-400 text-white",
    },
    cyan: {
      bg: "bg-cyan-500/15",
      text: "text-cyan-400",
      btn: "bg-cyan-500 hover:bg-cyan-400 text-white",
    },
    yellow: {
      bg: "bg-[#F9EA02]/15",
      text: "text-[#F9EA02]",
      btn: "bg-[#F9EA02] hover:bg-[#F9EA02]/90 text-black",
    },
  };
  const c = colors[cfg.color] ?? colors.yellow;
  const roleColors = {
    Member: {
      bg: "bg-cyan-500/15",
      text: "text-cyan-400",
      border: "border-cyan-500/50",
    },
    Supervisor: {
      bg: "bg-purple-500/15",
      text: "text-purple-400",
      border: "border-purple-500/50",
    },
    Admin: {
      bg: "bg-rose-500/15",
      text: "text-rose-400",
      border: "border-rose-500/50",
    },
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d10] shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 pb-0">
          <button
            onClick={onClose}
            disabled={submitting}
            className="absolute end-4 top-4 grid size-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
          >
            <X size={16} />
          </button>
          <div
            className={`mx-auto mb-4 grid size-16 place-items-center rounded-2xl ${c.bg} ${c.text}`}
          >
            <Icon size={28} strokeWidth={2.2} />
          </div>
          <h2 className="text-center text-xl font-black">{cfg.title}</h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-white/50">
            {cfg.message}
          </p>
        </div>

        {type === "role" && (
          <div className="px-6 pt-5">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/40">
              الصلاحية الجديدة
            </p>
            <div className="grid gap-2">
              {ALL_ROLES.map((r) => {
                const isSelected = targetRole === r.value;
                const isCurrent = user.role === r.value;
                const rc = roleColors[r.value];
                const RIcon = r.icon;
                return (
                  <button
                    key={r.value}
                    onClick={() => onChangeRole(r.value)}
                    disabled={submitting}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-start transition ${
                      isSelected
                        ? `${rc.border} ${rc.bg}`
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div
                      className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                        isSelected ? rc.bg : "bg-white/5"
                      } ${isSelected ? rc.text : "text-white/50"}`}
                    >
                      <RIcon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-black ${
                            isSelected ? rc.text : "text-white"
                          }`}
                        >
                          {r.label}
                        </p>
                        {isCurrent && (
                          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] font-black text-white/50">
                            الحالية
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[10px] font-bold text-white/40">
                        {r.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className={`size-2 rounded-full ${rc.text.replace("text-", "bg-")}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {type === "level" && (
          <div className="px-6 pt-5">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/40">
              المستوى الجديد
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {ALL_LEVELS.map((lvl) => {
                const isSelected = currentLevel === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => onChangeLevel(lvl)}
                    disabled={submitting}
                    className={`rounded-xl border px-2 py-2 font-mono text-[10px] font-black transition ${
                      isSelected
                        ? "border-[#F9EA02]/50 bg-[#F9EA02]/15 text-[#F9EA02]"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2 p-6 pt-6">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={
              submitting || (type === "role" && targetRole === user.role)
            }
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${c.btn}`}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              cfg.confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, warning }) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        warning
          ? "border-amber-500/20 bg-amber-500/5"
          : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <p
        className={`mb-2 text-[10px] font-black uppercase tracking-widest ${
          warning ? "text-amber-400" : "text-white/40"
        }`}
      >
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, ltr, link }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <span className="flex shrink-0 items-center gap-1.5 text-white/40">
        <Icon size={10} />
        {label}
      </span>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          dir={ltr ? "ltr" : "rtl"}
          className="truncate font-bold text-[#F9EA02] hover:underline"
        >
          {value}
        </a>
      ) : (
        <span
          dir={ltr ? "ltr" : "rtl"}
          className="truncate font-bold text-white/80"
        >
          {value}
        </span>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, value, label, highlight, danger }) {
  return (
    <div className="rounded-lg bg-white/[0.03] px-1.5 py-1.5 text-center">
      <Icon
        size={12}
        className={`mx-auto mb-0.5 ${
          danger
            ? "text-rose-400"
            : highlight
              ? "text-[#F9EA02]"
              : "text-white/40"
        }`}
      />
      <p
        dir="ltr"
        className={`font-mono text-sm font-black leading-none ${
          danger
            ? "text-rose-400"
            : highlight
              ? "text-[#F9EA02]"
              : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-white/30">
        {label}
      </p>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}