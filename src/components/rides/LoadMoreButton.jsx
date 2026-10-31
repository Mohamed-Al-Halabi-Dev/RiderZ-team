import { ArrowLeft } from "lucide-react";

/* ═══════════════════════════════════════════════
   LoadMoreButton
   ─ loading: جاري جلب المزيد؟
   ─ hasMore: في صفحات إضافية؟
   ─ onClick: دالة الجلب
   ═══════════════════════════════════════════════ */

export default function LoadMoreButton({ loading, hasMore, onClick }) {
  /* ═══ ما في صفحات إضافية ═══ */
  if (!hasMore) {
    return (
      <p className="text-xs font-bold uppercase tracking-widest text-white/30">
        وصلت لآخر جولة
      </p>
    );
  }

  /* ═══ في صفحات ═══ */
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-black text-white/70
                 transition hover:border-[#F9EA02]/40 hover:text-[#F9EA02] disabled:opacity-50"
    >
      {loading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-[#F9EA02]" />
          جاري التحميل...
        </>
      ) : (
        <>
          عرض المزيد من الجولات
          <ArrowLeft
            size={16}
            strokeWidth={2.5}
            className="transition group-hover:-translate-x-1"
          />
        </>
      )}
    </button>
  );
}