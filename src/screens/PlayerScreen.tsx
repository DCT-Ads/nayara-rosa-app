import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
  Music2,
  Plus,
  Pencil,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Track } from '../data/content';
import {
  createMedia,
  deleteMedia,
  updateMedia,
  uploadMediaCover,
  uploadMediaFile,
} from '../api/media';
import {
  MediaEditorModal,
  type MediaFormData,
} from '../components/MediaEditorModal';

const filters = ['Todas', 'Músicas', 'Vídeos', 'Albums'] as const;

export function PlayerScreen() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    setShowMiniPlayer,
    library,
    isAdmin,
    adminEmail,
    refreshLibrary,
    attachVideoEl,
  } = useApp();
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todas');
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<Track | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void refreshLibrary();
  }, [refreshLibrary]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.4));
    }, 400);
    return () => window.clearInterval(id);
  }, [isPlaying, currentTrack.id]);

  const list = useMemo(() => {
    if (filter === 'Músicas') return library.filter((t) => t.type === 'musica');
    if (filter === 'Vídeos') return library.filter((t) => t.type === 'video');
    if (filter === 'Albums') return library.filter((t) => t.type === 'album');
    return library;
  }, [filter, library]);

  const openCreate = useCallback(() => {
    setEditorMode('create');
    setEditing(null);
    setEditorOpen(true);
  }, []);

  const openEdit = useCallback((track: Track) => {
    setEditorMode('edit');
    setEditing(track);
    setEditorOpen(true);
  }, []);

  async function handleSave(
    data: MediaFormData,
    files?: { media?: File | null; cover?: File | null },
  ) {
    if (!adminEmail) throw new Error('Login admin necessário');
    setSaving(true);
    try {
      let track: Track;
      if (editorMode === 'create') {
        track = await createMedia(data, adminEmail);
      } else if (editing) {
        track = await updateMedia(editing.id, data, adminEmail);
      } else {
        throw new Error('Mídia inválida');
      }
      if (files?.media) {
        track = await uploadMediaFile(track.id, files.media, adminEmail);
      }
      if (files?.cover) {
        track = await uploadMediaCover(track.id, files.cover, adminEmail);
      }
      setEditorOpen(false);
      setEditing(null);
      await refreshLibrary();
      if (files?.media) playTrack(track);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!adminEmail || !editing) return;
    setSaving(true);
    try {
      await deleteMedia(editing.id, adminEmail);
      setEditorOpen(false);
      setEditing(null);
      await refreshLibrary();
    } finally {
      setSaving(false);
    }
  }

  if (expanded) {
    return (
      <div className="player-expanded anim-fade-in">
        <header className="page-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <button
            className="btn-icon"
            onClick={() => {
              setExpanded(false);
              setShowMiniPlayer(true);
            }}
            aria-label="Minimizar"
          >
            <ChevronDown size={22} />
          </button>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p className="muted">Tocando agora</p>
            <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Biblioteca Nayara</p>
          </div>
          <div style={{ width: 40 }} />
        </header>

        {currentTrack.type === 'video' && currentTrack.mediaUrl ? (
          <video
            key={currentTrack.id}
            ref={attachVideoEl}
            className="player-cover"
            controls
            playsInline
            style={{ objectFit: 'cover', background: '#000' }}
          />
        ) : (
          <div className="player-cover" style={{ backgroundImage: currentTrack.cover }} />
        )}

        <h1 className="h1" style={{ fontSize: '1.4rem' }}>
          {currentTrack.title}
        </h1>
        <p className="caption" style={{ marginTop: 4 }}>
          {currentTrack.artist}
          {!currentTrack.mediaUrl?.trim() && (
            <span className="muted"> · arquivo ainda não enviado</span>
          )}
        </p>

        <div className="player-progress">
          <div className="progress-track" style={{ height: 5 }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="player-times">
            <span>{isPlaying ? '▶' : '❚❚'}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        <div className="player-controls">
          <button className="btn-icon" style={{ border: 'none', background: 'transparent' }} onClick={prevTrack}>
            <SkipBack size={26} fill="#fff" />
          </button>
          <button className="btn-play" style={{ width: 64, height: 64 }} onClick={togglePlay}>
            {isPlaying ? (
              <Pause size={28} fill="#fff" />
            ) : (
              <Play size={28} fill="#fff" style={{ marginLeft: 3 }} />
            )}
          </button>
          <button className="btn-icon" style={{ border: 'none', background: 'transparent' }} onClick={nextTrack}>
            <SkipForward size={26} fill="#fff" />
          </button>
        </div>

        <div className="card" style={{ padding: 16, marginTop: 28 }}>
          <p className="muted" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Letra
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', fontStyle: 'italic', whiteSpace: 'pre-line' }}>
            {currentTrack.lyrics?.trim() || (
              <>
                Nas cordas de amor que o céu entoou…
                <br />
                Cada nota um altar, cada verso um sim.
                <br />
                <span className="gold-soft">— trecho ilustrativo</span>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="page-header anim-fade-up">
        <div className="left">
          <p className="caption">Biblioteca</p>
          <h1 className="h2">Player de Mídia</h1>
        </div>
        <div className="actions">
          {isAdmin && (
            <button className="btn-icon accent-fill" onClick={openCreate} aria-label="Adicionar mídia">
              <Plus size={20} color="#fff" />
            </button>
          )}
          <Music2 size={22} color="var(--accent-gold)" strokeWidth={1.75} />
        </div>
      </header>

      {isAdmin ? (
        <p className="caption gold-soft" style={{ padding: '0 20px 10px' }}>
          Modo admin — toque no lápis para editar ou no + para subir música/vídeo
        </p>
      ) : (
        <p className="caption" style={{ padding: '0 20px 10px' }}>
          Toque em <strong>Vídeos</strong> para ver os clipes · escolha um item e dê play
        </p>
      )}

      <div className="chips" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {filters.map((f) => (
          <button
            key={f}
            className={`chip${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {f === 'Vídeos'
              ? ` (${library.filter((t) => t.type === 'video').length})`
              : ''}
          </button>
        ))}
      </div>

      <div className="section anim-fade-up" style={{ animationDelay: '0.08s' }}>
        <button
          className="card"
          style={{
            width: '100%',
            padding: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            textAlign: 'left',
            marginBottom: 16,
            background: 'linear-gradient(135deg, rgba(233,30,140,0.12), rgba(245,166,35,0.08)), var(--card)',
          }}
          onClick={() => {
            setExpanded(true);
            setShowMiniPlayer(false);
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundImage: currentTrack.cover,
              backgroundSize: 'cover',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="muted">Agora</p>
            <p style={{ fontWeight: 700 }}>{currentTrack.title}</p>
            <p className="caption">{currentTrack.artist}</p>
          </div>
          <button
            className="btn-play"
            style={{ width: 44, height: 44, minHeight: 44 }}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            {isPlaying ? <Pause size={18} fill="#fff" /> : <Play size={18} fill="#fff" style={{ marginLeft: 2 }} />}
          </button>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.map((track, i) => {
            const active = track.id === currentTrack.id;
            return (
              <div
                key={track.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 10,
                  width: '100%',
                  borderColor: active ? 'rgba(233,30,140,0.4)' : undefined,
                  animationDelay: `${0.05 * i}s`,
                }}
              >
                <button
                  type="button"
                  onClick={() => playTrack(track)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flex: 1,
                    minWidth: 0,
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      backgroundImage: track.cover,
                      backgroundSize: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: active ? 'transparent' : undefined,
                        backgroundImage: active ? 'var(--accent-gradient)' : undefined,
                        backgroundClip: active ? 'text' : undefined,
                        WebkitBackgroundClip: active ? 'text' : undefined,
                      }}
                    >
                      {track.title}
                    </div>
                    <div className="caption">
                      {track.type === 'video' ? 'Vídeo' : track.type === 'album' ? 'Álbum' : 'Música'} ·{' '}
                      {track.duration}
                      {track.mediaUrl ? '' : ' · sem arquivo'}
                    </div>
                  </div>
                  <span className="muted">{track.plays}</span>
                </button>
                {isAdmin && (
                  <button
                    className="btn-icon"
                    style={{ width: 36, height: 36, minHeight: 36, flexShrink: 0 }}
                    aria-label="Editar mídia"
                    onClick={() => openEdit(track)}
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
            );
          })}
          {!list.length && (
            <p className="caption" style={{ textAlign: 'center', padding: 24 }}>
              Nenhuma mídia nesta categoria
            </p>
          )}
        </div>
      </div>

      {isAdmin && (
        <MediaEditorModal
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
  );
}
