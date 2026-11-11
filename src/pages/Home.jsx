import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_URL } from "../config/api";
import {
  ArrowLeft,
  ArrowUpRight,
  Map,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Crown,
  Medal,
  Bike,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import heroTeam from "/Hero-team-cropped.webp";
import Seo from "../components/Seo";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";

const fixUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return url;
};

const FALLBACK_RIDE_IMG =
  "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80";

// أيقونة واتساب
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const PODIUM_STYLES = {
  1: {
    ring: "ring-[#F9EA02] ring-2",
    badgeBg: "bg-[#F9EA02] text-black",
    glow: "shadow-[0_0_60px_rgba(249,234,2,0.4)]",
    border: "border-[#F9EA02]/50",
    icon: Crown,
    avatarSize: "size-20 sm:size-24",
    nameClass: "text-[#F9EA02]",
  },
  2: {
    ring: "ring-gray-300 ring-1",
    badgeBg: "bg-gray-300 text-black",
    glow: "shadow-[0_0_40px_rgba(200,200,200,0.2)]",
    border: "border-gray-300/30",
    icon: Medal,
    avatarSize: "size-16 sm:size-20",
    nameClass: "text-white",
  },
  3: {
    ring: "ring-amber-600 ring-1",
    badgeBg: "bg-amber-600 text-white",
    glow: "shadow-[0_0_40px_rgba(180,83,9,0.25)]",
    border: "border-amber-600/30",
    icon: Medal,
    avatarSize: "size-16 sm:size-20",
    nameClass: "text-white",
  },
};

export default function Home() {
  const { user } = useAuth();

  const [topUsers, setTopUsers] = useState([]);
  const [latestRides, setLatestRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      api.get("/api/users/leaderboard").catch(() => null),
      api.get("/api/rides").catch(() => null),
    ])
      .then(([leaderboardRes, ridesRes]) => {
        if (ignore) return;
        if (leaderboardRes?.data?.data) {
          setTopUsers(leaderboardRes.data.data.slice(0, 3));
        }
        if (ridesRes?.data?.data) {
          setLatestRides(ridesRes.data.data.slice(0, 3));
        }
        setLoading(false);
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Seo
        title="فريق الدراجات في سوريا"
        description="فريق RiderZ فريق دراجات مجتمعي في سوريا، نعمل على نشر ثقافة ركوب الدراجة الهوائية، وننظم جولات ومغامرات على الطريق."
        canonicalPath="/"
      />

      <main dir="rtl" className="relative min-h-screen overflow-x-hidden text-white">
        <section className="relative flex min-h-screen items-center px-4 py-24 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="order-1 text-center lg:text-start">
                <span
                  className={`${glass} inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest text-[#F9EA02]`}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F9EA02]" />
                  RIDERZ TEAM
                </span>

                <h1
                  dir="ltr"
                  className="mt-6 text-5xl font-black italic leading-[0.95] tracking-tighter sm:text-6xl xl:text-7xl lg:text-right"
                >
                  <span className="block text-white">WE RIDE</span>
                  <span className="block text-white/40">
                    AS{" "}
                    <span className="text-[#F9EA02] drop-shadow-[0_0_30px_rgba(249,234,2,0.6)]">
                      ONE!!
                    </span>
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base lg:mx-0">
                  انضم لأقوى فريق دراجات هوائية، مغامرات، رحلات، وأصدقاء جدد على
                  الطريق.
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
                  <Link
                    to="/rides"
                    dir="ltr"
                    className="group flex items-center gap-2 rounded-full bg-[#F9EA02] px-7 py-3 text-sm font-black tracking-wide text-black transition hover:bg-[#F9EA02]/90 hover:shadow-[0_0_30px_rgba(249,234,2,0.5)] active:scale-95"
                  >
                    EXPLORE RIDES
                    <ArrowLeft
                      size={16}
                      className="transition group-hover:-translate-x-1"
                    />
                  </Link>

                  {!user.isLoggedIn && (
                    <Link
                      to="/signup"
                      className={`${glass} rounded-full px-7 py-3 text-sm font-bold text-white transition hover:bg-white/10`}
                    >
                      JOIN US
                    </Link>
                  )}
                </div>
              </div>

              <div className="order-2 relative">
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(249,234,2,0.3),transparent_70%)]" />

                <img
                  src={heroTeam}
                  alt="فريق RiderZ"
                  width={934}
                  height={810}
                  fetchPriority="high"
                  decoding="async"
                  className="relative block h-auto w-full select-none object-contain [mask-image:linear-gradient(to_bottom,#000_85%,transparent_100%)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. أفضل 3 في لوحة الصدارة */}
        <section className="relative px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#F9EA02]">
                  // الأبطال
                </span>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  أفضل 3 متسابقين
                </h2>
                <p className="mt-2 text-white/50">
                  الأبطال اللي سيطروا على الطريق هذا الشهر.
                </p>
              </div>

              <Link
                to="/leaderboard"
                className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white/70 transition hover:border-[#F9EA02]/40 hover:text-[#F9EA02]"
              >
                لوحة الصدارة كاملة{" "}
                <ArrowUpRight
                  size={14}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="min-h-[380px] sm:min-h-[480px] flex flex-col justify-center">
              {loading ? (
                <div className="flex justify-center py-10">
                  <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
                </div>
              ) : topUsers.length > 0 ? (
                <Podium topUsers={topUsers} />
              ) : (
                <div className={`${glass} p-8 text-center text-white/50`}>
                  لا توجد بيانات متاحة حالياً.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ✅ 3. قسم الكورسات التدريبية (ستايل زجاجي أنيق) */}
        <section className="relative px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className={`${glass} relative overflow-hidden p-8 sm:p-12`}>
              
              {/* توهج أصفر خلفي */}
              <div className="pointer-events-none absolute -top-32 -end-32 size-[400px] rounded-full bg-[#F9EA02]/15 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-32 -start-32 size-[400px] rounded-full bg-purple-500/10 blur-[100px]" />

              <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
                
                {/* الجانب النصي والأيقونة */}
                <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-start">
                  <div className="grid size-20 shrink-0 place-items-center rounded-3xl bg-[#F9EA02]/10 border border-[#F9EA02]/20 text-[#F9EA02] shadow-[inset_0_0_20px_rgba(249,234,2,0.1)]">
                    <Bike size={36} strokeWidth={2} />
                  </div>
                  
                  <div>
                   
                    <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                      تعلّم ركوب الدراجة معنا 🚴‍♂️
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
                      عندنا كورسات تدريبية للمبتدئين بإشراف مدربين خبراء. للاستفسار وحجز موعدك، تواصل معنا مباشرة عبر واتساب.
                    </p>
                  </div>
                </div>

                {/* زر الواتساب (متوافق مع ستايل الموقع) */}
                <a
                  // ⚠️ غير رقم الواتساب هون
                  href="https://wa.me/963999999999?text=مرحباً، بدي أستفسر عن كورسات تعلّم ركوب الدراجة"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-[#F9EA02] px-8 py-4 text-sm font-black text-black shadow-lg shadow-[#F9EA02]/20 transition-all hover:scale-[1.02] hover:bg-[#F9EA02]/90 hover:shadow-[0_0_30px_rgba(249,234,2,0.4)] active:scale-95 sm:w-auto"
                >
                  <WhatsAppIcon size={20} />
                  <span>تواصل على واتساب</span>
                  <ArrowUpRight
                    size={16}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. أحدث الجولات */}
        <section className="relative px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#F9EA02]">
                  // قادم
                </span>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  أحدث الجولات
                </h2>
                <p className="mt-2 text-white/50">
                  انضم إلينا في مغامرتنا القادمة.
                </p>
              </div>

              <Link
                to="/rides"
                className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white/70 transition hover:border-[#F9EA02]/40 hover:text-[#F9EA02]"
              >
                عرض الكل{" "}
                <ArrowUpRight
                  size={14}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="min-h-[350px] sm:min-h-[400px]">
              {loading ? (
                <div className="flex justify-center py-10">
                  <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#F9EA02]" />
                </div>
              ) : latestRides.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {latestRides.map((ride) => (
                    <RidePreviewCard key={ride.id} ride={ride} />
                  ))}
                </div>
              ) : (
                <div className={`${glass} p-8 text-center text-white/50`}>
                  لا توجد جولات قادمة حالياً.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. ليش RiderZ */}
        <section className="relative px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-black sm:text-4xl">
                ليش تنضم لـ <span className="text-[#F9EA02]">RiderZ</span>؟
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/50">
                نحن مش بس فريق دراجات، نحن عائلة. إليك ما يميزنا.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={Map}
                title="جولات منظمة"
                desc="اكتشف مسارات جديدة مع مشرفين خبراء. اختر من بين جولات الطريق، الجبل، أو الهجينة."
              />
              <FeatureCard
                icon={Trophy}
                title="تتبع الإحصائيات"
                desc="تابع عدد الكيلومترات التي قطعتها، مستواك الحالي، وترتيبك بين أصدقائك في لوحة الصدارة."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="حجز آمن ومباشر"
                desc="احجز مقعدك، اختر إضافاتك (خوذة أو دراجة)، وادفع بأمان عبر شام كاش."
              />
            </div>
          </div>
        </section>

        {/* 6. كيف تبدأ */}
        <section className="relative px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-black sm:text-4xl">كيف تبدأ؟</h2>
              <p className="mx-auto mt-4 max-w-xl text-white/50">
                ثلاث خطوات بسيطة تفصلك عن رحلتك الأولى.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <StepCard
                number="01"
                title="أنشئ حسابك"
                desc="سجل مجاناً في دقيقة واحدة عبر البريد الإلكتروني."
              />
              <StepCard
                number="02"
                title="تصفح الجولات"
                desc="اختر الجولة التي تناسب مستواك وتاريخك المفضل."
              />
              <StepCard
                number="03"
                title="احجز وانطلق"
                desc="ادفع عبر شام كاش، ارفع صورة الإشعار، واحضر بالوقت المحدد."
              />
            </div>
          </div>
        </section>

        {/* 7. معرض الصور */}
        <section className="relative px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black sm:text-4xl">لحظاتنا</h2>
              <p className="mt-4 text-white/50">
                أجمل اللحظات من جولاتنا السابقة.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              <div className={`${glass} col-span-2 row-span-2 overflow-hidden`}>
                <img
                  src="https://res.cloudinary.com/lxlgfue4/image/upload/f_auto,q_auto/v1793831147/R4.webp"
                  alt="Gallery"
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className={`${glass} overflow-hidden`}>
                <img
                  src="https://res.cloudinary.com/lxlgfue4/image/upload/f_auto,q_auto/R3.webp"
                  alt="Gallery"
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className={`${glass} overflow-hidden`}>
                <img
                  src="https://res.cloudinary.com/lxlgfue4/image/upload/f_auto,q_auto/R2.webp"
                  alt="Gallery"
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className={`${glass} col-span-1 overflow-hidden`}>
                <img
                  src="https://res.cloudinary.com/lxlgfue4/image/upload/f_auto,q_auto/v1793831617/R1.webp"
                  alt="Gallery"
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className={`${glass} col-span-1 overflow-hidden`}>
                <img
                  src="https://res.cloudinary.com/lxlgfue4/image/upload/f_auto,q_auto/v1793835224/r5.webp"
                  alt="Gallery"
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 8. الأسئلة الشائعة */}
        <section className="relative px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-black sm:text-4xl">أسئلة شائعة</h2>
            </div>

            <div className="space-y-3">
              <FaqItem
                question="هل يجب أن أملك دراجة خاصة؟"
                answer="لا، يمكنك اختيار باقة تشمل استئجار دراجة عند الحجز."
              />
              <FaqItem
                question="ما هو مستوى الخبرة المطلوب؟"
                answer="لدينا جولات لجميع المستويات، من المبتدئين إلى المحترفين."
              />
              <FaqItem
                question="كيف يمكنني الدفع؟"
                answer="الدفع يتم عبر شام كاش مباشرة بعد تأكيد الحجز."
              />
              <FaqItem
                question="هل يمكنني إلغاء حجزي؟"
                answer="يمكنك إلغاء حجزك مجاناً طالما أنه لا يزال 'قيد المراجعة'. بمجرد تأكيد الإدارة للحجز، لا يمكن إلغاؤه."
              />
            </div>
          </div>
        </section>

        {/* 9. دعوة للتسجيل */}
        <section className="relative px-4 pb-24 pt-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className={`${glass} relative overflow-hidden p-8 sm:p-14`}>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F9EA02]/10 via-transparent to-purple-500/10" />

              <div className="pointer-events-none absolute -end-20 -top-20 size-[300px] rounded-full bg-[radial-gradient(circle,rgba(249,234,2,0.2),transparent_70%)]" />

              <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-start">
                <div>
                  <h2 className="text-3xl font-black sm:text-4xl">
                    جاهز لرحلتك <span className="text-[#F9EA02]">القادمة</span>؟
                  </h2>
                  <p className="mt-3 max-w-lg text-white/60">
                    سجّل الآن وانضم لأكبر مجتمع للدراجات في سوريا. مغامرات،
                    أصدقاء، ومسارات لا تُنسى بانتظارك.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  {!user.isLoggedIn ? (
                    <Link
                      to="/signup"
                      className="rounded-xl bg-[#F9EA02] px-8 py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90"
                    >
                      أنشئ حسابك
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      className="rounded-xl bg-[#F9EA02] px-8 py-3.5 text-sm font-black text-black transition hover:bg-[#F9EA02]/90"
                    >
                      اذهب لملفي
                    </Link>
                  )}

                  <Link
                    to="/rides"
                    className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    تصفّح الجولات
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const Podium = memo(function Podium({ topUsers }) {
  const first = topUsers[0];
  const second = topUsers[1];
  const third = topUsers[2];

  return (
    <div dir="ltr" className="flex items-end justify-center gap-2 sm:gap-4">
      {second ? (
        <PodiumCard user={second} rank={2} height="h-[300px] sm:h-[360px]" />
      ) : (
        <div className="h-[300px] w-full max-w-[160px] sm:h-[360px] sm:max-w-[200px]" />
      )}

      {first && (
        <PodiumCard
          user={first}
          rank={1}
          height="h-[380px] sm:h-[460px]"
          isWinner
        />
      )}

      {third ? (
        <PodiumCard user={third} rank={3} height="h-[260px] sm:h-[320px]" />
      ) : (
        <div className="h-[260px] w-full max-w-[160px] sm:h-[320px] sm:max-w-[200px]" />
      )}
    </div>
  );
});

const PodiumCard = memo(function PodiumCard({ user, rank, height, isWinner }) {
  const style = PODIUM_STYLES[rank];
  const RankIcon = style.icon;

  return (
    <div
      className={`${glass} relative flex w-full max-w-[160px] flex-col items-center justify-end overflow-hidden pb-5 pt-10 sm:max-w-[200px] ${height} ${style.glow} ${style.border}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1/2 opacity-40 ${
          isWinner
            ? "bg-[radial-gradient(ellipse_at_top,rgba(249,234,2,0.8),transparent_70%)]"
            : rank === 2
              ? "bg-[radial-gradient(ellipse_at_top,rgba(200,200,200,0.8),transparent_70%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(180,83,9,0.8),transparent_70%)]"
        }`}
      />

      {isWinner && (
        <div className="absolute left-1/2 top-3 -translate-x-1/2">
          <Crown
            size={32}
            className="text-[#F9EA02] drop-shadow-[0_0_15px_rgba(249,234,2,0.8)]"
            fill="currentColor"
          />
        </div>
      )}

      <div
        className={`absolute end-3 top-3 grid size-7 place-items-center rounded-full ${style.badgeBg} text-[10px] font-black shadow-lg`}
      >
        #{rank}
      </div>

      <div
        className={`relative mb-3 ${style.avatarSize} overflow-hidden rounded-full bg-white/5 ${style.ring}`}
      >
        {user.profile_Image_URL ? (
          <img
            src={fixUrl(user.profile_Image_URL)}
            alt={user.username}
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-xl font-black text-white/40 sm:text-2xl">
            {user.username?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div
        className={`mb-1 grid size-6 place-items-center rounded-full ${style.badgeBg}`}
      >
        <RankIcon size={12} />
      </div>

      <h3
        className={`w-full truncate px-3 text-center font-black ${
          isWinner ? "text-base sm:text-lg" : "text-sm"
        } ${style.nameClass}`}
      >
        {user.firstName} {user.lastName}
      </h3>

      <p className="w-full truncate px-3 text-center font-mono text-[10px] text-white/50">
        @{user.username}
      </p>

      <div className="mt-3 flex w-full items-center justify-center gap-2 border-t border-white/10 pt-3">
        <div className="text-center">
          <p
            dir="ltr"
            className={`font-mono text-sm font-black ${
              isWinner ? "text-[#F9EA02]" : "text-white"
            }`}
          >
            {user.totalKilometers || 0}
          </p>
          <p className="text-[8px] uppercase tracking-widest text-white/40">
            KM
          </p>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="text-center">
          <p
            dir="ltr"
            className={`font-mono text-sm font-black ${
              isWinner ? "text-[#F9EA02]" : "text-white"
            }`}
          >
            {user.number_Rounds || 0}
          </p>
          <p className="text-[8px] uppercase tracking-widest text-white/40">
            Rides
          </p>
        </div>
      </div>
    </div>
  );
});

const RidePreviewCard = memo(function RidePreviewCard({ ride }) {
  const displayDate = ride.rideDate
    ? new Date(ride.rideDate).toLocaleDateString("ar-SY", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : "قريباً";

  const imgUrl =
    ride.imageUrl && !ride.imageUrl.includes("testimage")
      ? fixUrl(ride.imageUrl)
      : FALLBACK_RIDE_IMG;

  return (
    <Link
      to={`/rides/${ride.id}`}
      className={`${glass} group relative block overflow-hidden transition hover:border-[#F9EA02]/40`}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={imgUrl}
          alt={ride.title}
          width={600}
          height={375}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_RIDE_IMG;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/30 to-transparent" />
      </div>

      <div className="absolute bottom-0 w-full p-5">
        <span className="rounded-full bg-[#F9EA02]/20 px-2.5 py-0.5 text-[10px] font-black text-[#F9EA02] backdrop-blur-sm">
          {ride.level || "مبتدئ"}
        </span>

        <h3 className="mt-2 line-clamp-1 text-lg font-black text-white">
          {ride.title}
        </h3>

        <p className="mt-1 text-xs text-white/60">{displayDate}</p>
      </div>

      <div className="absolute end-5 top-5 grid size-9 place-items-center rounded-full bg-black/50 text-white/70 backdrop-blur-sm transition group-hover:bg-[#F9EA02] group-hover:text-black">
        <ArrowUpRight size={16} />
      </div>
    </Link>
  );
});

const FeatureCard = memo(function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div
      className={`${glass} group relative overflow-hidden p-6 transition-colors hover:border-[#F9EA02]/30 hover:bg-white/[0.08]`}
    >
      <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-[#F9EA02]/10 text-[#F9EA02] transition-transform group-hover:scale-110">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/50">{desc}</p>
    </div>
  );
});

const StepCard = memo(function StepCard({ number, title, desc }) {
  return (
    <div
      className={`${glass} relative overflow-hidden p-6 text-center sm:text-start`}
    >
      <span className="absolute -top-4 end-4 select-none text-7xl font-black text-white/5">
        {number}
      </span>

      <div className="relative z-10">
        <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-[#F9EA02] text-black shadow-lg shadow-[#F9EA02]/20">
          <CheckCircle2 size={20} />
        </div>
        <h3 className="text-lg font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-white/50">{desc}</p>
      </div>
    </div>
  );
});

const FaqItem = memo(function FaqItem({ question, answer }) {
  return (
    <div className={`${glass} flex items-start gap-4 p-5`}>
      <HelpCircle size={20} className="mt-0.5 shrink-0 text-[#F9EA02]" />
      <div>
        <h4 className="font-black text-white">{question}</h4>
        <p className="mt-1 text-sm text-white/50">{answer}</p>
      </div>
    </div>
  );
});