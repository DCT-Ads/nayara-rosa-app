import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Heart, Sparkles, Check, Plus, Pencil } from 'lucide-react';
import {
  missions,
  prayers as seedPrayers,
  images,
  type PrayerRequest,
  type TimelineMark,
} from '../data/content';
import { Reveal } from '../components/Reveal';
import { useApp } from '../context/AppContext';
import {
  createTimelineMark,
  deleteTimelineMark,
  fetchTimeline,
  updateTimelineMark,
  uploadTimelineMedia,
} from '../api/timeline';
import {
  TimelineEditorModal,
  type TimelineFormData,
} from '../components/TimelineEditorModal';

function timelinePhotoClass(mark: TimelineMark): string {
  const t = mark.title.toLowerCase();
  if (
    t.includes('nascimento') ||
    t.includes('ellóa') ||
    t.includes('elloa') ||
    mark.mediaUrl?.includes('2crym7')
  ) {
    return 'timeline-photo--baby';
  }
  if (t.includes('casamento')) return 'timeline-photo--wedding';
  if (
    t.includes('ados') ||
    t.includes('incendeia') ||
    t.includes('jesus') ||
    t.includes('cordas') ||
    t.includes('eleva') ||
    t.includes('passos')
  ) {
    return 'timeline-photo--stage';
  }
  return '';
}

export function AltarScreen() {
  const { isAdmin, adminEmail } = useApp();
  const [tab, setTab] = useState<'oracao' | 'missoes' | 'trajetoria'>('oracao');
  const [prayers, setPrayers] = useState(seedPrayers);
  const [text, setText] = useState('');
  const [prayed, setPrayed] = useState<Record<string, boolean>>({});
  const [missionProgress, setMissionProgress] = useState(
    Object.fromEntries(missions.map((m) => [m.id, m.progress])),
  );
  const [marks, setMarks] = useState<TimelineMark[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [timelineError, setTimelineError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<TimelineMark | null>(null);
  const [saving, setSaving] = useState(false);

  const loadTimeline = useCallback(async () => {
    try {
      setTimelineError('');
      const data = await fetchTimeline();
      setMarks(data);
    } catch (err) {
      setTimelineError(err instanceof Error ? err.message : 'Falha ao carregar trajetória');
    } finally {
      setTimelineLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTimeline();
  }, [loadTimeline]);

  function submitPrayer(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const item: PrayerRequest = {
      id: `p-${Date.now()}`,
      author: 'Você',
      text: text.trim(),
      prayedCount: 0,
      timeAgo: 'agora',
    };
    setPrayers((p) => [item, ...p]);
    setText('');
  }

  function prayTogether(id: string) {
    if (prayed[id]) return;
    setPrayed((p) => ({ ...p, [id]: true }));
    setPrayers((list) =>
      list.map((x) => (x.id === id ? { ...x, prayedCount: x.prayedCount + 1 } : x)),
    );
  }

  function openCreate() {
    setEditorMode('create');
    setEditing(null);
    setEditorOpen(true);
  }

  function openEdit(mark: TimelineMark) {
    setEditorMode('edit');
    setEditing(mark);
    setEditorOpen(true);
  }

  async function handleSave(data: TimelineFormData, mediaFile?: File | null) {
    if (!adminEmail) throw new Error('Login admin necessário');
    setSaving(true);
    try {
      let mark: TimelineMark;
      if (editorMode === 'create') {
        mark = await createTimelineMark(data, adminEmail);
      } else if (editing) {
        mark = await updateTimelineMark(editing.id, data, adminEmail);
      } else {
        throw new Error('Marco inválido');
      }
      if (mediaFile) {
        await uploadTimelineMedia(mark.id, mediaFile, adminEmail);
      }
      setEditorOpen(false);
      setEditing(null);
      await loadTimeline();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!adminEmail || !editing) return;
    setSaving(true);
    try {
      await deleteTimelineMark(editing.id, adminEmail);
      setEditorOpen(false);
      setEditing(null);
      await loadTimeline();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="altar-glow">
      <div
        className="altar-bg"
        style={{ backgroundImage: images.prayerKneel }}
        aria-hidden
      />
      <div className="altar-bg-overlay" aria-hidden />

      <header className="page-header anim-fade-up" style={{ position: 'relative', zIndex: 1 }}>
        <div className="left">
          <p className="caption gold-soft">Espaço sagrado</p>
          <h1 className="h2">Altar Virtual</h1>
        </div>
        <div
          className="avatar lg"
          style={{
            backgroundImage: images.prayerKneel,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            border: '2px solid rgba(212,165,116,0.45)',
          }}
        />
      </header>

      <div className="tabs anim-fade-up" style={{ position: 'relative', zIndex: 1, animationDelay: '0.05s' }}>
        <button
          className={`tab${tab === 'oracao' ? ' active' : ''}`}
          onClick={() => setTab('oracao')}
        >
          Pedidos de Oração
        </button>
        <button
          className={`tab${tab === 'missoes' ? ' active' : ''}`}
          onClick={() => setTab('missoes')}
        >
          Missões
        </button>
        <button
          className={`tab${tab === 'trajetoria' ? ' active' : ''}`}
          onClick={() => setTab('trajetoria')}
        >
          Trajetória
        </button>
      </div>

      {tab === 'oracao' && (
        <>
          <div
            className="section anim-fade-up"
            style={{
              animationDelay: '0.1s',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              className="card altar-intro-card"
              style={{
                padding: 18,
                marginBottom: 16,
                minHeight: 88,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <p
                className="gold-soft"
                style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                Comunidade em oração
              </p>
              <p className="h3" style={{ marginTop: 4 }}>
                Deixe seu pedido no altar
              </p>
            </div>

            <form onSubmit={submitPrayer} className="card" style={{ padding: 16 }}>
              <div className="field">
                <label htmlFor="prayer">Seu pedido</label>
                <textarea
                  id="prayer"
                  placeholder="Escreva com fé e confiança..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
                <Sparkles size={16} />
                Enviar pedido
              </button>
            </form>
          </div>

          <section className="section" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-header">
              <h3 className="h3">Pedidos da comunidade</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {prayers.map((p) => (
                <div key={p.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.author}</span>
                    <span className="muted">{p.timeAgo}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.45 }}>
                    {p.text}
                  </p>
                  <button
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      marginTop: 12,
                      minHeight: 40,
                      fontSize: '0.8125rem',
                      borderColor: prayed[p.id] ? 'rgba(212,165,116,0.4)' : undefined,
                      color: prayed[p.id] ? 'var(--accent-gold)' : undefined,
                    }}
                    onClick={() => prayTogether(p.id)}
                  >
                    {prayed[p.id] ? <Check size={16} /> : <Heart size={16} />}
                    {prayed[p.id] ? 'Você orou' : 'Orar junto'} · {p.prayedCount}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === 'missoes' && (
        <section className="section anim-fade-up" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header">
            <h3 className="h3">Desafios espirituais</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {missions.map((m) => {
              const prog = missionProgress[m.id] ?? 0;
              const pct = Math.round((prog / m.days) * 100);
              return (
                <div key={m.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{m.title}</h4>
                      <p className="caption" style={{ marginTop: 4 }}>
                        {m.description}
                      </p>
                    </div>
                    <span
                      className="chip"
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.65rem',
                        background: 'var(--accent-gradient-soft)',
                        color: 'var(--accent-gold)',
                        borderColor: 'rgba(212,165,116,0.25)',
                      }}
                    >
                      {m.seal}
                    </span>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span className="muted">
                        Dia {prog} de {m.days}
                      </span>
                      <span className="muted">{pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {prog < m.days && (
                    <button
                      className="btn btn-ghost"
                      style={{ width: '100%', marginTop: 12, minHeight: 40, fontSize: '0.8125rem' }}
                      onClick={() =>
                        setMissionProgress((prev) => ({
                          ...prev,
                          [m.id]: Math.min(m.days, (prev[m.id] ?? 0) + 1),
                        }))
                      }
                    >
                      Registrar progresso
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === 'trajetoria' && (
        <>
          <section className="section anim-fade-up" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-header">
              <h3 className="h3">Trajetória</h3>
              {isAdmin && (
                <button
                  className="see-all"
                  onClick={openCreate}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={14} /> Novo marco
                </button>
              )}
            </div>
            <p className="caption" style={{ marginBottom: 16, marginTop: -8 }}>
              A jornada de fé e música da Nayara Rosa
            </p>
            {isAdmin && (
              <p className="caption gold-soft" style={{ marginBottom: 14, marginTop: -8 }}>
                Modo admin — edite marcos e mídias
              </p>
            )}

            {timelineLoading && <p className="caption">Carregando trajetória…</p>}
            {timelineError && (
              <p className="caption" style={{ color: '#FF6B8A' }}>
                {timelineError}
              </p>
            )}

            <div className="timeline">
              {marks.map((mark) => (
                <Reveal key={mark.id}>
                  <div className="timeline-item">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 8,
                      }}
                    >
                      <span className="gold-soft" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {mark.year}
                      </span>
                      {isAdmin && (
                        <button
                          className="btn-icon"
                          style={{ width: 32, height: 32, minHeight: 32 }}
                          aria-label="Editar marco"
                          onClick={() => openEdit(mark)}
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                    </div>
                    <h4 className="h3" style={{ marginTop: 4 }}>
                      {mark.title}
                    </h4>
                    <p className="caption" style={{ marginTop: 4 }}>
                      {mark.caption}
                    </p>
                    {mark.mediaType === 'video' && mark.mediaUrl ? (
                      <video
                        className="timeline-photo timeline-video"
                        src={mark.mediaUrl}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : mark.mediaType === 'image' && mark.mediaUrl ? (
                      <div className={`timeline-photo ${timelinePhotoClass(mark)}`}>
                        <img src={mark.mediaUrl} alt={mark.title} loading="lazy" />
                      </div>
                    ) : (
                      <div
                        className={`timeline-photo ${timelinePhotoClass(mark)}`}
                        style={{ backgroundImage: mark.image }}
                        role="img"
                        aria-label={mark.title}
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            {!timelineLoading && !timelineError && marks.length === 0 && (
              <p className="caption" style={{ textAlign: 'center', padding: 20 }}>
                Nenhum marco na trajetória ainda
              </p>
            )}
          </section>

          {isAdmin && (
            <TimelineEditorModal
              open={editorOpen}
              mode={editorMode}
              initial={editing}
              saving={saving}
              onClose={() => {
                setEditorOpen(false);
                setEditing(null);
              }}
              onSave={handleSave}
              onDelete={editorMode === 'edit' ? handleDelete : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}
