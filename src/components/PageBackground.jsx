export default function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-40 -start-40 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(249,234,2,0.15),transparent_70%)]" />
      <div className="absolute -bottom-40 -end-40 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.15),transparent_70%)]" />
      <div className="absolute left-1/2 top-1/3 size-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.10),transparent_70%)]" />
    </div>
  );
}