import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="max-w-xl mx-auto"
      >
        <div className="mb-8" aria-hidden />

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="font-modern text-3xl sm:text-4xl font-bold leading-tight">
            <span
              className="text-violet-300"
              style={{ textShadow: "0 0 28px rgba(167,139,250,0.45)" }}
            >
              Localização
            </span>
          </h2>
          <div className="galaxy-divider" aria-hidden />
        </div>


        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="galaxy-panel galaxy-panel-comet"
          style={{
            background: "hsla(230, 25%, 12%, 0.62)",
            backdropFilter: "blur(18px)",
            border: "1px solid transparent",
            backgroundImage:
              "linear-gradient(hsla(250, 28%, 11%, 0.72), hsla(250, 28%, 11%, 0.72)), linear-gradient(135deg, rgba(251,191,36,0.35) 0%, rgba(139,92,246,0.55) 48%, rgba(79,70,229,0.65) 100%)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            boxShadow:
              "0 18px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.12)",
          }}
        >
          {/* Info header */}
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-sans text-lg sm:text-xl text-white leading-tight mb-1">
                  Rua Poeta Luiz Raimundo Batista de Carvalho, 225
                </p>
                <p className="font-sans text-sm text-white/80">
                  Jardim Oceania
                </p>
              </div>

              <a
                href="https://maps.app.goo.gl/QATbRk6rJASV7hFz9"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-sans text-white
                           border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20
                           transition-colors"
                aria-label="Abrir no Google Maps (abre em outra página)"
              >
                <span>Abrir no Google Maps</span>

                {/* link-out icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="opacity-90"
                >
                  <path
                    d="M14 5h5v5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 14L19 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Map */}
          <div
            className="w-full h-[260px] sm:h-[340px] border-t border-violet-500/25"
            style={{
              boxShadow: "inset 0 1px 0 rgba(251,191,36,0.12)",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.380056765739!2d-34.836057525001905!3d-7.081862592921046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7acdda494b77b79%3A0x7b6bafefdaa0f86a!2sRua%20Poeta%20Luiz%20Raimundo%20Batista%20de%20Carvalho%2C%20225%20-%20Jardim%20Oceania%2C%20Jo%C3%A3o%20Pessoa%20-%20PB%2C%2058037-530!5e0!3m2!1spt-BR!2sbr!4v1778034629352!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter:
                  "invert(0.92) hue-rotate(180deg) saturate(0.45) brightness(0.85) contrast(1.08)",
              }}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do evento"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
