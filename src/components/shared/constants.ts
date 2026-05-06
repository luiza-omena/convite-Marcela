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
  '/photos/luiza/01.jpeg',
  '/photos/luiza/02.jpeg',
  '/photos/luiza/03.jpeg',
  '/photos/luiza/04.jpeg',
  '/photos/luiza/05.jpeg',
  '/photos/luiza/06.jpeg',
  '/photos/luiza/07.jpeg',
  '/photos/luiza/08.jpeg',
  '/photos/luiza/09.jpeg',
  '/photos/luiza/10.jpeg',
  '/photos/luiza/11.jpeg',
  '/photos/luiza/12.jpeg',
  '/photos/luiza/13.jpeg',
  '/photos/luiza/14.jpeg',
  '/photos/meninas/01.jpeg',
  '/photos/meninas/02.jpeg',
  '/photos/meninas/03.jpeg',
  '/photos/meninas/04.jpeg',
  '/photos/meninas/05.jpeg',
  '/photos/meninas/06.jpeg',
  '/photos/meninas/07.jpeg',
  '/photos/meninas/08.jpeg',
  '/photos/meninas/09.jpeg',
  '/photos/meninas/10.jpeg',
  '/photos/meninas/11.jpeg',
  '/photos/meninas/12.jpeg',
  '/photos/meninas/13.jpeg',
  '/photos/meninas/14.jpeg',
  '/photos/meninas/15.jpeg',
  '/photos/meninas/16.jpeg',
  '/photos/meninas/17.jpeg',
  '/photos/meninas/18.jpeg',
  '/photos/meninas/19.jpeg',
  '/photos/meninas/20.jpeg',
  '/photos/meninas/21.jpeg',
  '/photos/meninas/22.jpeg',
  '/photos/meninas/23.jpeg',
  '/photos/meninas/24.jpeg',
  '/photos/meninas/25.jpeg',
  '/photos/meninas/26.jpeg',
  '/photos/meninas/27.jpeg',
  '/photos/meninas/28.jpeg',
  '/photos/meninas/29.jpeg',
  '/timeline/2026.png',
  '/timeline/amor.png',
  '/timeline/andar.png',
  '/timeline/animais.png',
  '/timeline/curso.png',
  '/timeline/mae.png',
  '/timeline/modelo.png',
  '/timeline/nasceu.png',
  '/timeline/novos_amigos.png',
  '/timeline/pessoas.png',
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
