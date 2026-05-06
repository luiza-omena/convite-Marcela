export function Footer() {
  return (
    <footer className="py-20 text-center border-t border-white/[0.08]">
      <div
        className="font-modern font-black leading-tight mb-6 bg-clip-text"
        style={{
          fontSize: "clamp(2rem, 6vw, 5rem)",
          letterSpacing: "-2px",
          background: "linear-gradient(135deg, #fcd34d, #a78bfa, #818cf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        06.05.26
      </div>
      <p className="font-mono text-[11px] tracking-[3px] uppercase opacity-30">
        Feito com amor e carinho · © 2026 Marcela
      </p>
    </footer>
  );
}
