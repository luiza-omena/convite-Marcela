export function ConfettiOverlay() {
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 8 + 4}px`,
    height: `${Math.random() * 8 + 4}px`,
    background: ['#c4b5fd', '#fcd34d', '#a78bfa', '#818cf8', '#f472b6', '#38bdf8'][i % 6],
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    animationDuration: `${Math.random() * 2 + 2}s`,
    animationDelay: `${Math.random() * 0.5}s`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {pieces.map((style, i) => (
        <div
          key={i}
          className="absolute animate-confetti-fall"
          style={{
            left: style.left,
            width: style.width,
            height: style.height,
            background: style.background,
            borderRadius: style.borderRadius,
            animationDuration: style.animationDuration,
            animationDelay: style.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
