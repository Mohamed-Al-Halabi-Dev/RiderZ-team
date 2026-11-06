import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { API_URL } from "../config/api";
import {
  ArrowRight,
  Save,
  Upload,
  X,
  Camera,
  Bike as BikeIcon,
  AlertTriangle,
  Check,
  Loader2,
  Image as ImageIcon,
  Lock,
  User,
  ChevronDown,
} from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-[#F9EA02]/50 focus:ring-2 focus:ring-[#F9EA02]/20";
const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50";

const BIKE_TYPES = [
  { value: "Road", label: "طريق (Road)" },
  { value: "Mountain", label: "جبلية (Mountain)" },
  { value: "Hybrid", label: "هجينة (Hybrid)" },
];

const fixUrl = (url) =>
  !url ? "" : url.startsWith("/") ? `${API_URL}${url}` : url;

const extractUrl = (res) => {
  const d = res?.data;
  const url =
    d?.data?.imageUrl ||
    d?.data?.url ||
    d?.data?.image_URL ||
    d?.imageUrl ||
    d?.url ||
    d?.image_URL ||
    (typeof d === "string" ? d : null);
  return url && typeof url === "string" && url.trim() ? url.trim() : null;
};

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "", 
    profile_Image_URL: "",
    profile_Cover_URL: "",
    instagram_URL: "",
    facebook_URL: "",
    has_Bike: false,
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [bikeForm, setBikeForm] = useState({ bikeType: "", imageUrl: "" });
  const [bikeExists, setBikeExists] = useState(false);
  const [readonly, setReadonly] = useState({ email: "" }); 
  const [uploading, setUploading] = useState({
    image: false,
    cover: false,
    bike: false,
  });

  const imageInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const bikeInputRef = useRef(null);

  useEffect(() => {
    api
      .get("/api/users/me")
      .then(async (u) => {
        const user = u.data.data;
        setForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "", 
          profile_Image_URL: fixUrl(user.profile_Image_URL),
          profile_Cover_URL: fixUrl(user.profile_Cover_URL),
          instagram_URL: user.instagram_URL || "",
          facebook_URL: user.facebook_URL || "",
          has_Bike: !!user.hasBike,
          emergencyContactName: user.emergencyContactName || "",
          emergencyContactPhone: user.emergencyContactPhone || "",
        });
        setReadonly({ email: user.email || "" });

        if (user.hasBike) {
          try {
            const b = await api.get("/api/bikes/me");
            if (b?.data?.data) {
              setBikeForm({
                bikeType: b.data.data.bikeType || "",
                imageUrl: fixUrl(b.data.data.imageUrl),
              });
              setBikeExists(true);
            } else {
              setBikeExists(false);
            }
          } catch (bikeErr) {
            if (bikeErr.response?.status === 404) setBikeExists(false);
            else setBikeExists(true);
          }
        } else {
          setBikeExists(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setLoading(false);
          setStatus({ type: "error", message: "فشل تحميل البيانات" });
        }
      });
  }, [navigate]);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateBikeField = (key, value) =>
    setBikeForm((prev) => ({ ...prev, [key]: value }));

  const handleUpload = async (file, target) => {
    if (!file) return;
    setStatus(null);
    setUploading((prev) => ({ ...prev, [target]: true }));

    if (file.size > 10 * 1024 * 1024) {
      setStatus({
        type: "error",
        message: "حجم الصورة يجب ألا يتجاوز 10 ميجابايت",
      });
      setUploading((prev) => ({ ...prev, [target]: false }));
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/api/images/users", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      let url = extractUrl(res);
      if (!url) throw new Error("لم يتم استلام رابط الصورة من الخادم");
      url = fixUrl(url);

      if (target === "image") updateField("profile_Image_URL", url);
      else if (target === "cover") updateField("profile_Cover_URL", url);
      else updateBikeField("imageUrl", url);

      setStatus({ type: "success", message: "تم رفع الصورة بنجاح ✓" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors) &&
          err.response.data.errors[0]) ||
        err.message ||
        "فشل رفع الصورة";
      setStatus({ type: "error", message: String(errorMsg) });
    } finally {
      setUploading((prev) => ({ ...prev, [target]: false }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setStatus({ type: "error", message: "الاسم الأول واسم العائلة مطلوبان" });
      return;
    }

    const phoneRegex = /^09\d{8}$/;
    if (!form.phone.trim() || !phoneRegex.test(form.phone.trim())) {
      setStatus({
        type: "error",
        message: "رقم الهاتف يجب أن يبدأ بـ 09 ويتكون من 10 أرقام (مثال: 0912345678)",
      });
      return;
    }

    if (form.emergencyContactPhone.trim() && !phoneRegex.test(form.emergencyContactPhone.trim())) {
      setStatus({
        type: "error",
        message: "رقم هاتف الطوارئ يجب أن يبدأ بـ 09 ويتكون من 10 أرقام",
      });
      return;
    }

    if (form.has_Bike && !bikeForm.bikeType.trim()) {
      setStatus({ type: "error", message: "يرجى اختيار نوع الدراجة" });
      return;
    }

    setSaving(true);

    const userPayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      profile_Image_URL: form.profile_Image_URL.trim() || null,
      profile_Cover_URL: form.profile_Cover_URL.trim() || null,
      instagram_URL: form.instagram_URL.trim() || null,
      facebook_URL: form.facebook_URL.trim() || null,
      has_Bike: !!form.has_Bike,
      emergencyContactName: form.emergencyContactName.trim() || null,
      emergencyContactPhone: form.emergencyContactPhone.trim() || null,
    };

    try {
      const userRes = await api.put("/api/users/me", userPayload);
      if (userRes.data?.success === false) {
        throw new Error(userRes.data?.message || "الخادم رفض التحديث");
      }

      if (form.has_Bike && bikeForm.bikeType.trim()) {
        const bikePayload = {
          bikeType: bikeForm.bikeType.trim(),
          imageUrl: bikeForm.imageUrl.trim() || "",
        };
        if (bikeExists) await api.put("/api/bikes/me", bikePayload);
        else await api.post("/api/bikes", bikePayload);
      }

      setStatus({ type: "success", message: "تم حفظ التغييرات بنجاح ✓" });
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors) &&
          err.response.data.errors[0]) ||
        err.message ||
        "فشل حفظ التغييرات";
      setStatus({ type: "error", message: String(msg) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-[#08080c]">
        <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
      </div>
    );
  }

  return (
    <main dir="rtl" className="relative min-h-screen pb-28 pt-6 text-white">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            to="/profile"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-[12px] font-bold text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
          >
            <ArrowRight size={14} /> رجوع
          </Link>
          <h1 className="text-lg font-black sm:text-xl">تعديل الملف</h1>
          <span className="w-20" />
        </div>

        <form onSubmit={handleSave} noValidate className="space-y-4">
          <div className={`${glass} overflow-hidden`}>
            <div className="relative h-40 w-full bg-gradient-to-br from-[#F9EA02]/30 via-purple-500/20 to-cyan-400/10 sm:h-52">
              {form.profile_Cover_URL && (
                <img
                  src={form.profile_Cover_URL}
                  alt="Cover"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploading.cover}
                className="absolute bottom-3 end-3 flex items-center gap-1.5 rounded-xl bg-black/60 px-3 py-2 text-[11px] font-black backdrop-blur-md transition hover:bg-black/80 disabled:opacity-50"
              >
                {uploading.cover ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Camera size={12} />
                )}
                {uploading.cover ? "جارٍ الرفع..." : "تغيير الغلاف"}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0], "cover")}
              />
            </div>

            <div className="flex flex-col items-center gap-3 px-6 pb-6 sm:flex-row sm:items-end">
              <div className="relative -mt-12 sm:-mt-14">
                <div className="size-24 rounded-full bg-gradient-to-br from-[#F9EA02] to-purple-500 p-[3px] sm:size-28">
                  <div className="size-full overflow-hidden rounded-full bg-[#0a0a0a]">
                    {form.profile_Image_URL ? (
                      <img
                        src={form.profile_Image_URL}
                        alt="Avatar"
                        width={112}
                        height={112}
                        decoding="async"
                        className="size-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-3xl font-black text-[#F9EA02]">
                        {(form.firstName || "؟").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading.image}
                  aria-label="تغيير الصورة الشخصية"
                  className="absolute -bottom-1 -end-1 grid size-8 place-items-center rounded-full border-2 border-[#0a0a0a] bg-[#F9EA02] text-black shadow-lg transition hover:bg-[#F9EA02]/90 disabled:opacity-50"
                >
                  {uploading.image ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Camera size={13} strokeWidth={2.5} />
                  )}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0], "image")}
                />
              </div>
              <div className="flex-1 text-center sm:pb-2 sm:text-start">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  الصورة الشخصية
                </p>
                <p className="mt-0.5 truncate text-[13px] font-bold text-white/70">
                  {(form.firstName || "—") + " " + (form.lastName || "")}
                </p>
              </div>
            </div>
          </div>

          <div className={`${glass} p-5 sm:p-6`}>
            <h2 className="mb-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F9EA02]/70">
              <User size={11} /> المعلومات الشخصية
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>الاسم الأول</label>
                <input
                  type="text"
                  className={inputClass}
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>اسم العائلة</label>
                <input
                  type="text"
                  className={inputClass}
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-[12px]">
                <Lock size={12} className="shrink-0 text-white/30" />
                <span className="text-white/40">البريد:</span>
                <span
                  dir="ltr"
                  className="ms-auto truncate font-bold text-white/60"
                >
                  {readonly.email || "—"}
                </span>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 start-3 flex items-center text-white/30 pointer-events-none">
                  <User size={14} />
                </div>
                <input
                  type="tel"
                  dir="ltr"
                  className={`${inputClass} text-end`}
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="09xxxxxxxx"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <div className={`${glass} p-5 sm:p-6`}>
            <h2 className="mb-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F9EA02]/70">
              <ImageIcon size={11} /> السوشيال
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Instagram</label>
                <input
                  type="text"
                  dir="ltr"
                  className={inputClass}
                  value={form.instagram_URL}
                  onChange={(e) => updateField("instagram_URL", e.target.value)}
                  placeholder="@username أو رابط كامل"
                />
              </div>
              <div>
                <label className={labelClass}>Facebook</label>
                <input
                  type="text"
                  dir="ltr"
                  className={inputClass}
                  value={form.facebook_URL}
                  onChange={(e) => updateField("facebook_URL", e.target.value)}
                  placeholder="@username أو رابط كامل"
                />
              </div>
            </div>
          </div>

          <div className={`${glass} p-5 sm:p-6`}>
            <h2 className="mb-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F9EA02]/70">
              <BikeIcon size={11} /> الدراجة
            </h2>
            <button
              type="button"
              onClick={() => updateField("has_Bike", !form.has_Bike)}
              className={`mb-4 flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${
                form.has_Bike
                  ? "border-[#F9EA02]/30 bg-[#F9EA02]/10"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <BikeIcon
                  size={18}
                  className={form.has_Bike ? "text-[#F9EA02]" : "text-white/40"}
                />
                <div className="text-start">
                  <p className="text-[13px] font-black text-white">
                    هل تمتلك دراجة؟
                  </p>
                  <p className="text-[10px] font-bold text-white/40">
                    {form.has_Bike ? "نعم، أمتلك دراجة" : "لا، لا أمتلك دراجة"}
                  </p>
                </div>
              </div>
              <div
                className={`relative h-6 w-11 rounded-full transition ${
                  form.has_Bike ? "bg-[#F9EA02]" : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
                    form.has_Bike ? "start-0.5" : "end-0.5"
                  }`}
                />
              </div>
            </button>

            {form.has_Bike && (
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <label className={labelClass}>نوع الدراجة</label>
                  <div className="relative">
                    <select
                      className={`${inputClass} cursor-pointer appearance-none`}
                      value={bikeForm.bikeType}
                      onChange={(e) =>
                        updateBikeField("bikeType", e.target.value)
                      }
                    >
                      <option value="" disabled className="bg-[#1a1a1a]">
                        اختر نوع الدراجة...
                      </option>
                      {BIKE_TYPES.map((type) => (
                        <option
                          key={type.value}
                          value={type.value}
                          className="bg-[#1a1a1a]"
                        >
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-white/50">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>صورة الدراجة</label>
                  <div className="flex items-center gap-2">
                    <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                      {bikeForm.imageUrl ? (
                        <img
                          src={bikeForm.imageUrl}
                          alt="Bike"
                          width={48}
                          height={48}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-white/20">
                          <BikeIcon size={18} />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => bikeInputRef.current?.click()}
                      disabled={uploading.bike}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] font-bold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                      {uploading.bike ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Upload size={12} />
                      )}
                      {uploading.bike ? "جارٍ..." : "رفع"}
                    </button>
                    <input
                      ref={bikeInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleUpload(e.target.files?.[0], "bike")
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-rose-500/25 bg-rose-500/[0.06] p-5 backdrop-blur-md shadow-xl shadow-black/40 sm:p-6">
            <h2 className="mb-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">
              <AlertTriangle size={11} /> جهة الاتصال للطوارئ
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>اسم جهة الاتصال</label>
                <input
                  type="text"
                  className={inputClass}
                  value={form.emergencyContactName}
                  onChange={(e) =>
                    updateField("emergencyContactName", e.target.value)
                  }
                  placeholder="اسم الشخص"
                />
              </div>
              <div>
                <label className={labelClass}>رقم الهاتف</label>
                <input
                  type="tel"
                  dir="ltr"
                  className={inputClass}
                  value={form.emergencyContactPhone}
                  onChange={(e) =>
                    updateField("emergencyContactPhone", e.target.value)
                  }
                  placeholder="09xxxxxxxx"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {status && (
            <div className="sticky bottom-24 z-20">
              <div
                className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-bold backdrop-blur-md shadow-lg ${
                  status.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {status.type === "success" ? (
                  <Check size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
                {status.message}
              </div>
            </div>
          )}

          <div className="sticky bottom-4 z-10">
            <div className="flex gap-2 rounded-2xl border border-white/10 bg-[#0a0a0a]/90 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-md">
              <Link
                to="/profile"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 text-[12px] font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X size={14} /> إلغاء
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-[#F9EA02] py-3 text-[12px] font-black text-black transition hover:bg-[#F9EA02]/90 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}