import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { API_URL } from "../config/api";
// ✅ شلنا getToken
import {
  MapPin, Calendar, Clock, Route as RouteIcon, Users, UserCircle,
  ShieldCheck, Loader2, XCircle, AlertTriangle, Map, ExternalLink,
  Timer, Tag, Flag, Navigation,
} from "lucide-react";
import { getLevel } from "../constants/levels";
import { getStatus } from "../constants/statuses";
import BookingModal from "../components/rides/BookingModal";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext"; // ✅ ضفنا الاستيراد

const FALLBACK_IMG = "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80";

const imgFor = (ride) => {
  const url = ride?.imageUrl;
  if (!url || url.includes("example.com")) return FALLBACK_IMG;
  return url.startsWith("/") ? `${API_URL}${url}` : url;
};

function formatTime(iso) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" }); } catch { return "—"; }
}

function formatArabicDate(iso) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("ar-SY", { weekday: "long", day: "numeric", month: "long" }); } catch { return "—"; }
}

function formatDuration(minutes) {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours} ساعة و ${mins} دقيقة`;
  if (hours > 0) return `${hours} ساعة`;
  return `${mins} دقيقة`;
}

const glass = "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";

export default function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ جديد: حالة المستخدم من الـ Context

  const [ride, setRide] = useState(null);
  const [status, setStatus] = useState("loading");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [userBooking, setUserBooking] = useState(null);
  const [checkingBooking, setCheckingBooking] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const fetchRide = api.get(`/api/rides/${id}`, { signal: ctrl.signal });

    // ✅ بدل getToken()
    const fetchUserBookings = user.isLoggedIn
      ? api.get("/api/bookings/my", { signal: ctrl.signal }).catch(() => ({ data: { data: [] } }))
      : Promise.resolve({ data: { data: [] } });

    Promise.all([fetchRide, fetchUserBookings])
      .then(([rideRes, bookingsRes]) => {
        const rideData = rideRes.data?.data ?? rideRes.data;
        if (!rideData) return setStatus("error");
        setRide(rideData);
        setStatus("ready");
        const existing = (bookingsRes.data?.data ?? []).find((b) => b.rideId === Number(id));
        if (existing) setUserBooking(existing);
      })
      .catch((err) => {
        if (err.name !== "CanceledError") setStatus("error");
      })
      .finally(() => setCheckingBooking(false));

    return () => ctrl.abort();
  }, [id, user.isLoggedIn]); // ✅ ضفنا user.isLoggedIn

  const handleOpenBooking = () => {
    // ✅ بدل getToken()
    if (!user.isLoggedIn) {
      navigate("/login", { state: { from: `/rides/${id}` } });
      return;
    }
    setBookingOpen(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    await api.post("/api/bookings", bookingData);
    setUserBooking({ statusBooking: "Review" });
    return true;
  };

  const confirmCancelBooking = async () => {
    setCancelling(true);
    try {
      await api.delete(`/api/bookings/${id}`);
      setUserBooking(null);
      setShowCancelModal(false);
    } catch (err) {
      alert(err?.response?.data?.message || "تعذر إلغاء الحجز.");
    } finally {
      setCancelling(false);
    }
  };

  if (status === "loading") {
    return <div className="grid h-screen place-items-center"><span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" /></div>;
  }

  if (status === "error") {
    return <div className="grid h-screen place-items-center text-white"><Link to="/rides" className="text-sm font-bold text-[#F9EA02] hover:underline">← رجوع للجولات</Link></div>;
  }

  const level = getLevel(ride.level);
  const rideStatus = getStatus(ride.status);
  const departureTime = formatTime(ride.rideDate);
  const seoDescription = ride.description ? ride.description.slice(0, 150) : `انضم لجولة ${ride.title} مع RiderZ.`;
  const pathSteps = ride.path ? ride.path.split("\\").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <>
      <Seo title={`${ride.title} | جولات RiderZ`} description={seoDescription} canonicalPath={`/rides/${ride.id}`} image={imgFor(ride)} />

      <main dir="rtl" className="relative min-h-screen pb-20 pt-24 text-white sm:pt-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
            <Link to="/rides" className="transition-colors hover:text-white">الجولات</Link>
            <span>/</span>
            <span className="truncate font-bold text-white">{ride.title}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="min-w-0 space-y-6">
              <div className={`${glass} overflow-hidden p-2`}>
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <img
                    src={imgFor(ride)}
                    alt={ride.title}
                    width={1200}
                    height={675}
                    fetchPriority="high"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
              </div>

              <div className={`${glass} p-6 sm:p-8`}>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2.5 py-1 text-xs font-black ${rideStatus.bg} ${rideStatus.text}`}>{ride.status}</span>
                  <span className={`rounded-md px-2.5 py-1 text-xs font-black text-white ${level.bg}`}>{level.label}</span>
                </div>
                <h1 className="break-words text-3xl font-black sm:text-4xl">{ride.title}</h1>
              </div>

              {ride.description && (
                <div className={`${glass} p-6 sm:p-8`}>
                  <h2 className="mb-4 border-b border-white/10 pb-2 text-xl font-black">عن الجولة</h2>
                  <p className="whitespace-pre-wrap break-words text-sm leading-8 text-white/70">{ride.description}</p>
                </div>
              )}

              <div className={`${glass} p-6 sm:p-8`}>
                <h2 className="mb-6 flex items-center gap-2 border-b border-white/10 pb-2 text-xl font-black">
                  <Navigation size={20} className="text-[#F9EA02]" /> مسار الرحلة
                </h2>
                <div className="w-full overflow-hidden">
                  <div className="scrollbar-hide w-full snap-x snap-mandatory overflow-x-auto pb-4">
                    <div className="flex min-w-max items-start gap-3 px-2">
                      <div className="flex shrink-0 snap-start flex-col items-center gap-2">
                        <div className="grid size-12 place-items-center rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]"><MapPin size={20} /></div>
                        <div className="text-center"><p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">التجمع</p><p className="mt-0.5 max-w-[120px] truncate text-xs font-bold text-white">{ride.meetingPoint}</p></div>
                      </div>
                      <div className="mt-6 h-0.5 w-10 shrink-0 bg-white/20" />
                      {pathSteps.map((step, idx) => (
                        <div key={idx} className="flex shrink-0 snap-start items-start gap-3">
                          <div className="flex flex-col items-center gap-2">
                            <div className="grid size-10 place-items-center rounded-full border border-[#F9EA02]/40 bg-[#F9EA02]/10 text-[#F9EA02]"><span className="text-xs font-black">{idx + 1}</span></div>
                            <div className="text-center"><p className="text-[10px] font-black uppercase tracking-widest text-[#F9EA02]">محطة</p><p className="mt-0.5 max-w-[120px] truncate text-xs font-bold text-white">{step}</p></div>
                          </div>
                          <div className="mt-5 h-0.5 w-10 shrink-0 bg-white/20" />
                        </div>
                      ))}
                      <div className="flex shrink-0 snap-start flex-col items-center gap-2">
                        <div className="grid size-12 place-items-center rounded-full border-2 border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.3)]"><Flag size={20} /></div>
                        <div className="text-center"><p className="text-[10px] font-black uppercase tracking-widest text-rose-400">النهاية</p><p className="mt-0.5 max-w-[120px] truncate text-xs font-bold text-white">{ride.endLocation}</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${glass} p-6 sm:p-8`}>
                <h2 className="mb-6 border-b border-white/10 pb-2 text-xl font-black">تفاصيل الرحلة</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail icon={Calendar} label="التاريخ" value={formatArabicDate(ride.rideDate)} />
                  <Detail icon={Clock} label="وقت الانطلاق" value={departureTime} ltr />
                  <Detail icon={Timer} label="المدة المتوقعة" value={formatDuration(ride.estimatedDurationMinutes)} />
                  <Detail icon={RouteIcon} label="المسافة" value={`${ride.distanceKM} كم`} ltr />
                  <Detail icon={Users} label="المشاركون" value={`${ride.currentParticipants}/${ride.maxParticipants}`} ltr />
                  <Detail icon={UserCircle} label="مشرف الرحلة" value={ride.supervisorName || "غير محدد"} />
                </div>
              </div>

              {ride.locationURL && (
                <div className={`${glass} p-6 sm:p-8`}>
                  <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
                    <h2 className="flex items-center gap-2 text-xl font-black"><Map size={20} className="text-[#F9EA02]" /> الموقع</h2>
                    <a href={ride.locationURL} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-[#F9EA02] hover:underline">فتح في خرائط جوجل <ExternalLink size={12} /></a>
                  </div>
                  <div className="h-[300px] w-full overflow-hidden rounded-2xl border border-white/10">
                    <iframe src={`${ride.locationURL}${ride.locationURL.includes("?") ? "&" : "?"}output=embed`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="خريطة موقع الجولة" />
                  </div>
                </div>
              )}
            </div>

            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <div className={`${glass} overflow-hidden`}>
                <div className="space-y-2 border-b border-white/10 p-6">
                  <p className="mb-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/40"><Tag size={12} /> تفاصيل الأسعار</p>
                  <PriceRow label="الاشتراك الأساسي" value={ride.basePrice} />
                  {ride.helmetPrice > 0 && <PriceRow label="إضافة خوذة" value={`+${ride.helmetPrice}`} />}
                  {ride.bikePrice > 0 && <PriceRow label="إضافة دراجة" value={`+${ride.bikePrice}`} />}
                </div>

                <div className="border-b border-white/10 p-6">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-white/50">المقاعد المتبقية</span>
                    <span className="font-mono font-black text-white"><span dir="ltr">{ride.maxParticipants - ride.currentParticipants}</span><span className="text-white/40"> / {ride.maxParticipants}</span></span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full transition-all ${rideStatus.canBook ? "bg-[#F9EA02]" : "bg-rose-500"}`} style={{ width: `${Math.min(100, (ride.currentParticipants / ride.maxParticipants) * 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-3 p-6">
                  {checkingBooking ? (
                    <div className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] py-3.5"><Loader2 size={20} className="animate-spin text-white/50" /></div>
                  ) : userBooking ? (
                    userBooking.statusBooking === "Review" ? (
                      <div className="space-y-2">
                        <div className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 py-3.5 text-center text-sm font-bold text-amber-400">حجزك قيد المراجعة</div>
                        <button onClick={() => setShowCancelModal(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-black text-rose-400 transition-colors hover:bg-rose-500/20"><XCircle size={14} /> إلغاء الحجز</button>
                      </div>
                    ) : userBooking.statusBooking === "Booked" ? (
                      <div className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3.5 text-center text-sm font-bold text-emerald-400">أنت مسجل في هذه الجولة</div>
                    ) : null
                  ) : rideStatus.canBook ? (
                    <button onClick={handleOpenBooking} className="w-full rounded-xl bg-[#F9EA02] py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98]">احجز مقعدك الآن</button>
                  ) : (
                    <div className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3.5 text-center text-sm font-bold text-white/50">{ride.status}</div>
                  )}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white/40"><ShieldCheck size={13} /> حجز آمن ومباشر</div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {bookingOpen && <BookingModal ride={ride} onClose={() => setBookingOpen(false)} onConfirm={handleConfirmBooking} />}

        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" onClick={() => !cancelling && setShowCancelModal(false)}>
            <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d10] shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-rose-500/15 text-rose-400"><AlertTriangle size={32} /></div>
                <h2 className="text-xl font-black">إلغاء الحجز</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/50">هل أنت متأكد من إلغاء حجزك؟ سيتم إزالة حجزك نهائياً ولن تتمكن من التراجع.</p>
              </div>
              <div className="flex gap-2 p-4 pt-0">
                <button onClick={() => setShowCancelModal(false)} disabled={cancelling} className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-black text-white/70 transition hover:bg-white/10 disabled:opacity-50">تراجع</button>
                <button onClick={confirmCancelBooking} disabled={cancelling} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 py-3 text-sm font-black text-white transition hover:bg-rose-600 disabled:opacity-50">
                  {cancelling ? <Loader2 size={16} className="animate-spin" /> : "نعم، إلغاء"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function Detail({ icon: Icon, label, value, ltr }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
      <Icon size={20} className="shrink-0 text-[#F9EA02]" />
      <div className="min-w-0">
        <p className="text-xs text-white/50">{label}</p>
        <p dir={ltr ? "ltr" : "rtl"} className={`break-words text-sm font-bold ${ltr ? "font-mono" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs font-bold text-white/60">
      <span>{label}</span>
      <span className="font-mono text-white">{value} ل.س</span>
    </div>
  );
}