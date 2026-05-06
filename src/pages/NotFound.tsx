import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.7 + 0.3,
      })),
    []
  );

  const shootingStars = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        top: Math.random() * 55,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 2 + 2.5,
      })),
    []
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 text-white">
      <style>
        {`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
              filter: hue-rotate(0deg);
            }
            50% {
              background-position: 100% 50%;
              filter: hue-rotate(18deg);
            }
            100% {
              background-position: 0% 50%;
              filter: hue-rotate(0deg);
            }
          }

          @keyframes floatBlob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            50% {
              transform: translate(28px, -36px) scale(1.12);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          @keyframes twinkle {
            0%, 100% {
              opacity: 0.25;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.25);
            }
          }

          @keyframes shooting {
            0% {
              transform: translate3d(0, 0, 0) rotate(315deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: translate3d(-520px, 520px, 0) rotate(315deg);
              opacity: 0;
            }
          }
        `}
      </style>

      {/* Background animado */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #020617, #0f172a, #172554, #312e81, #0f172a)",
          backgroundSize: "300% 300%",
          animation: "gradientShift 14s ease infinite",
        }}
      />

      {/* Brilhos / nébulas */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl"
          style={{ animation: "floatBlob 11s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[6%] top-[10%] h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl"
          style={{ animation: "floatBlob 13s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[6%] left-[30%] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl"
          style={{ animation: "floatBlob 15s ease-in-out infinite" }}
        />
      </div>

      {/* Estrelas */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              boxShadow: `0 0 ${star.size * 4}px rgba(255,255,255,0.8)`,
            }}
          />
        ))}
      </div>

      {/* Estrelas cadentes */}
      <div className="pointer-events-none absolute inset-0">
        {shootingStars.map((meteor) => (
          <span
            key={meteor.id}
            className="absolute h-[2px] w-32 rounded-full"
            style={{
              top: `${meteor.top}%`,
              left: `${meteor.left}%`,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,1), rgba(147,197,253,0.2))",
              boxShadow: "0 0 12px rgba(255,255,255,0.9)",
              animation: `shooting ${meteor.duration}s linear ${meteor.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950/55 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10">
        <h1 className="mb-3 text-7xl font-bold text-white sm:text-8xl">
          404
        </h1>

        <h2 className="mb-3 text-2xl font-semibold text-white">
          Página não encontrada
        </h2>

        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
          A página que você tentou acessar não existe ou foi movida.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:scale-105 hover:bg-white/90"
          >
            Voltar para Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:bg-white/10"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
