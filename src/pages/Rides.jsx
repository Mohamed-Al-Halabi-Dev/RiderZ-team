import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import FeaturedRide from "../components/rides/FeaturedRide";
import RideCard from "../components/rides/RideCard";
import RidesHeader from "../components/rides/RidesHeader";
import LoadMoreButton from "../components/rides/LoadMoreButton";
import { SkeletonCard, SkeletonHero } from "../components/rides/Skeleton";
import { ErrorState, EmptyState } from "../components/rides/States";

import { useDebounce } from "../hooks/useDebounce";
import { useRides } from "../hooks/useRides";
import { filterRides, pickFeatured, pickRest } from "../lib/ridesHelpers";
import Seo from "../components/Seo";

// ✅ خففنا الـ blur
const glass = "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";

export default function Rides() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const debouncedSearch = useDebounce(search, 300);

  const { rides, status, hasMore, loadingMore, loadMore, retry } = useRides();

  const handleSearch = (value) => {
    const next = new URLSearchParams(params);
    if (value.trim()) next.set("q", value);
    else next.delete("q");
    setParams(next, { replace: true });
  };

  const clearSearch = () => handleSearch("");

  const filtered = useMemo(
    () => filterRides(rides, debouncedSearch),
    [rides, debouncedSearch]
  );

  const featured = useMemo(() => pickFeatured(filtered), [filtered]);
  const rest = useMemo(() => pickRest(filtered, featured), [filtered, featured]);

  return (
    <>
      <Seo
        title="الجولات القادمة"
        description="استكشف أقوى جولات الدراجات في سوريا. احجز مكانك، اختر دراجتك، وانضم للمغامرة."
        canonicalPath="/rides"
      />
      {/* ✅ شلنا bg-[#08080c] عشان PageBackground تظهر من ورا */}
      <main
        dir="rtl"
        className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 text-white sm:px-6 sm:pt-28"
      >
        <div className="relative mx-auto w-full max-w-6xl space-y-4">
          <div className={`${glass} p-5 sm:p-6`}>
            <RidesHeader
              count={rides.length}
              search={search}
              onSearch={handleSearch}
              onClear={clearSearch}
            />
          </div>

          {status === "loading" && (
            <>
              <div className={`${glass} overflow-hidden`}>
                <SkeletonHero />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </>
          )}

          {status === "error" && (
            <div className={`${glass} p-6`}>
              <ErrorState onRetry={retry} />
            </div>
          )}

          {status === "ready" && filtered.length === 0 && (
            <div className={`${glass} p-6`}>
              <EmptyState search={debouncedSearch} onClear={clearSearch} />
            </div>
          )}

          {status === "ready" && filtered.length > 0 && (
            <>
              {featured && (
                <div className={`${glass} overflow-hidden`}>
                  <FeaturedRide ride={featured} />
                </div>
              )}

              {rest.length > 0 && (
                <section className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 px-1">
                    <span className="h-px w-8 bg-[#F9EA02]" />
                    <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/60">
                      جولات أخرى
                    </h2>
                  </div>

                  <ul className="grid list-none gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    {rest.map((ride) => (
                      <li key={ride.id}>
                        <RideCard ride={ride} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="pt-4 text-center">
                <LoadMoreButton
                  loading={loadingMore}
                  hasMore={hasMore}
                  onClick={loadMore}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}