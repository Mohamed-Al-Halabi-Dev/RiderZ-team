import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  AlertCircle,
  Loader2,
  Bike as BikeIcon,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Seo from "../components/Seo";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

const fieldWrapper =
  "flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition focus-within:border-[#F9EA02]/50 focus-within:ring-2 focus-within:ring-[#F9EA02]/20";

const fieldInput =
  "min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-white placeholder:text-white/25 outline-none";

const fieldIcon = "shrink-0 text-white/40";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    has_Bike: false,
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // التحقق اليدوي من الحقول
    if (!form.firstName.trim()) {
      setError("الرجاء إدخال الاسم الأول");
      setLoading(false);
      return;
    }
    if (!form.lastName.trim()) {
      setError("الرجاء إدخال اسم العائلة");
      setLoading(false);
      return;
    }
    if (!form.username.trim()) {
      setError("الرجاء إدخال اسم المستخدم");
      setLoading(false);
      return;
    }

    // التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      setError("الرجاء إدخال بريد إلكتروني صحيح");
      setLoading(false);
      return;
    }

    // التحقق من رقم الهاتف الأساسي
    const phoneRegex = /^09\d{8}$/;
    if (!form.phone.trim() || !phoneRegex.test(form.phone.trim())) {
      setError("رقم الهاتف يجب أن يبدأ بـ 09 ويتكون من 10 أرقام (مثال: 0912345678)");
      setLoading(false);
      return;
    }

    // التحقق من كلمة المرور
    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      setLoading(false);
      return;
    }

    // التحقق من رقم هاتف الطوارئ (إذا تم إدخاله)
    if (form.emergencyContactPhone.trim() && !phoneRegex.test(form.emergencyContactPhone.trim())) {
      setError("رقم هاتف الطوارئ يجب أن يبدأ بـ 09 ويتكون من 10 أرقام");
      setLoading(false);
      return;
    }

    try {
      // ─── 1. إنشاء الحساب ───
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        has_Bike: form.has_Bike,
        emergencyContactName: form.emergencyContactName.trim() || null,
        emergencyContactPhone: form.emergencyContactPhone.trim() || null,
      };

      const registerRes = await api.post("/api/auth/register", payload);

      if (registerRes.data?.success === false) {
        throw new Error(registerRes.data?.message || "فشل إنشاء الحساب");
      }

      // ─── 2. تسجيل الدخول تلقائياً ───
      const loginBody = {
        username: form.username.trim(),
        email: "",
        password: form.password,
      };

      const loginRes = await api.post("/api/auth/login", loginBody);
      
      // ✅ بناءً على شكل الـ JSON: البيانات موجودة في loginRes.data.data.token
      const data = loginRes.data?.data?.token;

      if (!data?.token) {
        // الحساب انشأ، بس الدخول التلقائي فشل → نوديه Login مع رسالة
        setSuccess(true);
        setTimeout(() => {
          navigate("/login", { state: { registered: true } });
        }, 1200);
        return;
      }

      // ─── 3. دخول مباشر عالموقع ───
      login({
        id: data.id,
        role: data.role,
        token: data.token,
        refreshToken: data.refreshToken, // ✅ تمرير الـ Refresh Token
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 800);
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err);
      const errorMsg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors) &&
          err.response.data.errors[0]) ||
        err.message ||
        "حدث خطأ أثناء إنشاء الحساب. تأكد من البيانات وحاول مجدداً.";
      setError(String(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="إنشاء حساب جديد"
        description="انضم إلى RiderZ وأنشئ حسابك المجاني. ابدأ رحلتك في عالم الدراجات الهوائية."
        noindex={true}
      />
      <main
        dir="rtl"
        className="relative flex min-h-screen items-center justify-center overflow-y-auto bg-[#08080c] p-4 py-12 text-white"
      >
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -start-40 size-[500px] rounded-full bg-[#F9EA02]/15 blur-[120px]" />
          <div className="absolute -bottom-40 -end-40 size-[500px] rounded-full bg-purple-500/15 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 size-[400px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className={`relative my-8 w-full max-w-xl p-6 sm:p-8 ${glass}`}>
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-bold text-white/50 transition hover:text-white"
          >
            <ArrowRight size={14} /> رجوع للرئيسية
          </Link>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-[#F9EA02] text-black shadow-lg shadow-[#F9EA02]/20">
              <UserPlus size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black sm:text-3xl">انضم إلى RiderZ</h1>
            <p className="mt-2 text-sm font-bold text-white/40">
              أنشئ حسابك وابدأ رحلتك معنا
            </p>
          </div>

          {success && (
            <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
              <CheckCircle2 size={18} /> تم إنشاء حسابك! جاري تحويلك...
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-bold text-rose-300">
              <AlertCircle size={18} className="shrink-0" /> <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={fieldWrapper}>
                <User size={16} className={fieldIcon} />
                <input
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="الاسم الأول"
                  value={form.firstName}
                  onChange={handleChange}
                  className={fieldInput}
                />
              </div>
              <div className={fieldWrapper}>
                <User size={16} className={fieldIcon} />
                <input
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="اسم العائلة"
                  value={form.lastName}
                  onChange={handleChange}
                  className={fieldInput}
                />
              </div>
            </div>

            <div className={fieldWrapper} dir="ltr">
              <User size={16} className={fieldIcon} />
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="اسم المستخدم (Username)"
                value={form.username}
                onChange={handleChange}
                dir="ltr"
                className={fieldInput}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className={fieldWrapper} dir="ltr">
                <Mail size={16} className={fieldIcon} />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="البريد الإلكتروني"
                  value={form.email}
                  onChange={handleChange}
                  dir="ltr"
                  className={fieldInput}
                />
              </div>
              <div className={fieldWrapper} dir="ltr">
                <Phone size={16} className={fieldIcon} />
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="09xxxxxxxx"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  dir="ltr"
                  className={fieldInput}
                />
              </div>
            </div>

            <div className={fieldWrapper} dir="ltr">
              <Lock size={16} className={fieldIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="كلمة المرور"
                value={form.password}
                onChange={handleChange}
                dir="ltr"
                className={fieldInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 text-white/40 transition hover:text-[#F9EA02]"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <BikeIcon
                  size={18}
                  className={form.has_Bike ? "text-[#F9EA02]" : "text-white/40"}
                />
                <span className="text-sm font-bold text-white">
                  هل تمتلك دراجة خاصة؟
                </span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="has_Bike"
                  checked={form.has_Bike}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-white/10 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#F9EA02] peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-black rtl:peer-checked:after:-translate-x-full"></div>
              </label>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400">
                <AlertTriangle size={14} /> جهة الاتصال للطوارئ
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className={fieldWrapper}>
                  <User size={16} className={fieldIcon} />
                  <input
                    type="text"
                    name="emergencyContactName"
                    autoComplete="off"
                    placeholder="اسم الشخص"
                    value={form.emergencyContactName}
                    onChange={handleChange}
                    className={fieldInput}
                  />
                </div>
                <div className={fieldWrapper} dir="ltr">
                  <Phone size={16} className={fieldIcon} />
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    autoComplete="off"
                    placeholder="09xxxxxxxx"
                    value={form.emergencyContactPhone}
                    onChange={handleChange}
                    maxLength={10}
                    dir="ltr"
                    className={fieldInput}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F9EA02] py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} /> إنشاء الحساب
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-bold text-white/50">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-[#F9EA02] hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}