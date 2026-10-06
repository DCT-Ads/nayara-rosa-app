import { useEffect, useId, useState, type FormEvent, type ChangeEvent } from 'react';
import { Trash2, X, ImagePlus, Film, Music } from 'lucide-react';
import type { Track } from '../data/content';

export type MediaFormData = {
  title: string;
  artist: string;
  type: Track['type'];
  duration: string;
  lyrics: string;
};

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: Track | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (
    data: MediaFormData,
    files?: { media?: File | null; cover?: File | null },
  ) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

const empty: MediaFormData = {
  title: '',
  artist: 'Nayara Rosa',
  type: 'musica',
  duration: '0:00',
  lyrics: '',
};

const TYPES: { value: Track['type']; label: string }[] = [
  { value: 'musica', label: 'Música' },
  { value: 'video', label: 'Vídeo' },
  { value: 'album', label: 'Álbum' },
];

export function MediaEditorModal({
  open,
  mode,
  initial,
  saving,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const titleId = useId();
  const [form, setForm] = useState<MediaFormData>(empty);
  const [error, setError] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError('');
    setMediaFile(null);
    setCoverFile(null);
    if (initial) {
      setForm({
        title: initial.title,
        artist: initial.artist,
        type: initial.type,
        duration: initial.duration,
        lyrics: initial.lyrics || '',
      });
      setMediaPreview(initial.mediaUrl || null);
      setCoverPreview(initial.coverUrl || null);
    } else {
      setForm(empty);
      setMediaPreview(null);
      setCoverPreview(null);
    }
  }, [open, initial]);

  useEffect(() => {
    return () => {
      if (mediaPreview?.startsWith('blob:')) URL.revokeObjectURL(mediaPreview);
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    };
  }, [mediaPreview, coverPreview]);

  if (!open) return null;

  function onMediaChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (mediaPreview?.startsWith('blob:')) URL.revokeObjectURL(mediaPreview);
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    if (file.type.startsWith('video/') && form.type === 'musica') {
      setForm((f) => ({ ...f, type: 'video' }));
    }
    if (file.type.startsWith('audio/') && form.type === 'video') {
      setForm((f) => ({ ...f, type: 'musica' }));
    }
  }

  function onCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Informe o título.');
      return;
    }
    if (mode === 'create' && !mediaFile) {
      setError('Envie o arquivo de música ou vídeo.');
      return;
    }
    try {
      setError('');
      await onSave(form, { media: mediaFile, cover: coverFile });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  }

  const acceptMedia =
    form.type === 'video' ? 'video/*' : form.type === 'musica' ? 'audio/*,video/*' : 'audio/*,video/*';

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
            {mode === 'create' ? 'Nova mídia' : 'Editar mídia'}
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="field">
            <span className="field-label">Tipo</span>
            <div className="chips" style={{ paddingBottom: 0 }}>
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`chip${form.type === t.value ? ' active' : ''}`}
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="md-title">Título</label>
            <input
              id="md-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Nome da música ou vídeo"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="md-artist">Artista</label>
              <input
                id="md-artist"
                value={form.artist}
                onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="md-duration">Duração</label>
              <input
                id="md-duration"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="3:42"
              />
            </div>
          </div>

          <div className="field">
            <span className="field-label">Arquivo (áudio ou vídeo)</span>
            <label className="media-upload">
              <input type="file" accept={acceptMedia} onChange={onMediaChange} hidden />
              {form.type === 'video' ? <Film size={18} /> : <Music size={18} />}
              {mediaFile ? mediaFile.name : 'Escolher música / vídeo'}
            </label>
            {mediaPreview && form.type === 'video' && (
              <video
                src={mediaPreview}
                controls
                playsInline
                style={{
                  width: '100%',
                  marginTop: 10,
                  borderRadius: 12,
                  maxHeight: 160,
                  background: '#000',
                }}
              />
            )}
            {mediaPreview && form.type !== 'video' && mediaFile?.type.startsWith('audio/') && (
              <audio src={mediaPreview} controls style={{ width: '100%', marginTop: 10 }} />
            )}
            {initial?.mediaUrl && !mediaFile && (
              <p className="muted" style={{ marginTop: 6 }}>
                Arquivo atual: {initial.mediaUrl.split('/').pop()}
              </p>
            )}
          </div>

          <div className="field">
            <span className="field-label">Capa (opcional)</span>
            <label className="media-upload">
              <input type="file" accept="image/*" onChange={onCoverChange} hidden />
              <ImagePlus size={18} />
              {coverFile ? coverFile.name : 'Escolher capa'}
            </label>
            {coverPreview && (
              <div
                className="media-preview-img"
                style={{
                  marginTop: 10,
                  backgroundImage: `url('${coverPreview}')`,
                }}
              />
            )}
          </div>

          <div className="field">
            <label htmlFor="md-lyrics">Letra (opcional)</label>
            <textarea
              id="md-lyrics"
              value={form.lyrics}
              onChange={(e) => setForm((f) => ({ ...f, lyrics: e.target.value }))}
              placeholder="Trecho da letra..."
            />
          </div>

          {error && (
            <p className="caption" style={{ color: '#FF6B8A', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </button>

          {mode === 'edit' && onDelete && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', color: '#FF6B8A', borderColor: 'rgba(255,107,138,0.35)' }}
              disabled={saving}
              onClick={async () => {
                if (!confirm('Excluir esta mídia?')) return;
                try {
                  await onDelete();
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Erro ao excluir');
                }
              }}
            >
              <Trash2 size={18} />
              Excluir
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
