import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StarfieldBackground } from "./StarfieldBackground";

interface Props {
  onComplete: () => void;
}

const INTRO_DURATION_MS = 3600;
const EXIT_DURATION_MS = 650;

export default function Preloader({ onComplete }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const intro = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onComplete, EXIT_DURATION_MS);
    }, INTRO_DURATION_MS);

    return () => clearTimeout(intro);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-5"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 20%, #1e1b4b 0%, #0f0a1a 45%, #030712 100%)",
      }}
    >
      <StarfieldBackground density={340} revealDurationSec={3.6} className="z-0" />
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
        <span
          className="shooting-star"
          style={{
            top: "16%",
            left: "-10%",
            animationDelay: "0.3s",
            animationDuration: "4.4s",
          }}
        />
        <span
          className="shooting-star"
          style={{
            top: "34%",
            left: "-18%",
            animationDelay: "2.5s",
            animationDuration: "5.2s",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: isClosing ? 0 : 1,
          y: isClosing ? -12 : 0,
          scale: isClosing ? 0.98 : 1,
        }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md text-center overflow-visible"
      >
<div className="flex justify-center overflow-visible">
  <h1
    className="font-drawn inline-block whitespace-nowrap text-7xl sm:text-8xl leading-[1.2] pb-3 pr-8 -mr-8 mb-1 bg-clip-text text-transparent overflow-visible"
    style={{
      backgroundImage:
        "linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 35%, #a78bfa 70%, #8b5cf6 100%)",
      textShadow: "0 0 46px rgba(167,139,250,0.35)",
    }}
  >
    Marcela
  </h1>
</div>

        <p className="font-modern text-sm sm:text-base tracking-[0.35em] uppercase text-violet-200/85 mb-10">
          15 anos
        </p>

        <motion.div
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.45, 0.95, 0.45], scale: [0.95, 1.02, 0.95] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto h-2.5 w-48 rounded-full bg-gradient-to-r from-transparent via-violet-300/80 to-transparent blur-[0.5px]"
        />

      </motion.div>
    </motion.div>
  );
}
