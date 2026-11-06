import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../config/api";
import {
  User, Lock, Eye, EyeOff, Loader2, AlertTriangle, ArrowLeft, CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Seo from "../components/Seo";

const glass = "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";
const fieldWrapper = "flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition focus-within:border-[#F9EA02]/50 focus-within:ring-2 focus-within:ring-[#F9EA02]/20";
const fieldInput = "min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-white placeholder:text-white/25 outline-none";
const fieldIcon = "shrink-0 text-white/40";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/";
  const registered = location.state?.registered;
  const passwordReset = location.state?.passwordReset;

  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) return setError("أدخل البريد أو اسم المستخدم.");
    if (!password) return setError("أدخل كلمة المرور.");

    setLoading(true);

    try {
      const isEmail = identifier.includes("@");
      const body = {
        username: isEmail ? "" : identifier.trim(),
        email: isEmail ? identifier.trim() : "",
        password,
      };

      const res = await api.post("/api/auth/login", body);

      // ✅ بناءً على الـ JSON: البيانات موجودة في res.data.data.token
      const data = res.data?.data?.token;

      if (!data?.token) {
        setError("رد غير متوقع من السيرفر.");
        return;
      }

      login({
        id: data.id,
        role: data.role,
        token: data.token,
        refreshToken: data.refreshToken, // ✅ تمرير التوكن الجديد
      });

      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        "البريد أو كلمة المرور غلط.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="تسجيل الدخول" description="سجّل دخولك إلى RiderZ لمتابعة جولاتك وحجوزاتك." canonicalPath="/login" noindex={true} />
      <main dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-y-auto bg-[#08080c] p-4 py-12 text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -start-40 size-[500px] rounded-full bg-[#F9EA02]/15 blur-[120px]" />
          <div className="absolute -bottom-40 -end-40 size-[500px] rounded-full bg-purple-500/15 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 size-[400px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className={`relative my-8 w-full max-w-md p-6 sm:p-8 ${glass}`}>
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-bold text-white/50 transition hover:text-white">
            <ArrowLeft size={14} className="rotate-180" /> رجوع للرئيسية
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-black sm:text-3xl">أهلًا <span className="text-[#F9EA02]">بعودتك</span></h1>
            <p className="mt-2 text-sm font-bold text-white/40">سجّل دخولك لمتابعة جولاتك</p>
          </div>

          {registered && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
              <CheckCircle2 size={18} className="shrink-0" />
              <p>تم إنشاء حسابك بنجاح! سجّل دخولك الآن.</p>
            </div>
          )}

          {passwordReset && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
              <CheckCircle2 size={18} className="shrink-0" />
              <p>تم تغيير كلمة المرور بنجاح! سجّل دخولك الآن.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-bold text-rose-300">
              <AlertTriangle size={18} className="shrink-0" /> <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={fieldWrapper} dir="ltr">
              <User size={16} className={fieldIcon} />
              <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="البريد الإلكتروني أو اسم المستخدم" autoComplete="username" dir="ltr" className={fieldInput} />
            </div>

            <div className={fieldWrapper} dir="ltr">
              <Lock size={16} className={fieldIcon} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" autoComplete="current-password" dir="ltr" className={fieldInput} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="shrink-0 text-white/40 transition hover:text-[#F9EA02]" tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-[11px] font-bold text-white/40 transition hover:text-[#F9EA02]">نسيت كلمة المرور؟</Link>
            </div>

            <button type="submit" disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F9EA02] py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98] disabled:opacity-50">
              {loading ? <><Loader2 size={18} className="animate-spin" /> جاري الدخول...</> : <>تسجيل الدخول <ArrowLeft size={16} /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-bold text-white/50">
            ليس لديك حساب؟ <Link to="/signup" className="text-[#F9EA02] hover:underline">أنشئ حسابك الآن</Link>
          </p>
        </div>
      </main>
    </>
  );
}