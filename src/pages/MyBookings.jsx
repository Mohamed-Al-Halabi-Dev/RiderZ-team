import { useEffect, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";
import {
  Calendar,
  ArrowLeft,
  Ticket,
  Loader2,
  AlertCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Seo from "../components/Seo";

// ✅ خففنا الـ blur من 2xl لـ md
const glass =
  "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";

const STATUS_MAP = {
  Booked: {
    label: "مؤكد",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  Review: {
    label: "قيد المراجعة",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  Cancelled: {
    label: "ملغي",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80";

// ✅ بما إننا صرنا نستخدم api instance، ما منحتاج API_URL
const imgFor = (url) =>
  !url || url.includes("example.com") ? FALLBACK_IMG : url;

// ✅ كرت الحجز كـ مكون memo منفصل
const BookingCard = memo(function BookingCard({ booking, onCancel }) {
  const info = STATUS_MAP[booking.statusBooking] ?? {
    label: booking.statusBooking,
    color: "text-white/60 bg-white/5 border-white/10",
  };

  return (
    <div
      className={`${glass} group overflow-hidden transition hover:border-white/20`}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-auto sm:w-48">
          <img
            src={imgFor(booking.ima_Cover_Ride)}
            alt={booking.rideName}
            width={600}
            height={338}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-lg font-black leading-tight text-white">
                {booking.rideName}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
                <Calendar size={14} className="text-[#F9EA02]" />
                <span>حُجز في: {booking.dateBooking}</span>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black ${info.color}`}
            >
              {info.label}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-2">
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-xl font-black text-[#F9EA02]">
                {booking.totalPrice}
              </span>
              <span className="text-[10px] font-bold text-white/40">ل.س</span>
            </div>

            <div className="flex items-center gap-2">
              {booking.statusBooking === "Review" && (
                <button
                  onClick={() => onCancel(booking)}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/20"
                >
                  <XCircle size={12} /> إلغاء
                </button>
              )}
              <Link
                to={`/rides/${booking.rideId}`}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-bold text-white/70 transition-colors hover:border-[#F9EA02]/40 hover:text-[#F9EA02]"
              >
                عرض الرحلة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    api
      .get("/api/bookings/my", { signal: ctrl.signal })
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setBookings(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "CanceledError") return;
        if (err.response?.status === 401) {
          navigate("/login", { state: { from: "/bookings/my" } });
        } else {
          setStatus("error");
        }
      });

    return () => ctrl.abort();
  }, [navigate]);

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);
    try {
      await api.delete(`/api/bookings/${bookingToCancel.rideId}`);
      setBookings((prev) =>
        prev.filter((b) => b.rideId !== bookingToCancel.rideId)
      );
      setBookingToCancel(null);
    } catch (err) {
      alert(err?.response?.data?.message || "تعذر إلغاء الحجز.");
    } finally {
      setCancelling(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="grid h-screen place-items-center bg-[#08080c]">
        <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="grid h-screen place-items-center bg-[#08080c] px-4 text-center text-white">
        <div>
          <AlertCircle size={48} className="mx-auto mb-4 text-rose-400" />
          <p className="text-lg font-bold">حدث خطأ أثناء تحميل الحجوزات.</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-[#F9EA02] px-6 py-2.5 text-sm font-black text-black"
          >
            رجوع للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title="حجوزاتي" description="حجوزاتي" noindex={true} />
      <main
        dir="rtl"
        className="relative min-h-screen pb-20 pt-24 text-white sm:pt-28"
      >
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8">
            <Link
              to="/rides"
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-white/50 transition-colors hover:text-[#F9EA02]"
            >
              <ArrowLeft size={16} className="rotate-180" />
              استكشف الجولات
            </Link>

            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#F9EA02] text-black shadow-lg shadow-[#F9EA02]/20">
                <Ticket size={24} strokeWidth={2.5} />
              </span>
              <div>
                <h1 className="text-2xl font-black sm:text-3xl">حجوزاتي</h1>
                <p className="text-sm text-white/50">
                  {bookings.length} {bookings.length === 1 ? "حجز" : "حجوزات"}
                </p>
              </div>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className={`${glass} py-20 text-center`}>
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-white/5 text-white/20">
                <Ticket size={32} />
              </div>
              <p className="text-lg font-bold text-white/70">ما في حجوزات بعد</p>
              <p className="mt-2 text-sm text-white/40">
                ابدأ رحلتك الأولى مع RiderZ
              </p>
              <Link
                to="/rides"
                className="mt-6 inline-block rounded-xl bg-[#F9EA02] px-6 py-3 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98]"
              >
                استكشف الجولات
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b, idx) => (
                <BookingCard
                  key={`${b.rideId}-${idx}`}
                  booking={b}
                  onCancel={setBookingToCancel}
                />
              ))}
            </div>
          )}
        </div>

        {bookingToCancel && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            onClick={() => !cancelling && setBookingToCancel(null)}
          >
            <div
              className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d10] shadow-2xl shadow-black/60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-rose-500/15 text-rose-400">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl font-black">إلغاء الحجز</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  هل أنت متأكد من إلغاء حجزك لرحلة{" "}
                  <span className="font-bold text-white">
                    "{bookingToCancel.rideName}"
                  </span>
                  ؟ سيتم إزالة حجزك نهائياً.
                </p>
              </div>
              <div className="flex gap-2 p-4 pt-0">
                <button
                  onClick={() => setBookingToCancel(null)}
                  disabled={cancelling}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-black text-white/70 transition hover:bg-white/10 disabled:opacity-50"
                >
                  تراجع
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 py-3 text-sm font-black text-white transition hover:bg-rose-600 disabled:opacity-50"
                >
                  {cancelling ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "نعم، إلغاء"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}