import { useEffect, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";
import {
  ArrowRight,
  Loader2,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  Users,
  Eye,
  AlertTriangle,
} from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80";

const RideCard = memo(function RideCard({ ride, onDelete, onView, onEdit }) {
  return (
    <div
      className={`${glass} group flex flex-col items-center gap-5 p-4 transition hover:border-white/20 sm:flex-row`}
    >
      <div
        className="h-24 w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white/5 sm:w-40"
        onClick={() => onView(ride.id)}
      >
        <img
          src={ride.imageUrl || FALLBACK_IMG}
          alt={ride.title}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div
        className="min-w-0 flex-1 cursor-pointer text-center sm:text-start"
        onClick={() => onView(ride.id)}
      >
        <h3 className="truncate text-xl font-black">{ride.title}</h3>
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs font-bold text-white/50 sm:justify-start">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {ride.rideDateDisplay}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> {ride.meetingPoint}
          </span>
          <span className="flex items-center gap-1.5 text-[#F9EA02]">
            <Users size={14} /> {ride.currentParticipants}/
            {ride.maxParticipants}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onView(ride.id)}
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
          title="عرض التفاصيل"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onEdit(ride.id)}
          className="grid size-10 place-items-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 transition hover:bg-blue-500/20"
          title="تعديل"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={() => onDelete(ride)}
          className="grid size-10 place-items-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 transition hover:bg-rose-500/20"
          title="حذف"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});

export default function AdminRides() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchRides = async () => {
    try {
      const res = await api.get("/api/rides?page=1&pageSize=50");
      setRides(res.data?.data || []);
    } catch (err) {
      setError("تعذر جلب الجولات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/rides/${deleteTarget.id}`);
      setRides((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.response?.data?.message || "فشل حذف الجولة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main dir="rtl" className="relative min-h-screen text-white">
      <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 transition hover:text-[#F9EA02]"
        >
          <ArrowRight size={14} /> رجوع للوحة التحكم
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#F9EA02]">
              Admin / Rides
            </span>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              إدارة <span className="text-[#F9EA02]">الجولات</span>
            </h1>
            <p className="mt-1 text-sm font-bold text-white/50">
              {rides.length} جولة مسجلة
            </p>
          </div>
          <Link
            to="/admin/rides/add"
            className="flex items-center gap-2 rounded-xl bg-[#F9EA02] px-5 py-3 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98]"
          >
            <Plus size={18} /> إضافة جولة
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#F9EA02]" size={32} />
          </div>
        ) : error ? (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-bold text-rose-300">
            <AlertTriangle size={18} /> {error}
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onDelete={setDeleteTarget}
                onView={(id) => navigate(`/admin/rides/${id}`)}
                onEdit={(id) => navigate(`/admin/rides/edit/${id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={() => !submitting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d10] p-6 text-center shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-rose-500/15 text-rose-400">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black">حذف الجولة</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              هل أنت متأكد من حذف "{deleteTarget.title}"؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={submitting}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-black text-white/70 transition hover:bg-white/10"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex flex-1 items-center justify-center rounded-xl bg-rose-500 py-3 text-sm font-black text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "نعم، احذف"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}