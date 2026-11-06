import { useEffect, useState, memo } from "react";
import { Link, useParams } from "react-router-dom";
import api, { API_URL } from "../config/api";
import {
  ArrowRight,
  Loader2,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  FileImage,
  X,
  User,
} from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";

// ✅ خلفية كرت الحجز (بدون blur)
const cardBg =
  "rounded-3xl border border-white/10 bg-[#0d0d10]/80 shadow-lg shadow-black/40";

const BookingRow = memo(function BookingRow({
  booking: b,
  isProcessing,
  onAction,
  onAttendance,
  onViewImage,
}) {
  const getReceiptUrl = (url) =>
    !url ? null : url.startsWith("/") ? `${API_URL}${url}` : url;

  const status = b.attendance_Status;
  let statusColor = "bg-rose-500/15 text-rose-400";
  let statusLabel = "ملغي";

  if (status === "Booked" || status === "Attended") {
    statusColor = "bg-emerald-500/15 text-emerald-400";
    statusLabel = status === "Booked" ? "مؤكد" : "حضر";
  } else if (status === "Review") {
    statusColor = "bg-amber-500/15 text-amber-400";
    statusLabel = "قيد المراجعة";
  } else if (status === "Absent") {
    statusColor = "bg-orange-500/15 text-orange-400";
    statusLabel = "غائب";
  }

  return (
    <div
      className={`${cardBg} flex flex-col items-center justify-between gap-4 p-4 transition hover:border-white/20 sm:flex-row sm:p-5`}
    >
      <div className="flex w-full items-center gap-4 sm:w-auto">
        <div className="grid size-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50">
          <User size={20} />
        </div>
        <div>
          <p className="text-base font-black">
            {b.fullName || `مستخدم #${b.user_Id}`}
          </p>
          <p dir="ltr" className="text-end text-xs font-bold text-white/50">
            {b.phone || "لا يوجد رقم"}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-3 border-t border-white/5 pt-3 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
        <span
          className={`rounded-full px-3 py-1.5 text-[10px] font-black ${statusColor}`}
        >
          {statusLabel}
        </span>

        {b.receipt_Image_URL && (
          <button
            onClick={() => onViewImage(getReceiptUrl(b.receipt_Image_URL))}
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            title="عرض الإشعار"
          >
            <FileImage size={16} />
          </button>
        )}

        {status === "Review" && (
          <div className="flex gap-1.5">
            <button
              onClick={() => onAction(b.id, "approve")}
              disabled={isProcessing}
              className="grid size-9 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
              title="موافقة"
            >
              <CheckCircle2 size={16} />
            </button>
            <button
              onClick={() => onAction(b.id, "reject")}
              disabled={isProcessing}
              className="grid size-9 place-items-center rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 disabled:opacity-50"
              title="رفض"
            >
              <XCircle size={16} />
            </button>
          </div>
        )}

        {status === "Booked" && (
          <div className="flex gap-1.5 border-s border-white/10 ps-3">
            <button
              onClick={() => onAttendance(b.id, true)}
              disabled={isProcessing}
              className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
            >
              حضر
            </button>
            <button
              onClick={() => onAttendance(b.id, false)}
              disabled={isProcessing}
              className="flex items-center gap-1 rounded-lg bg-rose-500/10 px-2 py-1.5 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
            >
              غائب
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default function AdminRideDetails() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchData = async () => {
    try {
      const [rideRes, bookingsRes] = await Promise.all([
        api.get(`/api/rides/${id}`),
        api.get(`/api/admin/rides/${id}/bookings`),
      ]);
      setRide(rideRes.data.data);
      setBookings(bookingsRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAction = async (bookingId, action) => {
    setProcessingId(bookingId);
    try {
      await api.patch(`/api/admin/bookings/${bookingId}/${action}`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                attendance_Status:
                  action === "approve" ? "Booked" : "Cancelled",
              }
            : b
        )
      );
    } catch (err) {
      alert("فشل تنفيذ الإجراء");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAttendance = async (bookingId, attended) => {
    setProcessingId(bookingId);
    try {
      await api.patch(`/api/admin/bookings/${bookingId}/attendance`, {
        attended,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                attendance_Status: attended ? "Attended" : "Absent",
              }
            : b
        )
      );
    } catch (err) {
      alert(err?.response?.data?.message || "فشل تسجيل الحضور");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-[#08080c]">
        <Loader2 className="animate-spin text-[#F9EA02]" size={32} />
      </div>
    );
  }

  return (
    <main dir="rtl" className="relative min-h-screen text-white">
      <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <Link
          to="/admin/rides"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 transition hover:text-[#F9EA02]"
        >
          <ArrowRight size={14} /> رجوع للجولات
        </Link>

        <div className={`${glass} mb-6 p-6 sm:p-8`}>
          <h1 className="mb-3 text-2xl font-black">{ride.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-bold text-white/50">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} /> {ride.rideDateDisplay}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} /> {ride.meetingPoint}
            </span>
            <span className="flex items-center gap-1.5 text-[#F9EA02]">
              <Users size={16} /> {ride.currentParticipants}/
              {ride.maxParticipants} مشارك
            </span>
          </div>
        </div>

        <h2 className="mb-4 px-1 text-lg font-black">
          الحجوزات ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <div
            className={`${glass} py-16 text-center font-bold text-white/40`}
          >
            لا توجد حجوزات على هذه الجولة.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                isProcessing={processingId === b.id}
                onAction={handleAction}
                onAttendance={handleAttendance}
                onViewImage={setViewImage}
              />
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
            className="relative max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-2"
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
              alt="إشعار"
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}