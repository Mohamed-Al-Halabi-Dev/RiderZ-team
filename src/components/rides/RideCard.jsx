import { Link } from "react-router-dom";
import { MapPin, Route, Users, ArrowLeft } from "lucide-react";
import { getLevel } from "../../constants/levels";
import { getStatus } from "../../constants/statuses";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80";

const imgFor = (ride) => {
  const url = ride.imageUrl;
  if (!url || url.includes("example.com")) return FALLBACK_IMG;
  return url;
};

export default function RideCard({ ride }) {
  const level = getLevel(ride.level);
  const status = getStatus(ride.status);

  return (
    <Link
      to={`/rides/${ride.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0c0c0e] shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-xl"
    >
      {/* ═══ الجزء العلوي: الصورة ═══ */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
        <img
          src={imgFor(ride)}
          alt={ride.title}
          width={600}
          height={400}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* تدرج لدمج الصورة مع الخلفية */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/20 to-transparent" />

        {/* شارة "الرحلة القادمة" (أو التاريخ) */}
        <div className="absolute end-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#F9EA02]/40 bg-black/60 px-3 py-1 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-[#F9EA02]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#F9EA02]">
            {ride.rideDateDisplay}
          </span>
        </div>

        {/* حالة الرحلة */}
        <div className="absolute start-4 top-4">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black backdrop-blur-md ${status.bg} ${status.text}`}
          >
            {ride.status}
          </span>
        </div>
      </div>

      {/* ═══ الجزء السفلي: المحتوى ═══ */}
      <div className="relative flex w-full flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-3">
          
          {/* الموقع والتاريخ */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F9EA02]">
            <MapPin size={12} strokeWidth={2.5} className="shrink-0" />
            <span className="truncate">{ride.path || "مسار غير محدد"}</span>
          </div>

          {/* العنوان */}
          <h3 className="line-clamp-2 text-base font-black leading-tight tracking-tight text-white sm:text-lg">
            {ride.title}
          </h3>

          {/* المسافة والمشاركين والمستوى */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            <div className="flex items-center gap-1">
              <Route size={14} strokeWidth={2.5} className="text-white/40" />
              <span dir="ltr" className="font-mono text-[11px] font-black text-white">
                {ride.distanceKM}km
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Users size={14} strokeWidth={2.5} className="text-white/40" />
              <span dir="ltr" className="font-mono text-[11px] font-black text-white">
                {ride.currentParticipants}/{ride.maxParticipants}
              </span>
            </div>

            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black text-white ${level.bg}`}
            >
              {level.label}
            </span>
          </div>
        </div>

        {/* الزر والسعر */}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xl font-black text-[#F9EA02]">{ride.basePrice}</span>
            <span className="text-[10px] font-bold text-white/50">ل.س</span>
          </div>

          {status.canBook ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F9EA02] px-3.5 py-1.5 text-xs font-black text-black transition group-hover:bg-[#F9EA02]/90">
              احجز
              <ArrowLeft size={14} strokeWidth={2.5} className="transition group-hover:-translate-x-1" />
            </span>
          ) : (
            <span className="text-[11px] font-bold text-white/40">غير متاح</span>
          )}
        </div>
      </div>
    </Link>
  );
}