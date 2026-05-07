import { motion } from "framer-motion";
import { StarfieldBackground } from "@/components/StarfieldBackground";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-x-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(167,139,250,0.4) 0%, transparent 55%)",
        }}
        aria-hidden
      />

<StarfieldBackground
  density={280}
  revealDurationSec={3.8}
  className="z-0 opacity-95 hero-stars-fade"
/>

      {/* Planetários — só desktop */}
      <div
        className="hidden sm:block absolute inset-0 pointer-events-none z-[1]"
        aria-hidden
      >
        <div
          className="absolute w-40 h-40 rounded-full blur-2xl opacity-40 top-[12%] left-[8%]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #ddd6fe 0%, #8b5cf6 55%, transparent 70%)",
          }}
        />

        <div
          className="absolute w-52 h-52 rounded-full blur-3xl opacity-35 bottom-[14%] right-[6%]"
          style={{
            background:
              "radial-gradient(circle at 70% 40%, #6366f1 0%, #312e81 60%, transparent 72%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.2 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-drawn mb-3 leading-none">
          <span
            className="bg-clip-text text-transparent hero-title-glow"
            style={{
              backgroundImage:
                "linear-gradient(to right, #e9d5ff, #c4b5fd, #a78bfa, #818cf8)",
              textShadow: `
                0 0 8px rgba(221,214,254,0.35),
                0 0 34px rgba(167,139,250,0.28)
              `,
            }}
          >
            Marcela
          </span>
        </h1>

        <p className="font-drawn text-4xl sm:text-6xl lg:text-7xl text-violet-100/90 mb-8 tracking-wide">
          XV
        </p>

        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.65 }}
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-400 to-purple-400" />

          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <motion.path
              d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
              fill="#e9d5ff"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <div className="h-px w-24 bg-gradient-to-l from-transparent via-blue-400 to-blue-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="space-y-2"
        >
          <p className="font-timeline text-white/95 text-base sm:text-lg leading-relaxed">
            <span className="text-violet-200 font-medium">
              06 de junho de 2026
            </span>
            <span className="text-white/50"> · </span>
            início às <span className="text-violet-300">18h</span>
          </p>

          <p className="font-timeline text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto px-6">
            Rua Poeta Luiz Raimundo Batista de Carvalho, 225
          </p>
        </motion.div>

        <motion.div
          className="mt-16"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="inline-flex flex-col items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm shadow-[0_0_18px_rgba(167,139,250,0.08)]">
            <p
              className="font-mono text-[10px] tracking-[0.26em] uppercase bg-clip-text text-transparent opacity-90"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(233,213,255,0.9) 0%, rgba(196,181,253,0.82) 40%, rgba(167,139,250,0.78) 100%)",
                textShadow: "0 0 18px rgba(167,139,250,0.14)",
              }}
            >
              Confirma aqui embaixo
            </p>
            <span className="text-lg text-violet-200/70 leading-none">↓</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
