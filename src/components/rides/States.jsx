

export function ErrorState({ onRetry }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-rose-500/20 bg-rose-500/5 py-16 text-center">
      <p className="text-white/70">صار خطأ أثناء تحميل الجولات.</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-[#F9EA02] px-5 py-2.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-95"
      >
        جرّب مرة تانية
      </button>
    </div>
  );
}



export function EmptyState({ search, onClear }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
      <p className="text-white/60">
        {search ? `ما في نتائج مطابقة لـ "${search}"` : "ما في جولات."}
      </p>

      {search && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-bold text-white/70 transition hover:border-[#F9EA02]/40 hover:text-[#F9EA02]"
        >
          مسح البحث
        </button>
      )}
    </div>
  );
}