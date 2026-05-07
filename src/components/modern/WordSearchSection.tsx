import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

type Step = -1 | 0 | 1;
type Dir = { dr: Step; dc: Step };
type Cell = { r: number; c: number };

type WordSearchGame = {
  name: string;
  words: readonly string[];
};

type Puzzle = {
  grid: string[][];
  words: string[];
  placements: Map<string, Cell[]>;
};

const WORD_SEARCH_GAMES: readonly WordSearchGame[] = [
  {
    name: "Marcela",
    words: [
      "Marcela",
      "quinze",
      "festa",
      "danca",
      "familia",
      "amigos",
      "curtir",
      "aniversario",
    ],
  },
  {
    name: "Galáxia",
    words: [
      "estrelas",
      "galaxia",
      "lua",
      "cometa",
      "planeta",
      "universo",
      "saturno",
      "meteoro",
    ],
  },
  {
    name: "Baile",
    words: [
      "musica",
      "brilho",
      "baile",
      "vestido",
      "bolo",
      "convite",
      "sonho",
      "alegria",
    ],
  },
  {
    name: "Memórias",
    words: [
      "risadas",
      "fotos",
      "abracos",
      "doces",
      "desejos",
      "familia",
      "amigos",
      "noite",
    ],
  },
] as const;

const DIRS: readonly Dir[] = [
  { dr: 0, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: 1, dc: 0 },
  { dr: -1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: -1, dc: 1 },
  { dr: -1, dc: -1 },
] as const;

function randomSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, maxIncl: number) {
  return Math.floor(rng() * (maxIncl - min + 1)) + min;
}

function normalizeWord(word: string) {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

function keyOf(cell: Cell) {
  return `${cell.r}:${cell.c}`;
}

function sameCell(a: Cell, b: Cell) {
  return a.r === b.r && a.c === b.c;
}

function samePath(a: Cell[], b: Cell[]) {
  if (a.length !== b.length) return false;
  return a.every((cell, index) => sameCell(cell, b[index]!));
}

function getDirection(from: Cell, to: Cell): Dir | null {
  const dr = to.r - from.r;
  const dc = to.c - from.c;

  if (dr === 0 && dc === 0) return null;

  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);
  const isStraightLine = dr === 0 || dc === 0 || absDr === absDc;

  if (!isStraightLine) return null;

  return {
    dr: (dr === 0 ? 0 : dr > 0 ? 1 : -1) as Step,
    dc: (dc === 0 ? 0 : dc > 0 ? 1 : -1) as Step,
  };
}

function directionsAreEqual(a: Dir | null, b: Dir | null) {
  if (!a || !b) return false;
  return a.dr === b.dr && a.dc === b.dc;
}

function buildLine(from: Cell, to: Cell) {
  const dir = getDirection(from, to);
  if (!dir) return null;

  const distance = Math.max(Math.abs(to.r - from.r), Math.abs(to.c - from.c));
  const cells: Cell[] = [];

  for (let i = 0; i <= distance; i++) {
    cells.push({ r: from.r + dir.dr * i, c: from.c + dir.dc * i });
  }

  return cells;
}

function buildStringFromCells(grid: string[][], cells: Cell[]) {
  return cells.map((cell) => grid[cell.r]?.[cell.c] ?? "").join("");
}

function makeEmptyGrid(size: number) {
  return Array.from({ length: size }, () =>
    Array.from<string | null>({ length: size }).fill(null)
  );
}

function canPlaceWord(
  grid: (string | null)[][],
  word: string,
  start: Cell,
  dir: Dir
) {
  const size = grid.length;

  for (let i = 0; i < word.length; i++) {
    const r = start.r + dir.dr * i;
    const c = start.c + dir.dc * i;

    if (r < 0 || c < 0 || r >= size || c >= size) return false;

    const current = grid[r]![c];
    if (current !== null && current !== word[i]) return false;
  }

  return true;
}

function placeWord(
  grid: (string | null)[][],
  word: string,
  start: Cell,
  dir: Dir
) {
  const cells: Cell[] = [];

  for (let i = 0; i < word.length; i++) {
    const r = start.r + dir.dr * i;
    const c = start.c + dir.dc * i;

    grid[r]![c] = word[i]!;
    cells.push({ r, c });
  }

  return cells;
}

function fillGrid(grid: (string | null)[][], rng: () => number) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      if (grid[r]![c] === null) {
        grid[r]![c] = letters[randInt(rng, 0, letters.length - 1)]!;
      }
    }
  }
}

function generatePuzzle(words: string[], size: number, seed: number): Puzzle {
  const rng = mulberry32(seed);
  const grid = makeEmptyGrid(size);
  const placements = new Map<string, Cell[]>();
  const placedWords: string[] = [];

  const sortedWords = [...words]
    .map(normalizeWord)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    let placed = false;

    for (let attempt = 0; attempt < 600 && !placed; attempt++) {
      const dir = DIRS[randInt(rng, 0, DIRS.length - 1)]!;
      const start: Cell = {
        r: randInt(rng, 0, size - 1),
        c: randInt(rng, 0, size - 1),
      };

      if (!canPlaceWord(grid, word, start, dir)) continue;

      const cells = placeWord(grid, word, start, dir);
      placements.set(word, cells);
      placedWords.push(word);
      placed = true;
    }
  }

  fillGrid(grid, rng);

  return {
    grid: grid as string[][],
    words: placedWords,
    placements,
  };
}

function getCellFromElement(element: Element | null): Cell | null {
  const button = element?.closest?.("button[data-r][data-c]") as HTMLButtonElement | null;

  if (!button) return null;

  const r = Number(button.dataset.r);
  const c = Number(button.dataset.c);

  if (!Number.isFinite(r) || !Number.isFinite(c)) return null;

  return { r, c };
}


function updateSelectionInStraightLine(
  current: Cell[],
  nextCell: Cell,
  resetOnInvalid: boolean
) {
  if (current.length === 0) return [nextCell];

  const start = current[0]!;

  if (sameCell(start, nextCell)) return [start];

  const line = buildLine(start, nextCell);

  if (!line) {
    return resetOnInvalid ? [nextCell] : current;
  }

  if (current.length >= 2) {
    const currentDirection = getDirection(current[0]!, current[1]!);
    const nextDirection = getDirection(start, nextCell);

    if (!directionsAreEqual(currentDirection, nextDirection)) {
      return resetOnInvalid ? [nextCell] : current;
    }
  }

  return line;
}

export function WordSearchSection() {
  const [gameIndex, setGameIndex] = useState(0);
  const [seed, setSeed] = useState(() => randomSeed());
  const [found, setFound] = useState<Set<string>>(() => new Set());
  const [foundCells, setFoundCells] = useState<Map<string, Set<string>>>(() => new Map());
  const [selection, setSelection] = useState<Cell[]>([]);
  const [hintCell, setHintCell] = useState<Cell | null>(null);
  const [hintWord, setHintWord] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<Cell[]>([]);
  const pointerIdRef = useRef<number | null>(null);
  const pointerMovedRef = useRef(false);
  const lastPointerCellRef = useRef<Cell | null>(null);

  const activeGame = WORD_SEARCH_GAMES[gameIndex % WORD_SEARCH_GAMES.length]!;

  const normalizedWords = useMemo(
    () => activeGame.words.map(normalizeWord).filter(Boolean),
    [activeGame]
  );

  const size = useMemo(() => {
    const longest = normalizedWords.reduce(
      (max, word) => Math.max(max, word.length),
      0
    );

    return Math.max(13, Math.min(15, longest + 4));
  }, [normalizedWords]);

  const puzzle = useMemo(() => {
    let generated = generatePuzzle(normalizedWords, size, seed);

    for (let i = 1; generated.words.length < normalizedWords.length && i <= 8; i++) {
      generated = generatePuzzle(normalizedWords, size, seed + i * 1009);
    }

    return generated;
  }, [normalizedWords, seed, size]);

  const selectedKeys = useMemo(() => new Set(selection.map(keyOf)), [selection]);

  const foundKeys = useMemo(() => {
    const keys = new Set<string>();

    for (const cells of foundCells.values()) {
      for (const key of cells) keys.add(key);
    }

    return keys;
  }, [foundCells]);

  const selectedText = useMemo(
    () => buildStringFromCells(puzzle.grid, selection),
    [puzzle.grid, selection]
  );

  const remaining = puzzle.words.filter((word) => !found.has(word));
  const progress = puzzle.words.length
    ? Math.round((found.size / puzzle.words.length) * 100)
    : 0;

  const syncSelection = useCallback((next: Cell[]) => {
    selectionRef.current = next;
    setSelection(next);
  }, []);

  const clearSelection = useCallback(() => {
    selectionRef.current = [];
    setSelection([]);
  }, []);

  const resetCurrentGameState = useCallback(() => {
    setFound(new Set());
    setFoundCells(new Map());
    setHintCell(null);
    setHintWord(null);
    clearSelection();
    pointerIdRef.current = null;
    pointerMovedRef.current = false;
    lastPointerCellRef.current = null;
  }, [clearSelection]);

  const changeGame = () => {
    resetCurrentGameState();
    setGameIndex((current) => (current + 1) % WORD_SEARCH_GAMES.length);
    setSeed(randomSeed());
  };

  const updatePathWithCell = useCallback(
    (cell: Cell, resetOnInvalid: boolean) => {
      const current = selectionRef.current;
      const next = updateSelectionInStraightLine(current, cell, resetOnInvalid);

      if (samePath(current, next)) return;

      syncSelection(next);
    },
    [syncSelection]
  );

  const tryCompleteSelection = useCallback(
    (clearInvalid: boolean) => {
      const path = selectionRef.current;

      if (path.length < 2) {
        if (clearInvalid) clearSelection();
        return;
      }

      const text = buildStringFromCells(puzzle.grid, path);
      const reversedText = text.split("").reverse().join("");

      const match = puzzle.words.find(
        (word) => !found.has(word) && (word === text || word === reversedText)
      );

      if (!match) {
        if (clearInvalid) clearSelection();
        return;
      }

      setFound((current) => new Set(current).add(match));
      setFoundCells((current) => {
        const next = new Map(current);
        next.set(match, new Set(path.map(keyOf)));
        return next;
      });

      if (hintWord === match) {
        setHintCell(null);
        setHintWord(null);
      }

      clearSelection();
    },
    [clearSelection, found, hintWord, puzzle.grid, puzzle.words]
  );

  const finishPointerSelection = useCallback(() => {
    const shouldClearInvalid = pointerMovedRef.current;

    pointerIdRef.current = null;
    pointerMovedRef.current = false;
    lastPointerCellRef.current = null;

    tryCompleteSelection(shouldClearInvalid);
  }, [tryCompleteSelection]);

  const cancelPointerSelection = useCallback(() => {
    pointerIdRef.current = null;
    pointerMovedRef.current = false;
    lastPointerCellRef.current = null;
    clearSelection();
  }, [clearSelection]);

  const cellFromPoint = useCallback(
    (clientX: number, clientY: number): Cell | null => {
      const grid = gridRef.current;
      if (!grid) return null;

      const rect = grid.getBoundingClientRect();

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return null;
      }

      const element = document.elementFromPoint(clientX, clientY);
      const fromElement = getCellFromElement(element);

      if (fromElement) return fromElement;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const c = Math.min(
        size - 1,
        Math.max(0, Math.floor((x / Math.max(rect.width, 1)) * size))
      );
      const r = Math.min(
        size - 1,
        Math.max(0, Math.floor((y / Math.max(rect.height, 1)) * size))
      );

      return { r, c };
    },
    [size]
  );

  useEffect(() => {
    const handleWindowPointerMove = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return;

      const cell = cellFromPoint(event.clientX, event.clientY);
      if (!cell) return;

      const lastCell = lastPointerCellRef.current;
      if (lastCell && sameCell(lastCell, cell)) return;

      event.preventDefault();

      pointerMovedRef.current = true;
      lastPointerCellRef.current = cell;
      updatePathWithCell(cell, false);
    };

    const handleWindowPointerUp = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return;
      finishPointerSelection();
    };

    const handleWindowPointerCancel = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return;
      cancelPointerSelection();
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerCancel);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerCancel);
    };
  }, [
    cancelPointerSelection,
    cellFromPoint,
    finishPointerSelection,
    updatePathWithCell,
  ]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const cell = cellFromPoint(event.clientX, event.clientY);
    if (!cell) return;

    event.preventDefault();

    pointerIdRef.current = event.pointerId;
    pointerMovedRef.current = false;
    lastPointerCellRef.current = cell;

    updatePathWithCell(cell, true);
  };

  const requestHint = () => {
    const missing = puzzle.words.filter((word) => !found.has(word));
    if (missing.length === 0) return;

    const rng = mulberry32(seed + missing.length * 17 + found.size + 1337);
    const word = missing[Math.floor(rng() * missing.length)]!;
    const path = puzzle.placements.get(word);

    if (!path?.length) return;

    setHintWord(word);
    setHintCell(path[0]!);
  };

  return (
    <section id="caca-palavras" className="py-20 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-xs tracking-[4px] uppercase text-violet-300 mb-4">
            Para descontrair
          </p>

          <h2 className="font-modern text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Caça{" "}
            <span
              className="text-violet-400"
              style={{ textShadow: "0 0 28px rgba(167,139,250,0.45)" }}
            >
              palavras
            </span>
          </h2>

          <div className="galaxy-divider mb-6" aria-hidden />

          <p className="opacity-60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Clique nas letras em sequência ou arraste em linha reta para encontrar as palavras.
          </p>
        </div>

        <div className="glass galaxy-panel galaxy-panel-nebula p-5 sm:p-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[3px] uppercase opacity-50">
                    {activeGame.name}
                  </span>

                  <span className="font-modern font-bold text-sm text-violet-200">
                    {found.size}/{puzzle.words.length} ({progress}%)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selection.length > 0 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearSelection}
                      className="px-4 py-2 rounded-full font-modern font-bold text-xs tracking-wider border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Limpar
                    </motion.button>
                  )}

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={requestHint}
                    className="px-4 py-2 rounded-full font-modern font-bold text-xs tracking-wider border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Pedir dica
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={changeGame}
                    className="px-4 py-2 rounded-full font-modern font-bold text-xs tracking-wider border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Trocar jogo
                  </motion.button>
                </div>
              </div>

              <div className="mb-4 h-[74px]">
                <div
                  className={[
                    "h-full rounded-xl border px-4 py-3 transition-opacity duration-150",
                    selection.length > 0
                      ? "border-white/10 bg-white/5 opacity-100"
                      : "border-transparent bg-transparent opacity-0 pointer-events-none",
                  ].join(" ")}
                  aria-hidden={selection.length === 0}
                >
                  <p className="text-xs font-mono uppercase tracking-[3px] opacity-45 mb-1">
                    Selecionando
                  </p>
                  <p className="font-modern font-bold text-sm text-amber-100 whitespace-nowrap overflow-hidden text-ellipsis">
                    {selectedText || "-"}
                  </p>
                </div>
              </div>

              {hintCell && hintWord && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-amber-200/20 bg-amber-200/10 px-4 py-3"
                >
                  <p className="text-sm leading-relaxed opacity-80">
                    Dica: a{" "}
                    <span className="font-modern font-bold text-amber-100">
                      primeira letra
                    </span>{" "}
                    de uma palavra foi destacada.
                  </p>
                </motion.div>
              )}

              <div className="select-none touch-none">
                <div
                  ref={gridRef}
                  className="grid gap-1.5 sm:gap-2 touch-none"
                  style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
                  role="grid"
                  aria-label="Caça-palavras"
                  onPointerDown={handlePointerDown}
                >
                  {puzzle.grid.map((row, r) =>
                    row.map((letter, c) => {
                      const key = `${r}:${c}`;
                      const foundCell = foundKeys.has(key);
                      const selectedCell = selectedKeys.has(key);
                      const hinted = hintCell?.r === r && hintCell?.c === c && !foundCell;

                      return (
                        <button
                          key={key}
                          type="button"
                          role="gridcell"
                          aria-label={`linha ${r + 1} coluna ${c + 1}`}
                          data-r={r}
                          data-c={c}
                          draggable={false}
                          className={[
                            "aspect-square touch-none rounded-lg sm:rounded-xl border text-center font-mono font-bold",
                            "text-[11px] sm:text-xs",
                            "transition-colors duration-100",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06122A]",
                            foundCell
                              ? "bg-violet-500/20 border-violet-300/30 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.22)]"
                              : selectedCell
                                ? "bg-amber-200/15 border-amber-200/35 text-amber-100 shadow-[0_0_18px_rgba(252,211,77,0.18)]"
                                : hinted
                                  ? "bg-amber-200/10 border-amber-200/35 text-amber-100 shadow-[0_0_22px_rgba(252,211,77,0.22)] animate-pulse"
                                  : "bg-white/5 border-white/10 text-white/90 hover:bg-white/8",
                          ].join(" ")}
                        >
                          {letter}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] tracking-[3px] uppercase opacity-50">
                    Palavras
                  </span>

                  <span className="text-xs font-modern font-bold text-amber-200/80">
                    {remaining.length === 0 ? "Concluído!" : `${remaining.length} faltando`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {puzzle.words.map((word) => {
                    const done = found.has(word);

                    return (
                      <span
                        key={word}
                        className={[
                          "px-3 py-1.5 rounded-full text-[11px] font-modern font-bold tracking-wide border",
                          done
                            ? "bg-violet-400/20 border-violet-300/30 text-violet-100"
                            : "bg-transparent border-white/10 text-white/65",
                        ].join(" ")}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>

                {remaining.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl border border-amber-200/20 bg-amber-200/10 p-4"
                  >
                    <p className="font-modern font-bold text-amber-100 mb-1">Aí sim!</p>
                    <p className="text-sm opacity-70 leading-relaxed">
                      Você encontrou todas as palavras. Clique em trocar jogo para ir para o próximo.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
