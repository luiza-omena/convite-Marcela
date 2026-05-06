import { useEffect, useMemo, useState } from "react";

type Props = {
  /** Número de pontos no céu */
  density?: number;
  className?: string;
  /** Tempo total para o céu "aparecer" */
  revealDurationSec?: number;
};

export function StarfieldBackground({
  density = 200,
  className = "",
  revealDurationSec = 2.6,
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const effectiveDensity = isMobile ? Math.round(density * 0.72) : density;

  const stars = useMemo(
    () =>
      Array.from({ length: effectiveDensity }).map((_, i) => {
        const size = isMobile
          ? 0.7 + Math.random() * 1.45
          : 0.8 + Math.random() * 2.2;

        const twinkle = isMobile
          ? 0.12 + Math.random() * 0.32
          : 0.15 + Math.random() * 0.55;

        return {
          id: `star-${i}`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size,
          duration: 2.5 + Math.random() * 5,
          delay: Math.random() * 6,
          twinkle,
          revealDelay:
            (i / Math.max(effectiveDensity, 1)) * revealDurationSec,
        };
      }),
    [effectiveDensity, revealDurationSec, isMobile],
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white star-twinkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: isMobile ? 0.28 + s.twinkle : 0.35 + s.twinkle,
            animationName: "star-appear, star-twinkle",
            animationDuration: `0.8s, ${s.duration}s`,
            animationDelay: `${s.revealDelay}s, ${
              s.revealDelay + s.delay
            }s`,
            animationFillMode: "both, both",
            animationTimingFunction: "ease-out, ease-in-out",
            animationIterationCount: "1, infinite",
          }}
        />
      ))}
    </div>
  );
}
