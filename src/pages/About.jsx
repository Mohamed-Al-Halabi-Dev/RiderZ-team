import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import {
  ArrowRight,
  Heart,
  Bike,
  Shield,
  Users,
  Trophy,
} from "lucide-react";

import heroTeam from "/Hero-team-cropped.webp";

// ✅ خففنا الـ blur
const glass =
  "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-xl shadow-black/40";

const SECTIONS = [
  { id: "who-we-are", number: "01", label: "من نحن", icon: Heart },
  { id: "goals", number: "02", label: "أهدافنا", icon: Bike },
  { id: "team-rules", number: "03", label: "قوانين الفريق", icon: Shield },
];

const WHO_WE_ARE = [
  "RiderZ فريق دراجات تأسس عام 2017, وبدأ رحلته على مواقع تواصل الأجتماعي عام 2021",
  "بدأنا بمجموعة من الأصدقاء يجمعهم شغف واحد... واليوم أصبحنا عائلة تضم كل من يعشق ركوب الدراجات.",
];

const GOALS = [
  "نشر ثقافة ركوب الدراجة الهوائية بين جميع فئات المجتمع دون تمييز.",
  "تشجيع النساء والفتيات على ركوب الدراجة، وكسر الصور النمطية، وتعزيز الثقة بالنفس والاستقلالية.",
  "تعزيز التماسك المجتمعي من خلال الرياضة وبناء علاقات قائمة على الاحترام والدعم والانتماء.",
  "نشر الوعي بأن الرياضة ضرورة للصحة والحياة اليومية وليست رفاهية.",
  "بناء قادة للمستقبل عبر العمل التطوعي وتحمل المسؤوليات داخل الفريق.",
  "استخدام الدراجة كوسيلة توعوية لنشر رسائل إيجابية وهادفة في المجتمع.",
];

const RULES = [
  "الالتزام بالاحترام المتبادل والتحلي بسلوك إيجابي بين جميع الأعضاء.",
  "التقيد بقواعد السلامة المرورية أثناء القيادة.",
  "توفر معدات السلامة الأساسية: خوذة، إضاءة، ودراجة صالحة للاستخدام.",
  "الالتزام بتعليمات المنظمين وقادة الفريق خلال الأنشطة والجولات.",
  "الامتناع عن النقاشات الحساسة (السياسة، الدين) وأي شكل من أشكال التنمر أو الإهانة.",
  "الحفاظ على نظافة الأماكن وعدم رمي النفايات إلا في سلال المهملات.",
  "دخول الحدائق العامة سيراً على الأقدام دون ركوب الدراجة.",
  "الالتزام بمواعيد وأنشطة وجولات الفريق.",
  "القيادة بانضباط وتجنب الحركات الخطرة أو الاستعراضية.",
  "الحفاظ على ممتلكات الفريق والمعدات المستعارة.",
];

export default function About() {
  const [active, setActive] = useState("who-we-are");
  const [stats, setStats] = useState({ users: "50+", rides: "120+" });

  useEffect(() => {
    api
      .get("/api/admin/stats/public")
      .then((res) => {
        const data = res.data?.data;
        if (data) {
          setStats({
            users: `${data.totalUsers}+`,
            rides: `${data.totalRides}+`,
          });
        }
      })
      .catch(() => {});
  }, []);

  const STATS = [
    { icon: Users, value: stats.users, label: "عضو" },
    { icon: Bike, value: stats.rides, label: "جولة" },
    { icon: Trophy, value: "5★", label: "تقييم" },
  ];

  return (
    // ✅ شلنا الخلفية المكررة
    <main dir="rtl" className="relative min-h-screen text-white">
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/50 transition hover:text-[#F9EA02]"
        >
          <ArrowRight size={14} /> رجوع للرئيسية
        </Link>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className={`${glass} relative overflow-hidden p-6 sm:p-10`}>
            {/* ✅ استبدلنا blur-3xl بـ radial-gradient */}
            <div className="pointer-events-none absolute -start-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(249,234,2,0.2),transparent_70%)]" />
            <div className="relative">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#F9EA02]">
                RiderZ Team
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                عن <span className="text-[#F9EA02]">الفريق</span>
              </h1>
              <p className="mt-5 max-w-md text-sm font-semibold leading-relaxed text-white/60 sm:text-base">
                صفحة واحدة تجمع من نحن، أهدافنا، وقوانين الفريق — بأسلوب واضح
                وسهل.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center">
                    <Icon size={20} className="mx-auto mb-2 text-[#F9EA02]" />
                    <p
                      dir="ltr"
                      className="font-mono text-xl font-black text-[#F9EA02] sm:text-2xl"
                    >
                      {value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`${glass} relative flex items-center justify-center overflow-hidden p-4`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,234,2,0.2),transparent_70%)]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #F9EA02 0, #F9EA02 1px, transparent 1px, transparent 20px)",
              }}
            />
            <img
              src={heroTeam}
              alt="فريق RiderZ"
              width={400}
              height={400}
              fetchPriority="high"
              className="relative w-full max-w-sm object-contain drop-shadow-2xl [mask-image:linear-gradient(to_bottom,#000_85%,transparent_100%)] sm:max-w-md"
            />
          </div>
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-[260px,1fr] lg:gap-6">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <nav className={`${glass} flex gap-2 p-2 lg:flex-col`}>
              {SECTIONS.map(({ id, number, label, icon: Icon }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={`group flex flex-1 items-center gap-3 rounded-2xl px-3 py-3 text-start text-xs font-black transition sm:text-sm lg:flex-none ${
                      isActive
                        ? "bg-[#F9EA02] text-black shadow-lg shadow-[#F9EA02]/25"
                        : "border border-transparent text-white/60 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] ${
                        isActive ? "text-black/50" : "text-white/30"
                      }`}
                    >
                      {number}
                    </span>
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className={`${glass} min-h-[400px] p-5 sm:p-8`}>
            {active === "who-we-are" && (
              <SectionList
                number="01"
                title="من نحن ؟"
                icon={Heart}
                items={WHO_WE_ARE}
              />
            )}
            {active === "goals" && (
              <SectionList
                number="02"
                title="أهدافنا"
                icon={Bike}
                items={GOALS}
                numbered
              />
            )}
            {active === "team-rules" && (
              <SectionList
                number="03"
                title="قوانين الفريق"
                icon={Shield}
                items={RULES}
                numbered
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionList({ number, title, icon: Icon, items, numbered }) {
  return (
    <>
      <div className="mb-6 flex items-center gap-4 border-b border-white/10 pb-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F9EA02]/10 text-[#F9EA02]">
          <Icon size={20} />
        </div>
        <div className="flex flex-1 items-baseline gap-3">
          <span className="font-mono text-xs font-black text-[#F9EA02]/60">
            {number}
          </span>
          <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
        </div>
      </div>
      <ul className={numbered ? "grid gap-3 sm:grid-cols-2" : "space-y-4"}>
        {items.map((text, i) => (
          <li
            key={i}
            className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-[#F9EA02]/30 hover:bg-white/[0.04] ${
              numbered ? "flex items-start gap-3" : ""
            }`}
          >
            {numbered && (
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#F9EA02]/15 text-[10px] font-black text-[#F9EA02]">
                {i + 1}
              </span>
            )}
            <p className="text-sm font-semibold leading-relaxed text-white/75">
              {text}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}