import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getStoredRsvp, saveRsvp, saveDecline } from "@/lib/rsvpStorage";
import type { RsvpStorage } from "@/components/shared/constants";

interface RsvpSectionProps {
  onConfirm: () => void;
}

export function RsvpSection({ onConfirm }: RsvpSectionProps) {
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState<RsvpStorage | null>(
    null,
  );

  useEffect(() => {
    setAlreadyConfirmed(getStoredRsvp());
  }, []);

  const alreadyResponded = !!alreadyConfirmed;
  const canSubmit = name.trim().length > 0 && !alreadyResponded;

  const handleConfirm = () => {
    if (!canSubmit) return;
    saveRsvp({
      confirmed: true,
      name: name.trim(),
    });
    setConfirmed(true);
    setAlreadyConfirmed(getStoredRsvp());
    onConfirm();
    setTimeout(() => setConfirmed(false), 4000);
  };

  const handleDecline = () => {
    if (!canSubmit) return;
    saveDecline({ name: name.trim() });
    setDeclined(true);
    setAlreadyConfirmed(getStoredRsvp());
    onConfirm();
    setTimeout(() => setDeclined(false), 4000);
  };

  if (alreadyConfirmed) {
    const isDeclined = !!alreadyConfirmed.declined;
    return (
      <section id="confirmar-presenca" className="py-20 px-6 relative">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-mono text-xs tracking-[4px] uppercase text-violet-300 mb-4">
            Confirme presença
          </p>
          <h2 className="font-modern text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Vamo <span className="text-violet-400" style={{ textShadow: '0 0 28px rgba(167,139,250,0.45)' }}>comemorar</span>?
          </h2>
          <div className="galaxy-divider mb-8" aria-hidden />

          <div className="glass galaxy-panel galaxy-panel-aurora p-8 sm:p-12">
            {isDeclined ? (
              <>
                <p className="text-fuchsia-300 font-modern font-bold mb-4">
                  Entendido! Vamos sentir sua falta.
                </p>
                <p className="opacity-70 mb-6 leading-relaxed">
                  Se mudar de ideia, entre em contato comigo pelo{" "}
                  <a
                    href="https://wa.me/5583988802845"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-300 hover:text-violet-400 underline underline-offset-2 transition-colors"
                  >
                    WhatsApp
                  </a>
                  .
                </p>
              </>
            ) : (
              <>
                <p className="text-violet-400 font-modern font-bold mb-4">
                  Você só precisa confirmar uma vez.
                  <br/>Sua presença já está confirmada!
                </p>
                <p className="opacity-70 mb-6 leading-relaxed">
                  Se precisar alterar algo, entre em contato comigo pelo{" "}
                  <a
                    href="https://wa.me/5583988802845"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-300 hover:text-violet-400 underline underline-offset-2 transition-colors"
                  >
                    WhatsApp
                  </a>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="confirmar-presenca" className="py-20 px-6 relative">
      <div className="max-w-lg mx-auto text-center">
        <p className="font-mono text-xs tracking-[4px] uppercase text-violet-300 mb-4">
          Confirme presença
        </p>
        <h2 className="font-modern text-3xl sm:text-4xl font-bold mb-3 leading-tight">
          Vamo <span className="text-violet-400" style={{ textShadow: '0 0 28px rgba(167,139,250,0.45)' }}>comemorar</span>?
        </h2>
        <div className="galaxy-divider mb-8" aria-hidden />

        <div className="glass galaxy-panel galaxy-panel-aurora p-8 sm:p-12">
          <p className="opacity-50 mb-8 leading-relaxed">
            Confirme sua presença e faça parte dessa celebração! Vou adorar ter
            você lá.
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome *"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 text-sm font-mono placeholder:opacity-30 focus:outline-none focus:border-violet-500/60 transition-colors"
          />

          <div className="flex gap-3 mt-4">
            <motion.button
              type="button"
              whileHover={canSubmit ? { scale: 1.03 } : undefined}
              whileTap={canSubmit ? { scale: 0.95 } : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={!canSubmit}
              className={`flex-1 py-3.5 rounded-full font-modern font-bold text-sm tracking-wider transition-all duration-300 ${
                confirmed
                  ? "bg-emerald-500 text-white cursor-default"
                  : canSubmit
                    ? "bg-violet-600 text-white hover:shadow-[0_0_40px_rgba(124,58,237,0.45)] cursor-pointer"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {confirmed ? "Confirmado!" : "Confirmar"}
            </motion.button>

            <motion.button
              type="button"
              whileHover={canSubmit ? { scale: 1.03 } : undefined}
              whileTap={canSubmit ? { scale: 0.95 } : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleDecline();
              }}
              disabled={!canSubmit}
              className={`flex-1 py-3.5 rounded-full font-modern text-sm tracking-wider transition-all duration-300 ${
                declined
                  ? "border border-fuchsia-400/80 text-fuchsia-300 cursor-default"
                  : canSubmit
                    ? "border border-white/20 text-white/60 hover:border-fuchsia-400/40 hover:text-fuchsia-300 cursor-pointer"
                    : "border border-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              {declined ? "Registrado!" : "Não posso ir"}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
