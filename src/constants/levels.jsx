/* ═══════════════════════════════════════════════
   مستويات الرحلات — 3 مستويات × 3 فئات
   ═══════════════════════════════════════════════ */

export const LEVELS = {
  Beginner_A:     { label: "مبتدئ A",  bg: "bg-emerald-400/90" },
  Beginner_B:     { label: "مبتدئ B",  bg: "bg-emerald-500/90" },
  Beginner_C:     { label: "مبتدئ C",  bg: "bg-emerald-600/90" },

  Intermediate_A: { label: "متوسط A",  bg: "bg-amber-400/90" },
  Intermediate_B: { label: "متوسط B",  bg: "bg-amber-500/90" },
  Intermediate_C: { label: "متوسط C",  bg: "bg-amber-600/90" },

  Advanced_A:     { label: "متقدّم A", bg: "bg-rose-400/90" },
  Advanced_B:     { label: "متقدّم B", bg: "bg-rose-500/90" },
  Advanced_C:     { label: "متقدّم C", bg: "bg-rose-600/90" },
};

export const DEFAULT_LEVEL = { label: "غير معروف", bg: "bg-white/20" };

export const getLevel = (key) =>
  LEVELS[key] ?? { ...DEFAULT_LEVEL, label: key };