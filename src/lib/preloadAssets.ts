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
  "/timeline/nasceu.png",
  "/timeline/andar.png",
  "/timeline/mae.png",
  "/timeline/animais.png",
  "/timeline/modelo.png",
  "/timeline/pessoas.png",
  "/timeline/curso.png",
  "/timeline/novos_amigos.png",
  "/timeline/amor.png",
  "/timeline/2026.png",
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

/** Precarrega todas as imagens e o iframe do mapa. Resolve quando tudo estiver pronto. */
export function preloadAll(): Promise<void> {
  return Promise.all([preloadAllImages(), preloadMap()]).then(() => {});
}
