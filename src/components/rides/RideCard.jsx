import { Link } from "react-router-dom";
import { Route, Users, ArrowLeft } from "lucide-react";
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
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-black"
    >
      <div className="relative aspect-4/3 sm:aspect-16/10">
        <img
    src={imgFor(ride)}
    alt={ride.title}
    width={600}
    height={400}
    loading="lazy"
    decoding="async"
    className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
  />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-l from-black/90 via-black/40 to-transparent" />

        {/* التاريخ */}
        <div className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#F9EA02]/40 bg-black/60 px-2.5 py-1 backdrop-blur-md">
          <span className="size-1 rounded-full bg-[#F9EA02]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#F9EA02]">
            {ride.rideDateDisplay}
          </span>
        </div>

        {/* الحالة */}
        <div className="absolute start-4 top-4">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black backdrop-blur-md ${status.bg} ${status.text}`}
          >
            {ride.status}
          </span>
        </div>

        {/* المحتوى السفلي */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-base font-black leading-snug tracking-tight text-white sm:text-lg">
              {ride.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[10px]">
              <span className="flex items-center gap-1">
                <Route size={12} strokeWidth={2.5} className="text-white/40" />
                <span dir="ltr" className="font-mono font-black text-white">
                  {ride.distanceKM}km
                </span>
              </span>
              <span className="text-white/20">·</span>
              <span className="flex items-center gap-1">
                <Users size={12} strokeWidth={2.5} className="text-white/40" />
                <span dir="ltr" className="font-mono font-black text-white">
                  {ride.currentParticipants}/{ride.maxParticipants}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {status.canBook && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F9EA02] px-3.5 py-1.5 text-[11px] font-black text-black transition group-hover:bg-[#F9EA02]/90">
                  احجز
                  <ArrowLeft size={12} strokeWidth={2.5} className="transition group-hover:-translate-x-0.5" />
                </span>
              )}

              <span
                className={`${status.canBook ? "ms-auto" : ""} inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black text-white ${level.bg}`}
              >
                {level.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}