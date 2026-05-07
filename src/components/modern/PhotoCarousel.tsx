import { useMemo } from "react";
import { Paperclip } from "lucide-react";
import { CAROUSEL_PHOTOS } from "@/components/shared/constants";

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function PhotoCarousel() {
  const photos = useMemo(() => {
    const shuffled = shuffle(CAROUSEL_PHOTOS);
    return [...shuffled, ...shuffled];
  }, []);

  const photoSize = "clamp(100px, 16vw, 180px)";

  return (
    <section className="py-6 border-t border-white/[0.08] overflow-hidden relative">
      {/* Cordinha do cabide */}
      <div
        className="absolute left-0 right-0 top-4 z-10 h-0.5 rounded-full opacity-70"
        style={{
          background: "linear-gradient(90deg, transparent, #CB8CC2 10%, #7BB1D9 50%, #CB8CC2 90%, transparent)",
          boxShadow: "0 0 10px rgba(203, 140, 194, 0.25)",
        }}
        aria-hidden
      />

      <div className="relative -mt-2">
        <div
          className="flex gap-8 w-max animate-marquee hover:[animation-play-state:paused] items-end"
          style={{ animationDuration: "50s" }}
        >
          {photos.map((src, i) => (
            <a
              key={`${src}-${i}`}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CB8CC2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06122A] group"
              style={{ width: photoSize, height: photoSize }}
            >
              {/* Clipe no canto superior esquerdo; foto caída na diagonal */}
              <div
                className="relative w-full h-full"
                style={{ width: photoSize, height: photoSize }}
              >
                <div
                  className="absolute top-0 left-0 z-20"
                  style={{ transform: "translate(-4px, -8px) rotate(-25deg)" }}
                  aria-hidden
                >
                  <Paperclip
                    size={26}
                    strokeWidth={2.5}
                    style={{ color: "#7BB1D9" }}
                  />
                </div>
                <div
                  className="absolute rounded-xl overflow-hidden border border-white/[0.12] shadow-lg group-hover:border-[#3794CF]/50 group-hover:shadow-[0_0_20px_rgba(55,148,207,0.2)] transition-all duration-300"
                  style={{
                    width: photoSize,
                    height: photoSize,
                    left: "8px",
                    top: "0px",
                    transform: "rotate(8deg)",
                    transformOrigin: "top left",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
