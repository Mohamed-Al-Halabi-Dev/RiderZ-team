import { Link } from "react-router-dom";
import { Compass, ArrowRight } from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="grid min-h-screen place-items-center bg-[#08080c] px-4 text-white"
    >
      <div className={`${glass} w-full max-w-md p-8 text-center`}>
        <p className="font-mono text-6xl font-black text-[#F9EA02]">404</p>
        <div className="mx-auto mt-4 grid size-16 place-items-center rounded-2xl bg-white/5 text-white/60">
          <Compass size={32} />
        </div>
        <h1 className="mt-4 text-2xl font-black">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm text-white/50">
          يبدو أنك ضللت الطريق. خلينا نرجعك للمسار الصح.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F9EA02] px-6 py-3 text-sm font-black text-black transition hover:bg-[#F9EA02]/90"
          >
            <ArrowRight size={14} /> الرئيسية
          </Link>
          <Link
            to="/rides"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            تصفح الجولات
          </Link>
        </div>
      </div>
    </main>
  );
}