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
      className="group relative block overflow-hidden rounded-[2rem] border border-white/10 bg-black"
    >
      <div className="relative aspect-[16/9] sm:aspect-[21/9]">
        {/* ✅ تحسين صورة الجولة المميزة */}
        <img
          src={imgFor(ride)}
          alt={ride.title}
          width={1200}
          height={600}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-l from-black/90 via-black/40 to-transparent" />

        {/* شارة "الرحلة القادمة" */}
        <div className="absolute end-6 top-6 inline-flex items-center gap-2 rounded-full border border-[#F9EA02]/40 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
          <span className="size-1.5 animate-pulse rounded-full bg-[#F9EA02]" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[#F9EA02]">
            الرحلة القادمة
          </span>
        </div>

        {/* حالة الرحلة */}
        <div className="absolute start-6 top-6">
          <span
            className={`rounded-full px-3 py-1.5 text-[11px] font-black backdrop-blur-md ${status.bg} ${status.text}`}
          >
            {ride.status}
          </span>
        </div>

        {/* المحتوى السفلي */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <div className="me-auto max-w-2xl space-y-4">

            <div className="flex items-center gap-2 text-xs font-bold text-[#F9EA02]">
              <MapPin size={16} strokeWidth={2.5} />
              <span>{ride.path}</span>
              <span className="text-white/30">•</span>
              <span className="text-white/60">{ride.rideDateDisplay}</span>
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              {ride.title}
            </h2>

            {ride.description && (
              <p className="line-clamp-2 max-w-xl text-sm font-semibold leading-7 text-white/70 sm:text-base">
                {ride.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Route size={16} strokeWidth={2.5} className="text-white/40" />
                <span dir="ltr" className="font-mono text-sm font-black text-white">
                  {ride.distanceKM} km
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} strokeWidth={2.5} className="text-white/40" />
                <span dir="ltr" className="font-mono text-sm font-black text-white">
                  {ride.currentParticipants}/{ride.maxParticipants}
                </span>
              </div>

              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black text-white ${level.bg}`}
              >
                {level.label}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-3">
              {status.canBook && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F9EA02] px-5 py-2.5 text-sm font-black text-black transition group-hover:bg-[#F9EA02]/90">
                  احجز مقعدك
                  <ArrowLeft size={16} strokeWidth={2.5} className="transition group-hover:-translate-x-1" />
                </span>
              )}

              <span className="inline-flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-black text-[#F9EA02]">{ride.basePrice}</span>
                <span className="text-[11px] font-bold text-white/50">ل.س</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}