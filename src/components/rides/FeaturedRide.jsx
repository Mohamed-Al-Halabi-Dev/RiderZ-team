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

export default function FeaturedRide({ ride }) {
  const level = getLevel(ride.level);
  const status = getStatus(ride.status);

  return (
    <Link
      to={`/rides/${ride.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c0e] shadow-2xl lg:block"
    >
      {/* ═══ الجزء العلوي: الصورة ═══ */}
      <div className="relative aspect-[16/10] w-full shrink-0 lg:aspect-[21/9]">
        <img
          src={imgFor(ride)}
          alt={ride.title}
          width={1200}
          height={600}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* تدرج لدمج الصورة مع الخلفية على الموبايل، وتدرج سينمائي على اللابتوب */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/20 to-transparent lg:from-black lg:via-black/60 lg:to-black/10" />
        <div className="absolute inset-0 hidden bg-gradient-to-l from-black/90 via-black/40 to-transparent lg:block" />

        {/* شارة "الرحلة القادمة" */}
        <div className="absolute end-4 top-4 lg:end-6 lg:top-6 inline-flex items-center gap-2 rounded-full border border-[#F9EA02]/40 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
          <span className="size-1.5 animate-pulse rounded-full bg-[#F9EA02]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#F9EA02] lg:text-[11px]">
            الرحلة القادمة
          </span>
        </div>

        {/* حالة الرحلة */}
        <div className="absolute start-4 top-4 lg:start-6 lg:top-6">
          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-black backdrop-blur-md lg:text-[11px] ${status.bg} ${status.text}`}
          >
            {ride.status}
          </span>
        </div>
      </div>

      {/* ═══ الجزء السفلي: النصوص ═══ */}
      <div className="relative flex w-full flex-col justify-center p-5 sm:p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:bg-transparent lg:p-10">
        <div className="me-auto w-full max-w-2xl space-y-3 lg:space-y-4">
          
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#F9EA02]">
            <MapPin size={14} strokeWidth={2.5} className="shrink-0" />
            <span className="truncate">{ride.path || "مسار غير محدد"}</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">{ride.rideDateDisplay}</span>
          </div>

          <h2 className="line-clamp-2 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-5xl">
            {ride.title}
          </h2>

          {ride.description && (
            <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-white/60 lg:text-base lg:leading-7 lg:text-white/70">
              {ride.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
            <div className="flex items-center gap-1.5">
              <Route size={16} strokeWidth={2.5} className="text-white/40" />
              <span dir="ltr" className="font-mono text-xs font-black text-white sm:text-sm">
                {ride.distanceKM} km
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users size={16} strokeWidth={2.5} className="text-white/40" />
              <span dir="ltr" className="font-mono text-xs font-black text-white sm:text-sm">
                {ride.currentParticipants}/{ride.maxParticipants}
              </span>
            </div>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black text-white sm:text-[11px] ${level.bg}`}
            >
              {level.label}
            </span>
          </div>

          {/* الزر والسعر */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 lg:justify-start lg:gap-6">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-black text-[#F9EA02] lg:text-3xl">{ride.basePrice}</span>
              <span className="text-[11px] font-bold text-white/50">ل.س</span>
            </div>

            {status.canBook ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-[#F9EA02] px-4 py-2.5 text-xs font-black text-black transition group-hover:bg-[#F9EA02]/90 lg:rounded-full lg:px-5 lg:text-sm">
                احجز مقعدك
                <ArrowLeft size={16} strokeWidth={2.5} className="transition group-hover:-translate-x-1" />
              </span>
            ) : (
              <span className="text-xs font-bold text-white/40">غير متاح للحجز</span>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}