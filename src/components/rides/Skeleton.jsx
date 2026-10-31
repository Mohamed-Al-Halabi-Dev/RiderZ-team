export function SkeletonCard() {
  return (
    <div className="aspect-4/3 w-full animate-pulse rounded-3xl bg-white/[0.03] sm:aspect-16/10" />
  );
}

export function SkeletonHero() {
  return (
    <div className="aspect-[16/9] w-full animate-pulse rounded-[2rem] bg-white/[0.03] sm:aspect-[21/9]" />
  );
}