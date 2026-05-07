import { CAROUSEL_PHOTOS } from "@/components/shared/constants";
import { assetUrl } from "@/lib/utils";

/** Hero (trilha do player) */
const HERO_IMAGES = ["/assets/aba_music.png"].map(assetUrl);

/** Galeria Retro (banguela + amigos) */
const RETRO_GALLERY_IMAGES = [
  "/photos/banguela/01.png",
  "/photos/banguela/02.png",
  "/photos/banguela/03.png",
  "/photos/banguela/04.png",
  "/photos/banguela/05.png",
  "/photos/banguela/06.png",
  "/photos/banguela/07.png",
  "/photos/banguela/08.png",
  "/photos/banguela/09.png",
  "/photos/banguela/10.png",
  "/photos/banguela/11.png",
  "/photos/banguela/12.png",
  "/photos/banguela/13.png",
  "/photos/amigos/andre.jpeg",
  "/photos/amigos/sofia.jpeg",
  "/photos/amigos/geraldo.jpeg",
  "/photos/amigos/leo.jpeg",
].map(assetUrl);

/** Timeline (evitar flash ao scroll) */
const TIMELINE_IMAGES = [
  "/timeline/marcela1.jpeg",
  "/timeline/marcela2.jpeg",
  "/timeline/marcela3.jpeg",
  "/timeline/marcela4.jpeg",
  "/timeline/marcela5.jpeg",
  "/timeline/marcela6.jpeg",
  "/timeline/marcela7.jpeg",
  "/timeline/marcela8.jpeg",
  "/timeline/marcela9.jpeg",
  "/timeline/marcela10.jpeg",
].map(assetUrl);

const ALL_IMAGE_URLS = [
  ...new Set([
    ...CAROUSEL_PHOTOS,
    ...HERO_IMAGES,
    ...RETRO_GALLERY_IMAGES,
    ...TIMELINE_IMAGES,
  ]),
];

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.639587699286!2d-34.92789038905483!3d-8.036043691957492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab190a5198bb61%3A0x7047e6d46330725c!2sR.%20Ant%C3%B4nio%20Vitr%C3%BAvio%2C%2049%20-%20Po%C3%A7o%20da%20Panela%2C%20Recife%20-%20PE%2C%2052061-210!5e0!3m2!1sen!2sbr!4v1770926741118!5m2!1sen!2sbr";

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // não travar se uma falhar
    img.src = src;
  });
}

export function preloadAllImages(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return Promise.all(ALL_IMAGE_URLS.map(preloadImage)).then(() => {});
}

export function preloadMap(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve();
      return;
    }
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", MAP_EMBED_URL);
    iframe.setAttribute("style", "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("tabindex", "-1");
    const onDone = () => {
      try {
        document.body.removeChild(iframe);
      } catch {
        // ignore
      }
      resolve();
    };
    iframe.onload = onDone;
    // Timeout para não segurar para sempre se o mapa demorar
    const t = setTimeout(onDone, 12000);
    iframe.onerror = () => {
      clearTimeout(t);
      onDone();
    };
    document.body.appendChild(iframe);
  });
}

export async function preloadFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    // Garante que o browser comece a buscar as famílias usadas no layout
    await Promise.allSettled([
      document.fonts.load('400 1em "DM Sans"'),
      document.fonts.load('600 1em "DM Sans"'),
      document.fonts.load('400 1em "Space Grotesk"'),
      document.fonts.load('600 1em "Space Grotesk"'),
      document.fonts.load('400 1em "VT323"'),
      document.fonts.load('400 1em "Cinzel Decorative"'),
      document.fonts.load('700 1em "Cinzel Decorative"'),
    ]);
    await document.fonts.ready;
  } catch {
    // Não travar a entrada se algo falhar (ex.: bloqueio de rede)
  }
}

/** Precarrega todas as imagens e o iframe do mapa. Resolve quando tudo estiver pronto. */
export function preloadAll(): Promise<void> {
  return Promise.all([preloadAllImages(), preloadMap(), preloadFonts()]).then(
    () => {},
  );
}
