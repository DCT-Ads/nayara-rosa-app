import { useEffect, useId, useState, type FormEvent, type ChangeEvent } from 'react';
import { Trash2, X, ImagePlus } from 'lucide-react';
import type { TimelineMark } from '../data/content';

export type TimelineFormData = {
  year: string;
  title: string;
  caption: string;
};

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: TimelineMark | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (data: TimelineFormData, mediaFile?: File | null) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

const empty: TimelineFormData = { year: '', title: '', caption: '' };

export function TimelineEditorModal({
  open,
  mode,
  initial,
  saving,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const titleId = useId();
  const [form, setForm] = useState<TimelineFormData>(empty);
  const [error, setError] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<'image' | 'video' | null>(null);

  useEffect(() => {
    if (!open) return;
    setError('');
    setMediaFile(null);
    if (initial) {
      setForm({
        year: initial.year,
        title: initial.title,
        caption: initial.caption,
      });
      if (initial.mediaUrl && initial.mediaType === 'image') {
        setPreview(initial.mediaUrl);
        setPreviewKind('image');
      } else if (initial.mediaUrl && initial.mediaType === 'video') {
        setPreview(initial.mediaUrl);
        setPreviewKind('video');
      } else {
        setPreview(null);
        setPreviewKind(null);
      }
    } else {
      setForm(empty);
      setPreview(null);
      setPreviewKind(null);
    }
  }, [open, initial]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!open) return null;

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setPreview(url);
    setPreviewKind(file.type.startsWith('video/') ? 'video' : 'image');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.year.trim() || !form.title.trim() || !form.caption.trim()) {
      setError('Preencha ano, título e texto.');
      return;
    }
    try {
      setError('');
      await onSave(form, mediaFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  }

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
            {mode === 'create' ? 'Novo marco' : 'Editar marco'}
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="field-row">
            <div className="field">
              <label htmlFor="tl-year">Ano</label>
              <input
                id="tl-year"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                placeholder="2020"
              />
            </div>
            <div className="field">
              <label htmlFor="tl-title">Título</label>
              <input
                id="tl-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Título do marco"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="tl-caption">Texto</label>
            <textarea
              id="tl-caption"
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              placeholder="Descrição emocional do momento"
            />
          </div>

          <div className="field">
            <span className="field-label">Foto ou vídeo</span>
            <label className="media-upload">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={onFileChange}
                hidden
              />
              <ImagePlus size={18} />
              {mediaFile ? mediaFile.name : 'Escolher arquivo'}
            </label>
            {preview && (
              <div className="media-preview">
                {previewKind === 'video' ? (
                  <video src={preview} controls playsInline />
                ) : (
                  <div
                    className="media-preview-img"
                    style={{
                      backgroundImage: preview.startsWith('blob:') || preview.startsWith('/')
                        ? `url('${preview}')`
                        : preview,
                    }}
                  />
                )}
              </div>
            )}
            {!preview && initial?.placeholder && (
              <div
                className="media-preview-img"
                style={{ backgroundImage: initial.placeholder, marginTop: 8 }}
              />
            )}
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
                if (!confirm('Excluir este marco da trajetória?')) return;
                try {
                  await onDelete();
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Erro ao excluir');
                }
              }}
            >
              <Trash2 size={18} />
              Excluir marco
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
