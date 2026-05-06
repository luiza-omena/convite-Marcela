import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredRsvp, ensureSenderId } from '@/lib/rsvpStorage';
import {
  sendMessage,
  deleteMessage,
  subscribeToMessages,
  type Message,
} from '@/lib/messagesFirestore';
import { PALETTE } from '@/components/shared/constants';

function formatRelativeTime(timestamp: { toDate: () => Date } | null): string {
  if (!timestamp) return '';
  const now = Date.now();
  const then = timestamp.toDate().getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return 'agora';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}min`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
  return `${Math.floor(diffSec / 86400)}d`;
}

/** Post-its nas cores do site: azuis e lilases */
const POST_IT_STYLES = [
  {
    bg: `linear-gradient(135deg, ${PALETTE.bluePastel}40 0%, ${PALETTE.blueMedium}30 100%)`,
    border: `${PALETTE.blueMedium}50`,
  },
  {
    bg: `linear-gradient(135deg, ${PALETTE.blueVivid}25 0%, ${PALETTE.blueIntense}20 100%)`,
    border: `${PALETTE.blueVivid}40`,
  },
  {
    bg: `linear-gradient(135deg, ${PALETTE.lilacLight}50 0%, ${PALETTE.lilacMedium}40 100%)`,
    border: `${PALETTE.lilacMedium}50`,
  },
  {
    bg: `linear-gradient(135deg, ${PALETTE.bluePastel}35 0%, ${PALETTE.lilacLight}30 100%)`,
    border: `${PALETTE.blueMedium}40`,
  },
  {
    bg: `linear-gradient(135deg, ${PALETTE.blueIntense}20 0%, ${PALETTE.blueDeep}15 100%)`,
    border: `${PALETTE.blueIntense}35`,
  },
  {
    bg: `linear-gradient(135deg, ${PALETTE.lilacMedium}35 0%, ${PALETTE.bluePastel}25 100%)`,
    border: `${PALETTE.lilacMedium}40`,
  },
] as const;

function getPostItStyle(index: number) {
  return POST_IT_STYLES[index % POST_IT_STYLES.length];
}

function getPostItRotation(index: number): number {
  const rotations = [-2, 1.5, -1, 2, -1.5, 0.5, -0.5, 1];
  return rotations[index % rotations.length];
}

interface PostItNoteProps {
  msg: Message;
  index: number;
  canDelete: boolean;
  onDelete: (id: string) => void;
}

function PostItNote({ msg, index, canDelete, onDelete }: PostItNoteProps) {
  const style = getPostItStyle(index);
  const rotation = getPostItRotation(index);
  const showAuthor =
    msg.showNameOnWall !== false && !!msg.guestName?.trim();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    if (!canDelete || deleting) return;
    setDeleting(true);
    onDelete(msg.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 5 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative min-h-[100px] flex flex-col rounded-lg border overflow-hidden group"
      style={{
        background: style.bg,
        borderColor: style.border,
        boxShadow:
          '0 2px 8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div className="p-4 flex-1">
        <p className="text-white/95 text-sm leading-relaxed break-words font-timeline">
          {msg.text}
        </p>
      </div>
      <div className="px-4 pb-3 pt-2 flex justify-between items-center gap-2">
        {showAuthor ? (
          <span className="text-xs font-medium text-white/70 truncate flex-1">
            — {msg.guestName!.trim()}
          </span>
        ) : (
          <span className="flex-1" />
        )}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-white/50">
            {formatRelativeTime(msg.createdAt)}
          </span>
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="opacity-60 hover:opacity-100 p-1 rounded transition-opacity text-white/80 hover:text-white"
              aria-label="Apagar meu recado"
              title="Apagar meu recado"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface MessagesSectionProps {
  /** Incrementa quando o RSVP é confirmado, forçando re-leitura do localStorage */
  rsvpVersion?: number;
}

export function MessagesSection({ rsvpVersion = 0 }: MessagesSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [showNameOnWall, setShowNameOnWall] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const rsvp = getStoredRsvp();
  const rsvpWithSender = rsvp ? ensureSenderId(rsvp) : null;
  const currentSenderId = rsvpWithSender?.senderId ?? null;
  const hasConfirmed = !!rsvp;

  useEffect(() => {
    return subscribeToMessages(setMessages);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || !hasConfirmed) return;
    setSending(true);
    await sendMessage(
      trimmed,
      rsvpWithSender?.name,
      rsvpWithSender?.senderId,
      showNameOnWall,
    ).catch(() => {});
    setText('');
    setSending(false);
  };

  const handleDelete = async (id: string) => {
    await deleteMessage(id).catch(() => { });
  };

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-violet-300 mb-4 text-center">
          Quadro de recados
        </p>
        <h2 className="font-modern text-3xl sm:text-4xl font-bold mb-3 leading-tight text-center">
          Deixe seu recado{' '}
          <span
            className="text-violet-400"
            style={{ textShadow: '0 0 28px rgba(167,139,250,0.45)' }}
          >
            pra Ma
          </span>
        </h2>
        <div className="galaxy-divider mb-6" aria-hidden />

        <p className="text-center text-white/50 text-sm mb-10 font-timeline max-w-md mx-auto">
          Veja as mensagens que os convidados deixaram no mural e deixe a sua também.
        </p>

        {/* Mural */}
        <div className="glass galaxy-panel galaxy-panel-nebula overflow-hidden border border-white/10">
          {/* Área do mural */}
          <div
            className="relative min-h-[320px] overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,18,42,0.6) 0%, rgba(10,39,68,0.5) 50%, rgba(6,18,42,0.7) 100%)',
            }}
          >
            <div
              ref={listRef}
              className="p-6 overflow-y-auto h-full"
              style={{ maxHeight: 360 }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[240px] text-white/40">
                  <svg
                    className="w-16 h-16 mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-sm font-timeline">Nenhum recado ainda.</p>
                  <p className="text-xs mt-1">Seja o primeiro a deixar uma mensagem!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg, i) => (
                      <PostItNote
                        key={msg.id}
                        msg={msg}
                        index={i}
                        canDelete={
                          !!currentSenderId &&
                          !!msg.senderId &&
                          msg.senderId === currentSenderId
                        }
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Área de input */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-white/[0.02]">
            {hasConfirmed ? (
              <>
                <p className="text-white/60 text-xs font-mono mb-3">
                  Deixe seu recado no mural:
                </p>
                <div className="flex gap-2 items-end">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Escreva sua mensagem..."
                    rows={2}
                    className="flex-1 min-h-[44px] max-h-[160px] resize-y bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-timeline text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!text.trim() || sending}
                    className={`px-5 py-3 rounded-xl font-modern font-bold text-sm transition-all shrink-0 ${text.trim() && !sending
                        ? 'bg-violet-600 text-white cursor-pointer hover:shadow-[0_0_22px_rgba(124,58,237,0.4)] hover:brightness-110'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}
                  >
                    {sending ? '...' : 'Enviar'}
                  </button>
                </div>
                <label className="mt-3 flex items-center gap-2 cursor-pointer group">
                  <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={showNameOnWall}
                      onChange={(e) => setShowNameOnWall(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="flex h-4 w-4 items-center justify-center rounded border border-white/20 bg-white/5 transition-colors group-hover:border-white/40 peer-checked:border-violet-500/60 peer-checked:bg-violet-600/25 peer-checked:[&>svg]:opacity-100">
                      <svg
                        className="h-2.5 w-2.5 text-violet-300 opacity-0 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </span>
                  <span className="text-xs font-mono tracking-wide text-white/50 group-hover:text-white/70 transition-colors">
                    Exibir meu nome junto da mensagem no mural
                  </span>
                </label>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                <p className="text-white/60 text-sm font-timeline mb-2">
                  <a
                    href="#confirmar-presenca"
                    className="text-violet-300 hover:text-violet-400 underline underline-offset-2 transition-colors"
                  >
                    Confirme sua presença
                  </a>{' '}
                  acima para deixar um recado no mural.
                </p>
                <p className="text-white/40 text-xs font-mono">
                  Você pode ver os recados de outras pessoas enquanto isso.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
