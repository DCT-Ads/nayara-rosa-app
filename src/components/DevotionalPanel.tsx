import { useMemo, useState } from 'react';
import { BookOpen, Heart, Mic2, Globe2, Sparkles, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  formatDevotionalDate,
  getTodayDevotional,
  type DevotionalQuestion,
} from '../data/devotional';
import { DevotionalAmbientPlayers } from './DevotionalAmbientPlayers';

function QuestionCard({
  item,
  index,
  open,
  onToggle,
}: {
  item: DevotionalQuestion;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <p className="muted" style={{ marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Pergunta {index + 1}
      </p>
      <p style={{ fontWeight: 600, lineHeight: 1.45, marginBottom: 12 }}>{item.prompt}</p>
      <button
        type="button"
        className="btn btn-ghost"
        style={{
          width: '100%',
          minHeight: 40,
          fontSize: '0.8125rem',
          borderColor: open ? 'rgba(212,165,116,0.4)' : undefined,
          color: open ? 'var(--accent-gold)' : undefined,
        }}
        onClick={onToggle}
      >
        {open ? <Check size={16} /> : <Sparkles size={16} />}
        {open ? 'Encorajamento revelado' : 'Receber encorajamento'}
      </button>
      {open && (
        <p
          className="anim-fade-up"
          style={{
            marginTop: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            fontSize: '0.9rem',
            borderLeft: '2px solid rgba(233,30,140,0.45)',
            paddingLeft: 12,
          }}
        >
          {item.encouragement}
        </p>
      )}
    </div>
  );
}

export function DevotionalPanel() {
  const { userName } = useApp();
  const today = useMemo(() => getTodayDevotional(), []);
  const dateLabel = useMemo(() => formatDevotionalDate(), []);
  const [openQ, setOpenQ] = useState<Record<number, boolean>>({});
  const [amen, setAmen] = useState(false);

  return (
    <section className="section anim-fade-up" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-header">
        <h3 className="h3">Devocional diário</h3>
        <BookOpen size={18} color="var(--accent-gold)" strokeWidth={1.75} />
      </div>
      <p className="caption" style={{ marginBottom: 14, marginTop: -8, textTransform: 'capitalize' }}>
        {dateLabel}
      </p>

      <div
        className="card"
        style={{
          padding: 18,
          marginBottom: 14,
          background:
            'linear-gradient(145deg, rgba(233,30,140,0.12), rgba(245,166,35,0.08)), var(--card)',
        }}
      >
        <p
          className="gold-soft"
          style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          Para você, {userName}
        </p>
        <h4 className="h3" style={{ marginTop: 6 }}>
          {today.theme}
        </h4>
        <p
          style={{
            marginTop: 12,
            fontStyle: 'italic',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            fontSize: '0.95rem',
          }}
        >
          “{today.verse}”
        </p>
        <p className="caption gold-soft" style={{ marginTop: 8 }}>
          — {today.reference}
        </p>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <p className="muted" style={{ marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Reflexão
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.55, fontSize: '0.9rem' }}>
          {today.reflection}
        </p>
      </div>

      <div className="section-header" style={{ marginTop: 8 }}>
        <h3 className="h3" style={{ fontSize: '1rem' }}>
          Perguntas para o coração
        </h3>
      </div>
      <p className="caption" style={{ marginBottom: 12, marginTop: -6 }}>
        Responda em oração e toque para receber encorajamento
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {today.questions.map((q, i) => (
          <QuestionCard
            key={`${today.id}-q${i}`}
            item={q}
            index={i}
            open={Boolean(openQ[i])}
            onToggle={() => setOpenQ((prev) => ({ ...prev, [i]: !prev[i] }))}
          />
        ))}
      </div>

      <div className="section-header">
        <h3 className="h3" style={{ fontSize: '1rem' }}>
          Palavra para a família Nayara
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        <div className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Heart size={18} color="var(--accent-pink)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>Fãs</p>
            <p className="caption" style={{ lineHeight: 1.5 }}>
              {today.forFans}
            </p>
          </div>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Mic2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>Cantores amigos</p>
            <p className="caption" style={{ lineHeight: 1.5 }}>
              {today.forSingers}
            </p>
          </div>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Globe2 size={18} color="var(--accent-pink)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>Missionários</p>
            <p className="caption" style={{ lineHeight: 1.5 }}>
              {today.forMissionaries}
            </p>
          </div>
        </div>
      </div>

      <DevotionalAmbientPlayers />

      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%' }}
        onClick={() => setAmen(true)}
      >
        {amen ? <Check size={16} /> : <Sparkles size={16} />}
        {amen ? 'Amém registrado — que Deus te abençoe' : 'Orar e dizer amém'}
      </button>
    </section>
  );
}
