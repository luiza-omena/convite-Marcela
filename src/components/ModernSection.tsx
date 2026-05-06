import { motion } from "framer-motion";
import Timeline from "./Timeline";
import MapSection from "./MapSection";
import { useCallback, useState } from "react";
import { ConfettiOverlay } from "./modern/ConfettiOverlay";
import { RsvpSection } from "./modern/RsvpSection";
import { MarqueeStrip } from "./modern/MarqueeStrip";
import { Hero } from "./modern/Hero";
import { MobileDecorationsSection } from "./modern/MobileDecorationsSection";
import { Footer } from "./modern/Footer";
import { MessagesSection } from "./modern/MessagesSection";
import { PhotoCarousel } from "./modern/PhotoCarousel";
import { MusicBoxRow } from "./modern/MusicBoxRow";
import { StarfieldBackground } from "./StarfieldBackground";

export default function ModernSection() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [rsvpVersion, setRsvpVersion] = useState(0);

  const launchConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4500);
  }, []);

  const handleRsvpConfirm = useCallback(() => {
    launchConfetti();
    setRsvpVersion((v) => v + 1);
  }, [launchConfetti]);

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

          <MobileDecorationsSection placement="bottom" />

          <MobileDecorationsSection placement="middle" />

          <PhotoCarousel />

          <Footer />
        </div>
      </div>
    </motion.div>
  );
}
