import { useEffect, useState, useRef } from "react";
import api from "../../config/api";
import {
  X,
  Loader2,
  Clock,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Upload,
} from "lucide-react";

const OPTIONS = [
  { type: 1, label: "اشتراك", sub: "المشاركة فقط" },
  { type: 2, label: "+ خوذة", sub: "مع استئجار خوذة" },
  { type: 3, label: "+ خوذة ودراجة", sub: "مع خوذة ودراجة" },
];

function ReviewScreen({ onClose, totalPrice }) {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const progress = Math.round(((5 - seconds) / 5) * 100);
  const isDone = seconds <= 0;

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="mb-6 grid size-20 place-items-center rounded-full">
        {isDone ? (
          <span className="grid size-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={40} strokeWidth={2} />
          </span>
        ) : (
          <span className="grid size-20 place-items-center rounded-full bg-[#F9EA02]/10 text-[#F9EA02]">
            <Clock size={40} strokeWidth={2} className="animate-pulse" />
          </span>
        )}
      </div>

      <h2 className="text-xl font-black text-white">
        {isDone ? "تم إرسال حجزك!" : "جاري إرسال الحجز..."}
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-6 text-white/50">
        {isDone
          ? "طلبك قيد المراجعة. سيتم تأكيده من قبل الإدارة فور التحقق من إشعار الدفع."
          : "عم نرسل طلبك وإثبات الدفع."}
      </p>

      {!isDone && (
        <div className="mt-6 w-full max-w-xs">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-[#F9EA02] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
        <span className="text-xs font-bold text-white/50">المبلغ الإجمالي</span>
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-2xl font-black text-[#F9EA02]">
            {totalPrice.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-white/40">ل.س</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-2xl bg-[#F9EA02] py-4 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98]"
      >
        تم
      </button>
    </div>
  );
}

export default function BookingModal({ ride, onClose, onConfirm }) {
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("select");
  const [confirmedPrice, setConfirmedPrice] = useState(0);

  const [receiptUrl, setReceiptUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ✅ 1. ضعنا النص هنا عشان يكون سهل التعديل
  const SHAM_CASH_DATA = "883d053990801470e29e47f226f03b32";
  
  // ✅ 2. ولدنا رابط الباركود ديناميكياً
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(SHAM_CASH_DATA)}`;

  const calculatePrice = (type) => {
    if (type === 1) return ride.basePrice;
    if (type === 2) return ride.basePrice + (ride.helmetPrice || 0);
    if (type === 3)
      return ride.basePrice + (ride.helmetPrice || 0) + (ride.bikePrice || 0);
    return ride.basePrice;
  };

  const currentPrice = calculatePrice(selected);

  const handleUpload = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب ألا يتجاوز 5 ميجابايت.");
      setUploading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/api/images/receipts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res?.data;
      const url =
        data?.data?.imageUrl ||
        data?.data?.url ||
        data?.imageUrl ||
        data?.url;
      if (!url) throw new Error("لم يتم استلام رابط الصورة");
      setReceiptUrl(url);
    } catch (err) {
      setError(
        err?.response?.data?.message || "فشل رفع الصورة. تأكد من صيغة الصورة."
      );
    } finally {
      setUploading(false);
    }
  };

  const handlePreConfirm = () => {
    setError("");
    if (!receiptUrl) {
      setError("يجب رفع صورة إشعار الدفع أولاً.");
      return;
    }
    setShowTerms(true);
  };

  const handleFinalConfirm = async () => {
    if (!agreedToTerms) return;

    setLoading(true);
    setError("");

    try {
      await onConfirm({
        rideId: ride.id,
        bookingType: selected,
        total_Price: currentPrice,
        Receipt_Image_URL: receiptUrl,
      });
      setConfirmedPrice(currentPrice);
      setStep("review");
      setShowTerms(false);
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        "صار خطأ أثناء الحجز";
      setError(msg);
      setShowTerms(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center"
      onClick={step === "select" && !loading && !showTerms ? onClose : undefined}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-t-3xl bg-[#0a0a0a] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "select" ? (
          <>
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <h2 className="text-base font-black text-white">حجز مقعد</h2>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="grid size-8 place-items-center rounded-full bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-5">
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/5 p-1">
                {OPTIONS.map((o) => (
                  <button
                    key={o.type}
                    type="button"
                    disabled={loading}
                    onClick={() => setSelected(o.type)}
                    className={`rounded-lg py-2.5 text-[11px] font-black transition ${
                      selected === o.type
                        ? "bg-[#F9EA02] text-black shadow-sm"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  {OPTIONS.find((o) => o.type === selected)?.sub}
                </p>
                <div className="mt-3 flex items-baseline justify-center gap-1 font-mono">
                  <span className="text-4xl font-black text-[#F9EA02]">
                    {currentPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-white/40">ل.س</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="pe-4">
                  <div className="flex items-center gap-1.5">
                    <QrCode size={14} className="text-[#F9EA02]" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#F9EA02]">
                      شام كاش
                    </p>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-white/50">
                    امسح الباركود، وحول المبلغ.
                  </p>
                </div>
                <div className="shrink-0 rounded-xl bg-white p-2">
                  {/* ✅ 3. استخدمنا رابط الباركود الديناميكي هنا */}
                  <img
                    src={qrCodeUrl}
                    alt="Sham Cash QR"
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    className="size-20 object-contain"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                  إثبات الدفع (إجباري)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 text-xs font-bold transition ${
                    receiptUrl
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-white/10 bg-white/[0.02] text-white/50 hover:border-[#F9EA02]/50 hover:text-[#F9EA02]"
                  }`}
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : receiptUrl ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploading
                    ? "جارٍ رفع الصورة..."
                    : receiptUrl
                      ? "تم رفع الإشعار بنجاح"
                      : "ارفع صورة إشعار الدفع"}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold text-white/30">
                <ShieldCheck size={12} /> حجز آمن · سيتم مراجعة الإشعار من
                الإدارة
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs font-bold text-rose-200">
                  {error}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 bg-black/40 p-4">
              <button
                type="button"
                onClick={handlePreConfirm}
                disabled={loading || uploading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F9EA02] py-4 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
              >
                تأكيد الدفع وإرسال الطلب
              </button>
            </div>
          </>
        ) : (
          <div className="p-6">
            <ReviewScreen onClose={onClose} totalPrice={confirmedPrice} />
          </div>
        )}

        {showTerms && (
          <div
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => !loading && setShowTerms(false)}
          >
            <div
              className="w-full max-w-sm rounded-t-[28px] border border-white/10 bg-[#0a0a0a]/95 pb-6 shadow-2xl backdrop-blur-xl sm:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center py-3" aria-hidden="true">
                <div className="h-1.5 w-12 rounded-full bg-white/20" />
              </div>

              <div className="px-5 pt-1">
                <h3 className="text-lg font-black text-[#F9EA02]">
                  تأكيد الحجز
                </h3>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-white/50">
                  سيتم حجزك بمبلغ{" "}
                  <span className="font-bold text-white">
                    {currentPrice.toLocaleString()} ل.س
                  </span>
                  . بتأكيدك، توافق على شروط المشاركة التالية:
                </p>

                <ul className="scrollbar-hide mt-4 max-h-48 space-y-3 overflow-y-auto pr-1 text-[13px] font-medium text-white/60">
                  <li className="flex gap-2">
                    <span className="shrink-0 text-[#F9EA02]">•</span>
                    <span>
                      سيبقى حجزك "قيد المراجعة" لحين تأكيده من الإدارة.{" "}
                      <strong className="text-white">
                        بمجرد تأكيد حجزك، لا يمكنك إلغاؤه.
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 text-[#F9EA02]">•</span>
                    <span>
                      في حال إرسال إشعار دفع غير صحيح، سيتم رفض الحجز وإلغاؤه.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 text-[#F9EA02]">•</span>
                    <span>في حال تغيّبك عن الجولة، تُدفع كامل رسوم الحجز.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 text-[#F9EA02]">•</span>
                    <span>
                      في حال إلغاء الجولة من قبل الإدارة لظرف طارئ، يُحتفظ
                      بمبلغك لحجز جولة أخرى، أو يمكنك التواصل مع مشرف الفريق
                      لاسترداده.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 text-[#F9EA02]">•</span>
                    <span>
                      الفريق غير مسؤول عن أي حادث يتعرّض له المشارك في حال عدم
                      الالتزام بالتعليمات.
                    </span>
                  </li>
                </ul>

                <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:bg-white/[0.05]">
                  <input
                    type="checkbox"
                    className="size-4 accent-[#F9EA02]"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <span className="text-sm font-bold text-white">
                    قرأت ووافقت على الشروط
                  </span>
                </label>

                <div className="mt-5 flex flex-col gap-2">
                  <button
                    onClick={handleFinalConfirm}
                    disabled={!agreedToTerms || loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F9EA02] py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "تأكيد"
                    )}
                  </button>
                  <button
                    onClick={() => setShowTerms(false)}
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}