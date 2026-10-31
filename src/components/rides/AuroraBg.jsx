export default function AuroraBg() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-60 start-1/2 h-[60rem] w-[80rem] -translate-x-1/2 rotate-12 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(249,234,2,0.15),transparent_40%,rgba(249,234,2,0.08),transparent_70%,rgba(249,234,2,0.15))] blur-[120px]" />
      <div className="absolute top-1/4 -end-40 h-[32rem] w-[32rem] rounded-full bg-[#F9EA02]/8 blur-[140px]" />
      <div className="absolute bottom-1/3 -start-32 h-80 w-80 rounded-full bg-[#F9EA02]/6 blur-[120px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#F9EA02]/40 to-transparent" />

      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[28rem] bg-linear-to-t from-black via-black/80 to-transparent" />
    </div>
  );
}