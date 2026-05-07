// Shared constants — tema astronomia (índigos, violetas, dourado)
import { assetUrl } from "@/lib/utils";

export const PALETTE = {
  bluePastel: '#c4b5fd',
  blueMedium: '#a78bfa',
  blueVivid: '#8b5cf6',
  blueIntense: '#7c3aed',
  blueDeep: '#4c1d95',
  lilacLight: '#fcd34d',
  lilacMedium: '#f59e0b',
} as const;

export const THEME = {
  desktop: PALETTE.blueVivid,
  titleBar: PALETTE.blueDeep,
  titleText: '#FFFFFF',
  winFace: '#D4D0C8',
  winFace2: '#ECE9D8',
  winShadow: '#808080',
  winDkShadow: '#404040',
  winHighlight: '#FFFFFF',
  winLight: '#F5F5F5',
  text: '#000000',
  subText: '#3B3B3B',
  lilac: PALETTE.lilacLight,
  plum: PALETTE.lilacMedium,
  progress1: PALETTE.blueIntense,
  progress2: PALETTE.blueDeep,
  navy: PALETTE.blueDeep,
  deep: '#06122A',
  paper: '#ECE9D8',
  ink: '#101114',
};

export const STICKER_EMOJIS = ['✦', '✧', '⋆', '✶', '·'];

export const MARQUEE_ITEMS = [
  'MARCELA ALVES', '15 ANOS', 'DEBUTEI', '2026', 'XV',
];

/** Fotos de todas as pastas em public, exceto banguela e assets (para o carrossel) */
export const CAROUSEL_PHOTOS = [
  "/photos/Marcela/marcela11.jpeg",
  "/photos/Marcela/marcela12.jpeg",
  "/photos/Marcela/marcela13.jpeg",
  "/photos/Marcela/marcela14.jpeg",
  "/photos/Marcela/marcela15.jpeg",
  "/photos/Marcela/marcela16.jpeg",
  "/photos/Marcela/marcela17.jpeg",
  "/photos/Marcela/marcela18.jpeg",
  "/photos/Marcela/marcela19.jpeg",
  "/photos/Marcela/marcela20.jpeg",
  "/photos/Marcela/marcela21.jpeg",
  "/photos/Marcela/marcela22.jpeg",
].map(assetUrl);

/** Chave e tipo para persistir confirmação de presença (uma vez só) */
export const RSVP_STORAGE_KEY = 'marcela-15anos-rsvp-v1';

export interface RsvpStorage {
  confirmed: boolean;
  declined?: boolean;
  name?: string;
  hasGuest?: boolean;
  guestName?: string;
  /** Identificador único do convidado, usado para permitir apagar próprias mensagens */
  senderId?: string;
}
