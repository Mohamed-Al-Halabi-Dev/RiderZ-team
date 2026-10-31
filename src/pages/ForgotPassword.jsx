import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import {
  ArrowRight,
  Mail,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pe-4 ps-11 text-[14px] font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-[#F9EA02]/50 focus:ring-2 focus:ring-[#F9EA02]/20";

const iconClass =
  "absolute inset-y-0 start-4 flex items-center text-white/40 pointer-events-none";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0] ||
          "حدث خطأ. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-y-auto bg-[#08080c] p-4 py-12 text-white"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -start-40 size-[500px] rounded-full bg-[#F9EA02]/15 blur-[120px]" />
        <div className="absolute -bottom-40 -end-40 size-[500px] rounded-full bg-purple-500/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 size-[400px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className={`relative my-8 w-full max-w-md p-6 sm:p-8 ${glass}`}>
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-bold text-white/50 transition hover:text-white"
        >
          <ArrowRight size={14} /> رجوع لتسجيل الدخول
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-[#F9EA02] text-black shadow-lg shadow-[#F9EA02]/20">
            <Mail size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black sm:text-3xl">
            نسيت كلمة المرور؟
          </h1>
          <p className="mt-2 text-sm font-bold text-white/40">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <CheckCircle2 size={32} className="text-emerald-400" />
              <p className="text-base font-black text-emerald-300">
                تم إرسال الرابط!
              </p>
              <p className="text-xs font-bold leading-relaxed text-white/60">
                إذا كان البريد{" "}
                <span className="text-emerald-300">{email}</span> مسجلًا، ستجد
                رابط إعادة التعيين في صندوق الوارد خلال دقيقة.
              </p>
            </div>

            <p className="text-center text-[11px] font-bold text-white/30">
              لم تستلم الإيميل؟ تحقق من مجلد "الرسائل غير المرغوب فيها"
            </p>

            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              إرسال لبريد آخر
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className={iconClass}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                dir="ltr"
                className={`${inputClass} text-end`}
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-300">
                <AlertTriangle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F9EA02] py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> جارٍ الإرسال...
                </>
              ) : (
                "إرسال رابط إعادة التعيين"
              )}
            </button>
          </form>
        )}

        {!sent && (
          <p className="mt-6 text-center text-sm font-bold text-white/50">
            تذكرت كلمة المرور؟{" "}
            <Link to="/login" className="text-[#F9EA02] hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}