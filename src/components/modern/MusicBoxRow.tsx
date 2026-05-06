import {
  FastForward,
  Maximize,
  Minimize,
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "@/lib/utils";

const TRACKS = [
  {
    title: "I Just Might",
    artist: "Bruno Mars",
    cover: assetUrl("/assets/bruno-i-just-might.png"),
    audio: assetUrl("/audio/bruno-i-just-might.mp3"),
    startAt: 0,
    theme: {
      title: "#6d28d9",
      artist: "#7c3aed",
      activeWave: "#a78bfa",
      inactiveWave: "#ddd6fe",
      buttonText: "#8b5cf6",
      buttonBorder: "rgba(196,181,253,0.7)",
      trackBg: "rgba(221,214,254,0.7)",
      progress:
        "linear-gradient(to right, #e9d5ff, #c4b5fd, #a78bfa, #818cf8)",
      thumb: "linear-gradient(to bottom right, #c4b5fd, #818cf8)",
      playButton: "linear-gradient(to right, #c4b5fd, #a78bfa, #818cf8)",
      header:
        "linear-gradient(to right, rgba(196,181,253,0.95), rgba(167,139,250,0.95), rgba(129,140,248,0.92))",
      panel: `
        radial-gradient(ellipse 90% 70% at 50% -10%, rgba(167,139,250,0.16) 0%, transparent 55%),
        linear-gradient(to bottom, rgba(249,250,255,0.96), rgba(243,244,255,0.94))
      `,
      shadow: "0 0 30px rgba(76,29,149,0.14)",
    },
  },
  {
    title: "Locked Out of Heaven",
    artist: "Bruno Mars",
    cover: assetUrl("/assets/bruno-locked-out-of-heaven.png"),
    audio: assetUrl("/audio/bruno-locked-out-of-heaven.mp3"),
    startAt: 0,
    theme: {
      title: "#b91c1c",
      artist: "#7f1d1d",
      activeWave: "#ef4444",
      inactiveWave: "#fecaca",
      buttonText: "#b91c1c",
      buttonBorder: "rgba(248,113,113,0.55)",
      trackBg: "rgba(254,202,202,0.75)",
      progress:
        "linear-gradient(to right, #fee2e2, #fca5a5, #ef4444, #7f1d1d)",
      thumb: "linear-gradient(to bottom right, #fca5a5, #b91c1c)",
      playButton: "linear-gradient(to right, #fca5a5, #ef4444, #991b1b)",
      header:
        "linear-gradient(to right, rgba(127,29,29,0.88), rgba(185,28,28,0.9), rgba(167,139,250,0.75))",
      panel: `
        radial-gradient(ellipse 90% 70% at 50% -10%, rgba(239,68,68,0.14) 0%, transparent 55%),
        linear-gradient(to bottom, rgba(255,251,251,0.97), rgba(254,242,242,0.94))
      `,
      shadow: "0 0 30px rgba(127,29,29,0.14)",
    },
  },
  {
    title: "The Lazy Song",
    artist: "Bruno Mars",
    cover: assetUrl("/assets/bruno-the-lazy-song.png"),
    audio: assetUrl("/audio/bruno-the-lazy-song.mp3"),
    startAt: 0,
    theme: {
      title: "#ca8a04",
      artist: "#a16207",
      activeWave: "#facc15",
      inactiveWave: "#fef3c7",
      buttonText: "#ca8a04",
      buttonBorder: "rgba(250,204,21,0.55)",
      trackBg: "rgba(254,243,199,0.8)",
      progress:
        "linear-gradient(to right, #fef9c3, #fde68a, #facc15, #ca8a04)",
      thumb: "linear-gradient(to bottom right, #fde68a, #ca8a04)",
      playButton: "linear-gradient(to right, #fde68a, #facc15, #ca8a04)",
      header:
        "linear-gradient(to right, rgba(167,139,250,0.82), rgba(250,204,21,0.82), rgba(202,138,4,0.82))",
      panel: `
        radial-gradient(ellipse 90% 70% at 50% -10%, rgba(250,204,21,0.16) 0%, transparent 55%),
        linear-gradient(to bottom, rgba(255,253,244,0.97), rgba(254,249,195,0.4))
      `,
      shadow: "0 0 30px rgba(202,138,4,0.12)",
    },
  },
  {
    title: "That's What I Like",
    artist: "Bruno Mars",
    cover: assetUrl("/assets/bruno-thats-what-i-like.png"),
    audio: assetUrl("/audio/bruno-thats-what-i-like.mp3"),
    startAt: 0,
    theme: {
      title: "#312e81",
      artist: "#4f46e5",
      activeWave: "#818cf8",
      inactiveWave: "#dbeafe",
      buttonText: "#4f46e5",
      buttonBorder: "rgba(129,140,248,0.6)",
      trackBg: "rgba(219,234,254,0.75)",
      progress:
        "linear-gradient(to right, #e0f2fe, #c4b5fd, #818cf8, #312e81)",
      thumb: "linear-gradient(to bottom right, #a5b4fc, #312e81)",
      playButton: "linear-gradient(to right, #a5b4fc, #818cf8, #312e81)",
      header:
        "linear-gradient(to right, rgba(221,214,254,0.92), rgba(129,140,248,0.92), rgba(49,46,129,0.88))",
      panel: `
        radial-gradient(ellipse 90% 70% at 50% -10%, rgba(99,102,241,0.16) 0%, transparent 55%),
        linear-gradient(to bottom, rgba(248,250,255,0.97), rgba(238,242,255,0.95))
      `,
      shadow: "0 0 30px rgba(49,46,129,0.14)",
    },
  },
  {
    title: "24K Magic",
    artist: "Bruno Mars",
    cover: assetUrl("/assets/bruno-24k-magic.png"),
    audio: assetUrl("/audio/bruno-24k-magic.mp3"),
    startAt: 0,
    theme: {
      title: "#991b1b",
      artist: "#b45309",
      activeWave: "#f59e0b",
      inactiveWave: "#fde68a",
      buttonText: "#b45309",
      buttonBorder: "rgba(245,158,11,0.55)",
      trackBg: "rgba(253,230,138,0.75)",
      progress:
        "linear-gradient(to right, #fef3c7, #fbbf24, #ef4444, #991b1b)",
      thumb: "linear-gradient(to bottom right, #fbbf24, #991b1b)",
      playButton: "linear-gradient(to right, #fbbf24, #ef4444, #991b1b)",
      header:
        "linear-gradient(to right, rgba(167,139,250,0.75), rgba(245,158,11,0.84), rgba(153,27,27,0.88))",
      panel: `
        radial-gradient(ellipse 90% 70% at 50% -10%, rgba(245,158,11,0.15) 0%, transparent 55%),
        linear-gradient(to bottom, rgba(255,251,245,0.98), rgba(254,242,242,0.92))
      `,
      shadow: "0 0 30px rgba(153,27,27,0.13)",
    },
  },
];

export function MusicBoxRow() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const isSeekingRef = useRef(false);
  const shouldPlayAfterTrackChangeRef = useRef(false);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = TRACKS[trackIndex];
  const theme = currentTrack.theme;

  const progress =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;

  const waveformBars = useMemo(() => {
    return Array.from({ length: 56 }).map((_, i) => {
      return Math.sin(i / 3) * 18 + ((i * 11) % 14) + 26;
    });
  }, []);

  const stopProgressAnimation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const startProgressAnimation = () => {
    stopProgressAnimation();

    const update = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime || 0);

        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      }

      if (!audio.paused && !audio.ended) {
        animationRef.current = requestAnimationFrame(update);
      }
    };

    animationRef.current = requestAnimationFrame(update);
  };

  const ensureStartAt = async (
    audio: HTMLAudioElement,
    startAt: number,
    forceStart = false
  ) => {
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
      Number.isFinite(audio.duration) && audio.duration > startAt ? startAt : 0;

    try {
      if (forceStart || audio.currentTime === 0 || audio.ended) {
        audio.currentTime = safeStart;
        setCurrentTime(safeStart);
      }
    } catch {}
  };

  const playCurrentAudio = async (forceStart = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.55;

      await ensureStartAt(audio, currentTrack.startAt, forceStart);
      await audio.play();

      setIsPlaying(true);
      startProgressAnimation();
    } catch (err) {
      console.error("Audio play() failed:", err);
      setIsPlaying(false);
      stopProgressAnimation();
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);
    stopProgressAnimation();
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await playCurrentAudio(false);
    } else {
      pauseAudio();
    }
  };

  const changeTrack = (direction: number) => {
    const audio = audioRef.current;
    const shouldContinuePlaying = Boolean(audio && !audio.paused && !audio.ended);

    shouldPlayAfterTrackChangeRef.current = shouldContinuePlaying;

    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);
    stopProgressAnimation();
    setCurrentTime(0);
    setDuration(0);

    setTrackIndex((previousIndex) => {
      return (previousIndex + direction + TRACKS.length) % TRACKS.length;
    });
  };

  const jumpSeconds = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioDuration =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : duration;

    if (!Number.isFinite(audioDuration) || audioDuration <= 0) return;

    const nextTime = Math.min(
      audioDuration,
      Math.max(0, audio.currentTime + seconds)
    );

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);

    if (!audio.paused && !audio.ended) {
      startProgressAnimation();
    }
  };

  const handleProgressChange = (value: number) => {
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(duration) || duration <= 0) return;

    const nextTime = (duration * value) / 100;

    isSeekingRef.current = true;

    setCurrentTime(nextTime);
    audio.currentTime = nextTime;

    window.setTimeout(() => {
      isSeekingRef.current = false;

      if (!audio.paused && !audio.ended) {
        startProgressAnimation();
      }
    }, 80);
  };

  const handleClose = () => {
    pauseAudio();
    setIsExpanded(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    stopProgressAnimation();

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    audio.pause();
    audio.load();

    const shouldPlay = shouldPlayAfterTrackChangeRef.current;
    shouldPlayAfterTrackChangeRef.current = false;

    if (shouldPlay) {
      void playCurrentAudio(true);
    }
  }, [trackIndex]);

  useEffect(() => {
    return () => {
      stopProgressAnimation();
    };
  }, []);

  return (
    <section
      className={
        isExpanded
          ? "fixed inset-0 z-[9999] flex items-center justify-center px-3 py-4 bg-[#0f0a1e]/80 backdrop-blur-md"
          : "py-6 px-4"
      }
    >
      <motion.div
        animate={isPlaying ? { y: [0, -3, 0] } : {}}
        transition={{
          duration: 1.3,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
        className={isExpanded ? "w-full max-w-4xl mx-auto" : "max-w-lg mx-auto"}
      >
        <div
          className="w-full overflow-hidden rounded-[1.6rem] border bg-white/95"
          style={{
            borderColor: theme.buttonBorder,
            boxShadow: theme.shadow,
          }}
        >
          <div
            className="px-4 py-2.5 flex justify-end items-center gap-1.5"
            style={{ background: theme.header }}
          >
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
              aria-label="Diminuir player"
            >
              <Minimize className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
              aria-label="Aumentar player"
            >
              <Maximize className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
              aria-label="Fechar player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className={isExpanded ? "p-5 sm:p-6 md:p-9" : "p-4 sm:p-5 md:p-6"}
            style={{ background: theme.panel }}
          >
            <div
              className={
                isExpanded
                  ? "flex flex-row items-center gap-4 sm:gap-5 md:gap-7 mb-5 md:mb-7 text-left"
                  : "flex flex-row items-center gap-3 sm:gap-4 md:gap-5 mb-4 md:mb-6 text-left"
              }
            >
              <img
                src={currentTrack.cover}
                alt={`Capa de ${currentTrack.title}`}
                className={
                  isExpanded
                    ? "w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 object-cover rounded-lg shadow-lg border-4 border-white shrink-0"
                    : "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-cover rounded-lg shadow-lg border-4 border-white shrink-0"
                }
              />

              <div className="min-w-0 flex-1">
                <h2
                  className={
                    isExpanded
                      ? "text-lg sm:text-xl md:text-4xl font-bold mb-0.5 md:mb-1 tracking-tight leading-tight"
                      : "text-base sm:text-lg md:text-3xl font-bold mb-0.5 md:mb-1 tracking-tight leading-tight"
                  }
                  style={{
                    fontFamily: "monospace",
                    color: theme.title,
                  }}
                >
                  {currentTrack.title}
                </h2>

                <p
                  className={
                    isExpanded
                      ? "text-sm sm:text-base md:text-2xl leading-tight"
                      : "text-xs sm:text-sm md:text-xl leading-tight"
                  }
                  style={{
                    fontFamily: "monospace",
                    color: theme.artist,
                  }}
                >
                  {currentTrack.artist}
                </p>

                <p className="mt-1 md:mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-violet-400/70">
                  {trackIndex + 1} de {TRACKS.length}
                </p>
              </div>
            </div>

            <div
              className={
                isExpanded
                  ? "mb-4 md:mb-6 h-12 sm:h-14 md:h-28 flex items-center justify-center gap-[3px] px-0.5 md:px-2"
                  : "mb-4 md:mb-5 h-10 sm:h-12 md:h-20 flex items-center justify-center gap-[3px] px-0.5 md:px-2"
              }
            >
              {waveformBars.map((height, i) => {
                const isActive = i <= (progress / 100) * waveformBars.length;

                return (
                  <div
                    key={i}
                    className="flex-1 rounded-full transition-all"
                    style={{
                      height: `${height}%`,
                      backgroundColor: isActive
                        ? theme.activeWave
                        : theme.inactiveWave,
                    }}
                  />
                );
              })}
            </div>

            <div className="mb-4 md:mb-6 px-0.5 md:px-2">
              <div className="relative h-5 md:h-6 flex items-center">
                <div
                  className="absolute left-0 right-0 h-2 rounded-full"
                  style={{ backgroundColor: theme.trackBg }}
                />

                <div
                  className="absolute left-0 h-2 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: theme.progress,
                  }}
                />

                <div
                  className="absolute top-1/2 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 border-white shadow-md"
                  style={{
                    left: `${progress}%`,
                    transform: "translate(-50%, -50%)",
                    background: theme.thumb,
                  }}
                />

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={(e) => handleProgressChange(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  aria-label="Progresso da música"
                />
              </div>
            </div>

            <div className="flex justify-center items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => jumpSeconds(-10)}
                className="bg-white/90 hover:bg-violet-50 p-2 sm:p-2.5 md:p-3 rounded-xl shadow-sm transition-all hover:shadow-md border"
                style={{
                  color: theme.buttonText,
                  borderColor: theme.buttonBorder,
                }}
                aria-label="Voltar 10 segundos"
              >
                <Rewind className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>

              <button
                type="button"
                onClick={() => changeTrack(-1)}
                className="bg-white/90 hover:bg-violet-50 p-2 sm:p-2.5 md:p-3 rounded-xl shadow-sm transition-all hover:shadow-md border"
                style={{
                  color: theme.buttonText,
                  borderColor: theme.buttonBorder,
                }}
                aria-label="Música anterior"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>

              <button
                type="button"
                onClick={toggleAudio}
                className="p-3 sm:p-3.5 md:p-5 rounded-xl shadow-md transition-all hover:shadow-lg border text-white"
                style={{
                  background: theme.playButton,
                  borderColor: theme.buttonBorder,
                }}
                aria-label={isPlaying ? "Pausar música" : "Tocar música"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                )}
              </button>

              <button
                type="button"
                onClick={() => changeTrack(1)}
                className="bg-white/90 hover:bg-violet-50 p-2 sm:p-2.5 md:p-3 rounded-xl shadow-sm transition-all hover:shadow-md border"
                style={{
                  color: theme.buttonText,
                  borderColor: theme.buttonBorder,
                }}
                aria-label="Próxima música"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>

              <button
                type="button"
                onClick={() => jumpSeconds(10)}
                className="bg-white/90 hover:bg-violet-50 p-2 sm:p-2.5 md:p-3 rounded-xl shadow-sm transition-all hover:shadow-md border"
                style={{
                  color: theme.buttonText,
                  borderColor: theme.buttonBorder,
                }}
                aria-label="Avançar 10 segundos"
              >
                <FastForward className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <audio
        ref={audioRef}
        src={currentTrack.audio}
        preload="auto"
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;

          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
          }

          setCurrentTime(audio.currentTime || 0);
        }}
        onTimeUpdate={(e) => {
          if (isSeekingRef.current) return;

          const audio = e.currentTarget;

          setCurrentTime(audio.currentTime || 0);

          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          startProgressAnimation();
        }}
        onPause={() => {
          setIsPlaying(false);
          stopProgressAnimation();
        }}
        onEnded={() => {
          stopProgressAnimation();
          setCurrentTime(duration);

          shouldPlayAfterTrackChangeRef.current = true;

          setTrackIndex((previousIndex) => {
            return (previousIndex + 1) % TRACKS.length;
          });
        }}
      />
    </section>
  );
}
