import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Preloader from "@/components/Preloader";
import ModernSection from "@/components/ModernSection";

type Phase = "loading" | "modern";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (phase === "loading" || phase === "modern") {
      document.documentElement.classList.add("dark");
      document.body.style.background =
        phase === "loading"
          ? "radial-gradient(ellipse 120% 80% at 50% 20%, #1e1b4b 0%, #0f0a1a 45%, #030712 100%)"
          : "#050816";
      return () => {
        document.documentElement.classList.remove("dark");
        document.body.style.background = "";
      };
    }
  }, [phase]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <Preloader key="preloader" onComplete={() => setPhase("modern")} />
        )}

        {phase === "modern" && <ModernSection key="modern" />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
