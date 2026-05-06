import { useState, useEffect, useMemo, type FormEvent } from "react";
import { getAllRsvps, type RsvpDoc } from "@/lib/rsvpFirestore";

const PAGE_SIZE = 20;
const ADMIN_USER = "Marcela";
const ADMIN_PASSWORD = "MarcelaXV123";
const AUTH_STORAGE_KEY = "marcela-lista-convidados-auth";

interface PersonRow {
  num: number;
  name: string;
  isGuest: boolean;
  guestOf?: string;
  date?: string;
  declined?: boolean;
}

function formatDate(seconds?: number): string {
  if (!seconds) return "-";
  const d = new Date(seconds * 1000);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function rsvpsToPersonRows(rsvps: RsvpDoc[]): PersonRow[] {
  const rows: PersonRow[] = [];
  let num = 0;
  for (const r of rsvps) {
    const date = formatDate(r.createdAt?.seconds);
    const mainName = r.name?.trim() || "(sem nome)";
    num += 1;
    rows.push({ num, name: mainName, isGuest: false, date, declined: r.declined });
    if (r.hasGuest && !r.declined) {
      num += 1;
      rows.push({
        num,
        name: r.guestName?.trim() || "(acompanhante sem nome)",
        isGuest: true,
        guestOf: mainName,
        date,
      });
    }
  }
  return rows;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default function ListaConvidados() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [rsvps, setRsvps] = useState<RsvpDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth === "ok") {
        setIsAuthorized(true);
      }
    } catch {
      // ignore sessionStorage errors
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    setLoading(true);
    setError(null);
    getAllRsvps()
      .then(setRsvps)
      .catch((e) => setError(e?.message ?? "Erro ao carregar lista"))
      .finally(() => setLoading(false));
  }, [isAuthorized]);

  const allRows = useMemo(() => rsvpsToPersonRows(rsvps), [rsvps]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return allRows;
    const q = normalize(search.trim());
    return allRows.filter(
      (row) =>
        normalize(row.name).includes(q) ||
        (row.guestOf && normalize(row.guestOf).includes(q))
    );
  }, [allRows, search]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages - 1);
  const paginatedRows = useMemo(
    () =>
      filteredRows.slice(
        currentPage * PAGE_SIZE,
        currentPage * PAGE_SIZE + PAGE_SIZE
      ),
    [filteredRows, currentPage]
  );

  useEffect(() => {
    setPage(0);
  }, [search]);

  if (!isAuthorized) {
    const handleLogin = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validUser = username.trim() === ADMIN_USER;
      const validPassword = password === ADMIN_PASSWORD;

      if (!validUser || !validPassword) {
        setAuthError("Usuário ou senha inválidos.");
        return;
      }

      setAuthError(null);
      setIsAuthorized(true);
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "ok");
      } catch {
        // ignore sessionStorage errors
      }
    };

    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="rounded-2xl p-8 w-full max-w-md bg-white/[0.04] border border-white/[0.06]"
        >
          <p className="text-[#CB8CC2] font-modern font-bold text-xl mb-4">
            Acesso restrito
          </p>
          <p className="opacity-60 text-sm mb-5">
            Faça login para visualizar a lista de convidados.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuário"
              autoComplete="username"
              className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#3794CF]/50"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoComplete="current-password"
              className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#3794CF]/50"
            />
          </div>

          {authError && (
            <p className="text-red-300 text-xs mt-3 font-mono">{authError}</p>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white bg-[#3794CF]/70 hover:bg-[#3794CF]/85 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  const confirmedRows = allRows.filter(r => !r.declined);
  const declinedRows = allRows.filter(r => r.declined);
  const totalPessoas = confirmedRows.length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="font-modern font-bold text-xl sm:text-2xl text-white mb-1">
          Lista de confirmações
        </h1>
        <p className="font-mono text-[11px] tracking-widest uppercase text-[#7BB1D9]/80 mb-8">
          Presenças confirmadas
        </p>

        {loading && (
          <div className="rounded-xl p-12 text-center text-white/50 text-sm">
            Carregando...
          </div>
        )}

        {error && (
          <div className="rounded-xl p-4 border border-amber-500/30 text-amber-400 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && rsvps.length === 0 && (
          <div className="rounded-xl p-12 text-center text-white/50 text-sm">
            Nenhuma confirmação ainda.
          </div>
        )}

        {!loading && !error && rsvps.length > 0 && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome..."
                className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#3794CF]/50"
              />
              <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                {filteredRows.length} pessoa(s)
                {search && ` • "${search}"`}
              </div>
            </div>

            <div className="space-y-1 mb-8">
              {paginatedRows.map((row, i) => (
                <div
                  key={`row-${currentPage * PAGE_SIZE + i}`}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05] transition-colors"
                >
                  <span className="w-8 shrink-0 font-mono text-xs text-[#7BB1D9]/70 tabular-nums">
                    {row.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium ${row.declined ? 'text-white/40 line-through' : 'text-white'}`}>
                      {row.name}
                    </span>
                    {row.declined && (
                      <span className="ml-2 text-[10px] text-red-400/80 bg-red-400/10 px-1.5 py-0.5 rounded">
                        recusou
                      </span>
                    )}
                    {row.isGuest && row.guestOf && (
                      <span className="ml-2 text-[10px] text-[#CB8CC2]/80 bg-[#CB8CC2]/10 px-1.5 py-0.5 rounded">
                        acompanhante de {row.guestOf}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-white/30">
                    {row.date}
                  </span>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                >
                  ← Anterior
                </button>
                <span className="font-mono text-xs text-white/50">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                >
                  Próxima →
                </button>
              </div>
            )}

            <div className="rounded-xl p-5 bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7BB1D9]/80">
                  Total de pessoas
                </span>
                <span
                  className="font-modern font-bold text-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #7BB1D9, #3794CF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {totalPessoas}
                </span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">
                {rsvps.filter(r => !r.declined).length} confirmação(ões)
                {declinedRows.length > 0 && ` • ${declinedRows.length} recusa(s)`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
