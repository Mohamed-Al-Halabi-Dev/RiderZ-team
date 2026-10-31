import { Link } from "react-router-dom";
import { MapPin, Mail, ArrowUpRight } from "lucide-react";

import riderzLogo from "../assets/Logo/RiderZWord.PNG";

const IconInstagram = ({ size = 16, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const IconFacebook = ({ size = 16, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const glass = "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-black/40";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#08080c] text-white">
      {/* خلفية متوهجة + شبكة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -start-40 size-[400px] rounded-full bg-[#F9EA02]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -end-40 size-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative border-t border-white/10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F9EA02]/50 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* العمود 1: الشعار */}
          <div className="lg:col-span-1">
            <Link to="/" className="group mb-4 inline-flex items-center gap-2">
              <img
                src={riderzLogo}
                alt="RiderZ Logo"
                width={150}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-12 w-auto object-contain transition duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              فريق راكبي الدراجات في سوريا. جولات أسبوعية، تحديات، ومغامرات على الطريق.
            </p>

            <div className="mt-6 flex gap-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10 hover:text-[#E4405F]">
                <IconInstagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 hover:text-[#1877F2]">
                <IconFacebook size={16} />
              </a>
            </div>
          </div>

          {/* العمود 2 */}
          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-[#F9EA02]">روابط سريعة</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="group flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
                  الرئيسية
                  <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
              <li>
                <Link to="/rides" className="group flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
                  الجولات
                  <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
              <li>
                <Link to="/signup" className="group flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
                  انضم إلينا
                  <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود 3 */}
          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-[#F9EA02]">حسابي</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/login" className="group flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
                  تسجيل الدخول
                  <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
              <li>
                <Link to="/profile" className="group flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
                  الملف الشخصي
                  <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
              <li>
                <Link to="/bookings/my" className="group flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
                  حجوزاتي
                  <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود 4 */}
          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-[#F9EA02]">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-[#F9EA02]">
                  <MapPin size={14} />
                </span>
                <div>
                  <p className="font-bold text-white">دمشق، سوريا</p>
                  <p className="text-xs text-white/40">المقر الرئيسي</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-[#F9EA02]">
                  <Mail size={14} />
                </span>
                <div>
                  <p className="font-bold text-white">info@riderz.sy</p>
                  <p className="text-xs text-white/40">البريد الإلكتروني</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* شريط الحقوق */}
        <div className={`${glass} mt-12 flex flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row`}>
          <p className="text-xs font-bold text-white/50">
            © 2026 <span className="text-[#F9EA02]">RiderZ</span> — جميع الحقوق محفوظة
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
            Made with 🚴 in Damascus
          </p>
        </div>

        {/* ✅ Developed by */}
        <p
          dir="ltr"
          className="mt-4 text-center text-xs font-medium text-white/35"
        >
          Developed by{" "}
          <a
            href="https://github.com/mohamed-alhalabi"
            target="_blank"
            rel="noopener noreferrer"
            className="-mx-2 -my-3 inline-flex min-h-11 items-center rounded-sm px-2 font-medium text-white/60 underline underline-offset-2 transition-colors hover:text-[#F9EA02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9EA02]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080c]"
          >
            Mohamed Al-Halabi
          </a>
        </p>
      </div>
    </footer>
  );
}