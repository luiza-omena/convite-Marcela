import { useEffect, useMemo, useRef, useState } from "react";

type ShootingStar = {
  id: string;
  topPct: number;
  leftPct: number;
  delaySec: number;
  durationSec: number;
};

type Props = {
  /** Intervalo entre "passadas" (default: 2 minutos) */
  intervalMs?: number;
  /** Quantas estrelas por passada (default: 2) */
  starsPerBurst?: number;
  /** z-index tailwind (default: z-40) */
  className?: string;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeStar(now: number, i: number): ShootingStar {
  return {
    id: `${now}-${i}-${Math.random().toString(16).slice(2)}`,
    topPct: rand(10, 62),
    leftPct: rand(-24, -8),
    delaySec: rand(0, 0.9),
    durationSec: rand(4.2, 6.0),
  };
}

export function ShootingStarsOverlay({
  intervalMs = 120_000,
  starsPerBurst = 2,
  className = "",
}: Props) {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const timersRef = useRef<number[]>([]);

  const containerClass = useMemo(
    () =>
      `fixed inset-0 pointer-events-none overflow-hidden ${className || "z-40"}`,
    [className],
  );

  useEffect(() => {
    const clearAllTimers = () => {
      for (const t of timersRef.current) window.clearTimeout(t);
      timersRef.current = [];
    };

    const burst = () => {
      const now = Date.now();
      const nextStars = Array.from({ length: Math.max(1, starsPerBurst) }).map(
        (_, i) => makeStar(now, i),
      );

      setStars((prev) => [...prev, ...nextStars]);

      const maxLifetimeMs =
        (Math.max(...nextStars.map((s) => s.delaySec + s.durationSec)) + 0.6) *
        1000;

      const removeTimer = window.setTimeout(() => {
        setStars((prev) => prev.filter((s) => !nextStars.some((n) => n.id === s.id)));
      }, maxLifetimeMs);

      timersRef.current.push(removeTimer);
    };

    // Aguarda 2 min para a primeira "passada" (como pedido).
    const first = window.setTimeout(() => {
      burst();
      const interval = window.setInterval(burst, intervalMs);
      timersRef.current.push(interval);
    }, intervalMs);

    timersRef.current.push(first);

    return () => {
      clearAllTimers();
    };
  }, [intervalMs, starsPerBurst]);

  if (stars.length === 0) return null;

  return (
    <div className={containerClass} aria-hidden>
      {stars.map((s) => (
        <span
          key={s.id}
          className="shooting-star"
          style={{
            top: `${s.topPct}%`,
            left: `${s.leftPct}%`,
            animationDelay: `${s.delaySec}s`,
            animationDuration: `${s.durationSec}s`,
            animationIterationCount: 1 as unknown as number,
          }}
        />
      ))}
    </div>
  );
}

