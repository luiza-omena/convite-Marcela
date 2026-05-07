import { motion } from "framer-motion";
import Timeline from "./Timeline";
import MapSection from "./MapSection";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConfettiOverlay } from "./modern/ConfettiOverlay";
import { RsvpSection } from "./modern/RsvpSection";
import { MarqueeStrip } from "./modern/MarqueeStrip";
import { Hero } from "./modern/Hero";
import { MobileDecorationsSection } from "./modern/MobileDecorationsSection";
import { Footer } from "./modern/Footer";
import { MessagesSection } from "./modern/MessagesSection";
import { PhotoCarousel } from "./modern/PhotoCarousel";
import { MusicBoxRow } from "@/components/modern/MusicBoxRow";
import { StarfieldBackground } from "./StarfieldBackground";
import { WordSearchSection } from "./modern/WordSearchSection";

export default function ModernSection() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [rsvpVersion, setRsvpVersion] = useState(0);
  const didNudgeRef = useRef(false);
  const didScrollDownRef = useRef(false);

  const launchConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4500);
  }, []);

  const handleRsvpConfirm = useCallback(() => {
    launchConfetti();
    setRsvpVersion((v) => v + 1);
  }, [launchConfetti]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("scroll-nudge-v1") === "1") return;

    const onScroll = () => {
      if (window.scrollY > 80) didScrollDownRef.current = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const t = window.setTimeout(() => {
      if (didNudgeRef.current) return;
      if (didScrollDownRef.current) return;
      if (window.scrollY > 40) return;

      didNudgeRef.current = true;
      sessionStorage.setItem("scroll-nudge-v1", "1");
      window.scrollBy({ top: 140, behavior: "smooth" });
    }, 30_000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen relative dark modern-section-bg"
      style={{
        background:
          "linear-gradient(180deg, #030712 0%, #0f172a 18%, #1e1b4b 45%, #312e81 72%, #0f172a 92%, #030712 100%)",
        color: "#f8fafc",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {showConfetti && <ConfettiOverlay />}

      <div className="relative z-10">
        <Hero />
      </div>

      <div className="relative">
        <StarfieldBackground
          density={180}
          revealDurationSec={3}
          className="z-0 opacity-70 lower-stars-fade"
        />

        <div className="relative z-10">
          <RsvpSection onConfirm={handleRsvpConfirm} />
          <MobileDecorationsSection placement="top" />

          <MapSection />

          <MessagesSection rsvpVersion={rsvpVersion} />

          <MusicBoxRow />

          <MarqueeStrip />

          <Timeline />

          <WordSearchSection />

          <MobileDecorationsSection placement="bottom" />

          <MobileDecorationsSection placement="middle" />

          <PhotoCarousel />

          <Footer />
        </div>
      </div>
    </motion.div>
  );
}
