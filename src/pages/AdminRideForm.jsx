import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { API_URL } from "../config/api";
import {
  ArrowRight,
  Loader2,
  Upload,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white placeholder:text-white/30 outline-none transition focus:border-[#F9EA02]/50 focus:ring-2 focus:ring-[#F9EA02]/20";
const labelClass = "mb-1.5 block text-[11px] font-bold uppercase text-white/50";

const ALL_LEVELS = [
  "Beginner_A",
  "Beginner_B",
  "Beginner_C",
  "Intermediate_A",
  "Intermediate_B",
  "Intermediate_C",
  "Advanced_A",
  "Advanced_B",
  "Advanced_C",
];
const ALL_STATUSES = ["متاح", "أكتمل العدد", "قد بدء", "منتهي", "ملغي"];
const fixUrl = (url) =>
  !url ? "" : url.startsWith("/") ? `${API_URL}${url}` : url;

export default function AdminRideForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    meetingPoint: "",
    endLocation: "",
    path: "",
    distanceKM: 0,
    estimatedDurationMinutes: 0,
    maxParticipants: 10,
    level: "Beginner_A",
    status: "متاح",
    locationURL: "",
    basePrice: 0,
    helmetPrice: 0,
    bikePrice: 0,
    imageUrl: "",
    supervisorName: "",
    rideDate: "",
  });

  useEffect(() => {
    if (isEditing) {
      api
        .get(`/api/rides/${id}`)
        .then((res) => {
          const ride = res.data.data;
          setForm({
            ...ride,
            rideDate: ride.rideDate ? ride.rideDate.substring(0, 16) : "",
            imageUrl: fixUrl(ride.imageUrl),
          });
          setLoading(false);
        })
        .catch(() => {
          setError("فشل تحميل الجولة");
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/api/images/rides", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.data?.imageUrl || res.data?.data?.url;
      if (url) update("imageUrl", fixUrl(url));
    } catch {
      alert("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) return setError("يجب رفع صورة للجولة.");

    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        distanceKM: Number(form.distanceKM),
        estimatedDurationMinutes: Number(form.estimatedDurationMinutes),
        maxParticipants: Number(form.maxParticipants),
        basePrice: Number(form.basePrice),
        helmetPrice: Number(form.helmetPrice),
        bikePrice: Number(form.bikePrice),
        rideDate: new Date(form.rideDate).toISOString(),
      };

      if (isEditing) await api.put(`/api/rides/${id}`, payload);
      else await api.post("/api/rides", payload);

      navigate("/admin/rides");
    } catch (err) {
      setError(err?.response?.data?.message || "فشل الحفظ. تأكد من البيانات.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-[#08080c]">
        <Loader2 className="animate-spin text-[#F9EA02]" size={32} />
      </div>
    );
  }

  return (
    <main dir="rtl" className="relative min-h-screen text-white">
      <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <Link
          to="/admin/rides"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 transition hover:text-[#F9EA02]"
        >
          <ArrowRight size={14} /> رجوع للجولات
        </Link>

        <div className={`${glass} p-6 sm:p-8`}>
          <h1 className="mb-6 text-2xl font-black">
            {isEditing ? "تعديل الجولة" : "إضافة جولة جديدة"}
          </h1>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-bold text-rose-400">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>العنوان *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>الوصف</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>نقطة التجمع *</label>
                <input
                  required
                  value={form.meetingPoint}
                  onChange={(e) => update("meetingPoint", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>نقطة النهاية *</label>
                <input
                  required
                  value={form.endLocation}
                  onChange={(e) => update("endLocation", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>المسار (افصل بـ \) *</label>
                <input
                  required
                  value={form.path}
                  onChange={(e) => update("path", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>المشرف *</label>
                <input
                  required
                  value={form.supervisorName}
                  onChange={(e) => update("supervisorName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>التاريخ والوقت *</label>
                <input
                  type="datetime-local"
                  required
                  value={form.rideDate}
                  onChange={(e) => update("rideDate", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>المسافة (كم) *</label>
                <input
                  type="number"
                  required
                  value={form.distanceKM}
                  onChange={(e) => update("distanceKM", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>المدة (دقيقة) *</label>
                <input
                  type="number"
                  required
                  value={form.estimatedDurationMinutes}
                  onChange={(e) =>
                    update("estimatedDurationMinutes", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>أقصى عدد *</label>
                <input
                  type="number"
                  required
                  value={form.maxParticipants}
                  onChange={(e) => update("maxParticipants", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>المستوى *</label>
                <select
                  value={form.level}
                  onChange={(e) => update("level", e.target.value)}
                  className={inputClass}
                >
                  {ALL_LEVELS.map((l) => (
                    <option key={l} value={l} className="bg-[#1a1a1a]">
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>رابط الخريطة (Embed) *</label>
                <input
                  required
                  value={form.locationURL}
                  onChange={(e) => update("locationURL", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>

              <div>
                <label className={labelClass}>سعر الاشتراك *</label>
                <input
                  type="number"
                  required
                  value={form.basePrice}
                  onChange={(e) => update("basePrice", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>سعر الخوذة *</label>
                <input
                  type="number"
                  required
                  value={form.helmetPrice}
                  onChange={(e) => update("helmetPrice", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>سعر الدراجة *</label>
                <input
                  type="number"
                  required
                  value={form.bikePrice}
                  onChange={(e) => update("bikePrice", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>الحالة</label>
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                  className={inputClass}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#1a1a1a]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>صورة الجولة *</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt="Ride preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={24} className="text-white/20" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold transition hover:bg-white/10 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}{" "}
                    رفع صورة
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-white/5 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/rides")}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3.5 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-[#F9EA02] py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "حفظ الجولة"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}