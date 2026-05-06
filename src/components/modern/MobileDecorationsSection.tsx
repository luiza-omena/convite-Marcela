import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { assetUrl } from "@/lib/utils";

const MUSIC_SRC = assetUrl("/assets/aba_music.png");
const AUDIO_SRC = assetUrl("/audio/jb-beauty.mp3");
const START_AT_SECONDS = 50;

type MobileDecorPiece =
  { kind: "star"; size: string; pos: string; delay: number };

const TOP_DECOR: readonly MobileDecorPiece[] = [
  {
    kind: "star",
    size: "w-2 h-2",
    pos: "col-start-1 justify-self-start -translate-y-4 bg-violet-200",
    delay: 0.1,
  },
  {
    kind: "star",
    size: "w-2.5 h-2.5",
    pos: "col-start-3 justify-self-end translate-y-4 bg-violet-100",
    delay: 0.35,
  },
] as const;

const BOTTOM_DECOR: readonly MobileDecorPiece[] = [
  {
    kind: "star",
    size: "w-2 h-2",
    pos: "col-start-1 justify-self-start -translate-y-4 bg-violet-200",
    delay: 0.12,
  },
  {
    kind: "star",
    size: "w-3 h-3",
    pos: "col-start-2 justify-self-center translate-y-0 bg-violet-300",
    delay: 0.24,
  },
  {
    kind: "star",
    size: "w-2 h-2",
    pos: "col-start-3 justify-self-end translate-y-4 bg-violet-200",
    delay: 0.4,
  },
] as const;

interface MobileDecorationsSectionProps {
  placement: "top" | "middle" | "bottom";
}

function DecorNode({
  item,
  placement,
  index,
  isInView,
  delay,
}: {
  item: MobileDecorPiece;
  placement: string;
  index: number;
  isInView: boolean;
  delay: number;
}) {
  const baseAnim = {
    opacity: isInView ? 1 : 0,
    scale: isInView ? 1 : 0.9,
  };

  return (
    <motion.span
      key={`${placement}-star-${index}`}
      aria-hidden
      initial={{ opacity: 0, scale: 0.9 }}
      animate={baseAnim}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`rounded-full pointer-events-none select-none star-twinkle shadow-[0_0_12px_rgba(255,255,255,0.6)] ${item.size} ${item.pos}`}
      style={{ animationDelay: `${item.delay}s` }}
    />
  );
}

/** Ícones soltos espalhados — só mobile, aparece ao rolar */
export function MobileDecorationsSection({ placement }: MobileDecorationsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const showMusic = placement === "top";
  const gridColsClass =
    showMusic || placement === "bottom"
      ? "grid-cols-[1fr_auto_1fr]"
      : placement === "middle"
        ? "grid-cols-[auto_auto] justify-center gap-x-10"
        : "grid-cols-3";
  const decorPieces: readonly MobileDecorPiece[] =
    placement === "top"
      ? TOP_DECOR
      : placement === "middle"
        ? ([
            {
              kind: "star",
              size: "w-2.5 h-2.5",
              pos: "col-start-1 justify-self-center -translate-y-2 bg-violet-200",
              delay: 0.15,
            },
            {
              kind: "star",
              size: "w-3 h-3",
              pos: "col-start-2 justify-self-center translate-y-2 bg-violet-100",
              delay: 0.3,
            },
          ] as const)
        : BOTTOM_DECOR;

  const ensureStartAt = async (audio: HTMLAudioElement) => {
    if (audio.readyState < 1) {
      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          audio.removeEventListener("loadedmetadata", onLoaded);
          resolve();
        };
        audio.addEventListener("loadedmetadata", onLoaded, { once: true });
      });
    }
    const safeStart =
      Number.isFinite(audio.duration) && audio.duration > START_AT_SECONDS
        ? START_AT_SECONDS
        : 0;
    try {
      audio.currentTime = safeStart;
    } catch {}
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        audio.volume = 0.6;
        await ensureStartAt(audio);
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, []);

  return (
    <div ref={ref} className="sm:hidden relative py-12 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full"
      >
        <div className="mx-auto w-full max-w-sm">
          <div className={`grid items-center gap-x-7 ${gridColsClass}`}>
            {showMusic ? (
              <>
                <DecorNode
                  item={decorPieces[0]!}
                  placement={placement}
                  index={0}
                  isInView={isInView}
                  delay={0.1}
                />

                <motion.img
                  src={MUSIC_SRC}
                  alt={isPlaying ? "Parar música" : "Tocar música"}
                  aria-label={isPlaying ? "Parar música" : "Tocar música"}
                  role="button"
                  tabIndex={0}
                  onClick={toggleAudio}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggleAudio();
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    scale: isInView ? 1 : 0.9,
                    y: isPlaying ? [0, -4, 0] : 0,
                  }}
                  transition={{
                    opacity: { duration: 0.4, delay: 0.24 },
                    scale: { duration: 0.4, delay: 0.24 },
                    y: {
                      duration: 1.2,
                      repeat: isPlaying ? Infinity : 0,
                      ease: "easeInOut",
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    filter: isPlaying
                      ? "drop-shadow(0 0 14px rgba(167,139,250,0.55))"
                      : "drop-shadow(0 0 10px rgba(99,102,241,0.3))",
                  }}
                  className="col-start-2 justify-self-center translate-y-0 w-48 max-w-none h-auto cursor-pointer pointer-events-auto select-none"
                />

                <DecorNode
                  item={decorPieces[1]!}
                  placement={placement}
                  index={1}
                  isInView={isInView}
                  delay={0.32}
                />
              </>
            ) : (
              decorPieces.map((item, i) => (
                <DecorNode
                  key={`${placement}-piece-${i}`}
                  item={item}
                  placement={placement}
                  index={i}
                  isInView={isInView}
                  delay={0.1 + i * 0.12}
                />
              ))
            )}
          </div>
        </div>
      </motion.div>

      {showMusic && <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />}
    </div>
  );
}
