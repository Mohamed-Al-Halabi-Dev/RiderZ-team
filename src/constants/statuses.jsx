/* ═══════════════════════════════════════════════
   حالات الرحلة — 5 حالات من الـ API
   ═══════════════════════════════════════════════ */

export const STATUSES = {
  "متاح":        { label: "متاح",        bg: "bg-emerald-500/90", text: "text-white", canBook: true  },
  "أكتمل العدد": { label: "أكتمل العدد", bg: "bg-rose-500/90",    text: "text-white", canBook: false },
  "ملغى":        { label: "ملغى",        bg: "bg-zinc-600/90",    text: "text-white", canBook: false },
  "قد بدء":      { label: "قد بدء",      bg: "bg-amber-500/90",   text: "text-white", canBook: false },
  "منتهي":       { label: "منتهي",       bg: "bg-zinc-700/90",    text: "text-white", canBook: false },
};

export const DEFAULT_STATUS = {
  label: "غير معروف",
  bg: "bg-white/20",
  text: "text-white",
  canBook: false,
};

export const getStatus = (statusKey) => STATUSES[statusKey] ?? DEFAULT_STATUS;