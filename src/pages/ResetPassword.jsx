import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../config/api";
import {
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

// ✅ خففنا الـ blur
const glass =
  "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pe-11 ps-11 text-[14px] font-semibold text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#F9EA02]/50 focus:ring-2 focus:ring-[#F9EA02]/20";

const iconClass =
  "absolute inset-y-0 start-4 flex items-center text-white/40 pointer-events-none";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(
        "رابط غير صالح. يرجى طلب رابط جديد من صفحة 'نسيت كلمة المرور'."
      );
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (!token) {
      setError("الرابط غير صالح.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        token,
        newPassword: password,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/login", { state: { passwordReset: true } });
      }, 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        "حدث خطأ. الرابط قد يكون منتهي الصلاحية أو مستخدم من قبل.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-y-auto p-4 py-12 text-white"
    >
      {/* ✅ شلنا الخلفية المكررة، PageBackground بتظهر من App.jsx */}

      <div className={`relative my-8 w-full max-w-md p-6 sm:p-8 ${glass}`}>
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-bold text-white/50 transition-colors hover:text-white"
        >
          <ArrowRight size={14} /> رجوع لتسجيل الدخول
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-[#F9EA02] text-black shadow-lg shadow-[#F9EA02]/20">
            <KeyRound size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black sm:text-3xl">
            تعيين كلمة مرور جديدة
          </h1>
          <p className="mt-2 text-sm font-bold text-white/40">
            اختر كلمة مرور قوية لحسابك
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <CheckCircle2 size={40} className="text-emerald-400" />
              <p className="text-lg font-black text-emerald-300">
                تم تغيير كلمة المرور!
              </p>
              <p className="text-xs font-bold text-white/60">
                جاري تحويلك لصفحة تسجيل الدخول...
              </p>
            </div>
            <div className="flex justify-center">
              <Loader2 size={20} className="animate-spin text-[#F9EA02]" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="relative">
              <div className={iconClass}>
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور الجديدة"
                dir="ltr"
                className={`${inputClass} text-end`}
                required
                autoComplete="new-password"
                disabled={!token}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-3 flex items-center text-white/40 transition-colors hover:text-[#F9EA02]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <div className={iconClass}>
                <ShieldCheck size={16} />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تأكيد كلمة المرور"
                dir="ltr"
                className={`${inputClass} text-end`}
                required
                autoComplete="new-password"
                disabled={!token}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 end-3 flex items-center text-white/40 transition-colors hover:text-[#F9EA02]"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-300">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F9EA02] py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> جارٍ التعيين...
                </>
              ) : (
                "تعيين كلمة المرور"
              )}
            </button>

            <p className="mt-4 text-center text-xs font-bold text-white/40">
              الرابط منتهي الصلاحية؟{" "}
              <Link
                to="/forgot-password"
                className="text-[#F9EA02] hover:underline"
              >
                طلب رابط جديد
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}