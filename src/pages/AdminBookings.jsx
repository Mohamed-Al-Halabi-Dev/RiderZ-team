import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_URL } from "../config/api";
import {
  ArrowRight,
  CalendarCheck,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileImage,
  X,
  User,
  Bike,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

const BOOKING_TYPES = {
  1: "اشتراك فقط",
  2: "+ خوذة",
  3: "+ خوذة ودراجة",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/bookings");
      setBookings(res.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر جلب الحجوزات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      await api.patch(
        `/api/admin/bookings/${id}/${action === "approve" ? "approve" : "reject"}`
      );
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "فشل تنفيذ الإجراء");
    } finally {
      setProcessingId(null);
    }
  };

  const getReceiptUrl = (url) =>
    !url ? null : url.startsWith("/") ? `${API_URL}${url}` : url;

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
      </div>

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
              Admin / Bookings
            </span>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              إدارة <span className="text-[#F9EA02]">الحجوزات</span>
            </h1>
            <p className="mt-1 text-sm font-bold text-white/50">
              {loading
                ? "جارٍ التحميل..."
                : `${bookings.length} حجز بانتظار المراجعة`}
            </p>
          </div>
          <button
            onClick={fetchBookings}
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

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#F9EA02]" />
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div
            className={`${glass} flex flex-col items-center gap-3 py-20 text-center`}
          >
            <CheckCircle2 size={40} className="text-emerald-400" />
            <p className="text-lg font-black text-white">كل شي تمام!</p>
            <p className="text-sm font-bold text-white/40">
              ما في حجوزات معلقة حالياً.
            </p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`${glass} p-5 transition hover:border-white/20`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F9EA02]/10 text-[#F9EA02]">
                      <CalendarCheck size={22} />
                    </div>
                    <div>
                      <p className="text-lg font-black">
                        {booking.rideName || "اسم الرحلة غير متوفر"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-white/50">
                        <Link
                          to={`/leaderboard/${booking.username}`}
                          target="_blank"
                          className="flex items-center gap-1 transition hover:text-[#F9EA02] hover:underline"
                        >
                          <User size={12} />{" "}
                          {booking.fullName || `مستخدم #${booking.user_Id}`}
                        </Link>
                        <span className="flex items-center gap-1">
                          <Bike size={12} /> نوع الحجز:{" "}
                          {BOOKING_TYPES[booking.booking_Type] ||
                            booking.booking_Type}
                        </span>
                        <span className="flex items-center gap-1 text-[#F9EA02]">
                          <ShieldCheck size={12} /> {booking.total_Price} ل.س
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {booking.receipt_Image_URL ? (
                      <button
                        onClick={() =>
                          setViewImage(getReceiptUrl(booking.receipt_Image_URL))
                        }
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                      >
                        <FileImage size={16} /> عرض الإشعار
                      </button>
                    ) : (
                      <span className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[10px] font-bold text-rose-400">
                        لا يوجد إشعار
                      </span>
                    )}
                    <button
                      onClick={() => handleAction(booking.id, "approve")}
                      disabled={processingId === booking.id}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {processingId === booking.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}{" "}
                      موافقة
                    </button>
                    <button
                      onClick={() => handleAction(booking.id, "reject")}
                      disabled={processingId === booking.id}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-black text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      <XCircle size={14} /> رفض
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setViewImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl bg-[#0a0a0a] p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewImage(null)}
              className="absolute end-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/80"
            >
              <X size={20} />
            </button>
            <img
              src={viewImage}
              alt="إشعار الدفع"
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}