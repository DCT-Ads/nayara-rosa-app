import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Music2, Pause, Play, Pencil, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  fetchAmbient,
  updateAmbient,
  uploadAmbientFile,
  type AmbientId,
  type AmbientTrack,
} from '../api/ambient';

const VOLUME = 0.42;

const DEFAULTS: AmbientTrack[] = [
  {
    id: 'prayer',
    title: 'Momento de Oração',
    artist: 'Nayara Rosa',
    mediaUrl: '',
    label: 'Fundo Musical para Oração',
  },
  {
    id: 'devotion',
    title: 'Momento Devocional',
    artist: 'Nayara Rosa',
    mediaUrl: '',
    label: 'Fundo Musical para Devocional',
  },
];

function AmbientEditModal({
  track,
  open,
  saving,
  onClose,
  onSave,
}: {
  track: AmbientTrack;
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (data: { title: string; artist: string }, file?: File | null) => Promise<void>;
}) {
  const titleId = useId();
  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(track.title);
    setArtist(track.artist);
    setFile(null);
    setError('');
  }, [open, track]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-sheet anim-fade-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId} className="h3">
            Editar · {track.label}
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <form
          className="modal-body"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) {
              setError('Informe o título.');
              return;
            }
            void onSave({ title: title.trim(), artist: artist.trim() || 'Nayara Rosa' }, file).catch(
              (err) => setError(err instanceof Error ? err.message : 'Erro ao salvar'),
            );
          }}
        >
          <div className="field">
            <label htmlFor="amb-title">Título da faixa</label>
            <input id="amb-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="amb-artist">Artista / instrumental</label>
            <input id="amb-artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
          </div>
          <div className="field">
            <span className="field-label">Arquivo de áudio</span>
            <label className="media-upload">
              <input
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Music2 size={18} />
              {file ? file.name : track.mediaUrl ? 'Trocar áudio' : 'Enviar instrumental'}
            </label>
            {track.mediaUrl && !file && (
              <p className="muted" style={{ marginTop: 6 }}>
                Atual: {track.mediaUrl.split('/').pop()}
              </p>
            )}
          </div>
          {error && (
            <p className="caption" style={{ color: '#FF6B8A' }}>
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AmbientCard({
  track,
  playing,
  onToggle,
  isAdmin,
  onEdit,
}: {
  track: AmbientTrack;
  playing: boolean;
  onToggle: () => void;
  isAdmin: boolean;
  onEdit: () => void;
}) {
  const hasFile = Boolean(track.mediaUrl?.trim());
  return (
    <div className="card" style={{ padding: 12 }}>
      <p
        className="muted"
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: 8,
          paddingLeft: 2,
        }}
      >
        {track.label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(145deg, rgba(233,30,140,0.25), rgba(245,166,35,0.2))',
            border: '1px solid rgba(233,30,140,0.25)',
          }}
        >
          <Music2 size={22} color="var(--accent-gold)" strokeWidth={1.75} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{track.title}</p>
          <p className="caption">
            {track.artist}
            {!hasFile ? ' · áudio não enviado' : playing ? ' · em loop' : ''}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="btn-icon"
            style={{ width: 36, height: 36, minHeight: 36, flexShrink: 0 }}
            aria-label="Editar fundo"
            onClick={onEdit}
          >
            <Pencil size={14} />
          </button>
        )}
        <button
          type="button"
          className="btn-play"
          style={{ width: 44, height: 44, minHeight: 44, flexShrink: 0, opacity: hasFile ? 1 : 0.45 }}
          aria-label={playing ? 'Pausar' : 'Tocar'}
          disabled={!hasFile}
          onClick={onToggle}
        >
          {playing ? (
            <Pause size={18} fill="#fff" />
          ) : (
            <Play size={18} fill="#fff" style={{ marginLeft: 2 }} />
          )}
        </button>
      </div>
    </div>
  );
}

export function DevotionalAmbientPlayers() {
  const { isAdmin, adminEmail, isPlaying, pauseMainPlayback } = useApp();
  const [tracks, setTracks] = useState<AmbientTrack[]>(DEFAULTS);
  const [activeId, setActiveId] = useState<AmbientId | null>(null);
  const [editing, setEditing] = useState<AmbientTrack | null>(null);
  const [saving, setSaving] = useState(false);
  const audioMap = useRef<Partial<Record<AmbientId, HTMLAudioElement>>>({});

  const load = useCallback(async () => {
    try {
      const data = await fetchAmbient();
      if (data.length) setTracks(data);
    } catch {
      /* mantém defaults */
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Garante elementos de áudio
  useEffect(() => {
    for (const id of ['prayer', 'devotion'] as AmbientId[]) {
      if (!audioMap.current[id]) {
        const a = new Audio();
        a.loop = true;
        a.preload = 'metadata';
        a.volume = VOLUME;
        audioMap.current[id] = a;
      }
    }
    return () => {
      for (const a of Object.values(audioMap.current)) {
        a?.pause();
      }
    };
  }, []);

  // Atualiza src quando tracks mudam
  useEffect(() => {
    for (const t of tracks) {
      const a = audioMap.current[t.id];
      if (!a) continue;
      const next = t.mediaUrl?.trim() || '';
      if (!next) {
        a.pause();
        a.removeAttribute('src');
        continue;
      }
      const abs = new URL(next, window.location.origin).href;
      if (a.src !== abs) {
        a.src = next;
        a.load();
      }
    }
  }, [tracks]);

  // Se o player principal começar a tocar, pausa os fundos
  useEffect(() => {
    if (!isPlaying) return;
    for (const a of Object.values(audioMap.current)) a?.pause();
    setActiveId(null);
  }, [isPlaying]);

  const stopAllAmbient = useCallback(() => {
    for (const a of Object.values(audioMap.current)) a?.pause();
    setActiveId(null);
  }, []);

  const toggle = useCallback(
    (id: AmbientId) => {
      const track = tracks.find((t) => t.id === id);
      const audio = audioMap.current[id];
      if (!track?.mediaUrl?.trim() || !audio) return;

      if (activeId === id) {
        audio.pause();
        setActiveId(null);
        return;
      }

      pauseMainPlayback();
      for (const [otherId, a] of Object.entries(audioMap.current)) {
        if (otherId !== id) a?.pause();
      }
      audio.volume = VOLUME;
      void audio.play().then(() => setActiveId(id)).catch(() => setActiveId(null));
    },
    [tracks, activeId, pauseMainPlayback],
  );

  async function handleSave(data: { title: string; artist: string }, file?: File | null) {
    if (!adminEmail || !editing) return;
    setSaving(true);
    try {
      let updated = await updateAmbient(editing.id, data, adminEmail);
      if (file) {
        updated = await uploadAmbientFile(editing.id, file, adminEmail);
      }
      setTracks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditing(null);
      // Se estava tocando este, reinicia com novo src
      if (activeId === updated.id) {
        stopAllAmbient();
      }
    } finally {
      setSaving(false);
    }
  }

  const ordered = [
    tracks.find((t) => t.id === 'prayer') || DEFAULTS[0],
    tracks.find((t) => t.id === 'devotion') || DEFAULTS[1],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
      <div className="section-header" style={{ marginBottom: 0 }}>
        <h3 className="h3" style={{ fontSize: '1rem' }}>
          Fundos musicais
        </h3>
      </div>
      <p className="caption" style={{ marginTop: -4, marginBottom: 2 }}>
        Instrumentais em loop para oração e devocional
      </p>
      {ordered.map((track) => (
        <AmbientCard
          key={track.id}
          track={track}
          playing={activeId === track.id}
          onToggle={() => toggle(track.id)}
          isAdmin={isAdmin}
          onEdit={() => setEditing(track)}
        />
      ))}
      {editing && (
        <AmbientEditModal
          track={editing}
          open={Boolean(editing)}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
