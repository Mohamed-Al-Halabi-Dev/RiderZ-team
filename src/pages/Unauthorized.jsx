import { Link } from "react-router-dom";
import { ShieldOff, ArrowRight } from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

export default function Unauthorized() {
  return (
    <main
      dir="rtl"
      className="grid min-h-screen place-items-center bg-[#08080c] px-4 text-white"
    >
      <div className={`${glass} w-full max-w-md p-8 text-center`}>
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-rose-500/15 text-rose-400">
          <ShieldOff size={32} />
        </div>
        <h1 className="text-2xl font-black">غير مصرح لك</h1>
        <p className="mt-2 text-sm text-white/50">
          ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F9EA02] px-6 py-3 text-sm font-black text-black transition hover:bg-[#F9EA02]/90"
        >
          <ArrowRight size={14} /> رجوع للرئيسية
        </Link>
      </div>
    </main>
  );
}