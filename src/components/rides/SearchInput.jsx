import { Search, X } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "ابحث…",
}) {
  return (
    <div className="relative w-full">
      <Search
        size={20}
        strokeWidth={2.5}
        className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-white/40"
      />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="بحث الجولات"
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 ps-12 pe-10 text-sm font-semibold
                   text-white placeholder:text-white/40
                   focus:border-[#F9EA02]/50 focus:bg-white/[0.05] focus:outline-none
                   focus:ring-2 focus:ring-[#F9EA02]/25"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="مسح البحث"
          className="absolute end-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}