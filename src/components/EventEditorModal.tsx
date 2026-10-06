import { useEffect, useId, useState, type FormEvent } from 'react';
import { Bell, BellOff, Trash2, X } from 'lucide-react';
import type { EventItem } from '../data/content';
import type { EventInput } from '../api/events';

const TYPES: { value: EventItem['type']; label: string; color: string }[] = [
  { value: 'show', label: 'Show', color: '#E91E8C' },
  { value: 'live', label: 'Live', color: '#F5A623' },
  { value: 'lancamento', label: 'Lançamento', color: '#7C4DFF' },
];

const emptyForm: EventInput = {
  title: '',
  type: 'show',
  date: '',
  time: '20:00',
  location: '',
  description: '',
  alertEnabled: false,
};

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: EventItem | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (data: EventInput) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

export function EventEditorModal({
  open,
  mode,
  initial,
  saving,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const titleId = useId();
  const [form, setForm] = useState<EventInput>(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    if (initial) {
      setForm({
        title: initial.title,
        type: initial.type,
        date: initial.date,
        time: initial.time,
        location: initial.location,
        description: initial.description,
        alertEnabled: !!initial.alertEnabled,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, initial]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.time || !form.location.trim()) {
      setError('Preencha título, data, hora e local.');
      return;
    }
    try {
      setError('');
      await onSave(form);
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
            {mode === 'create' ? 'Novo evento' : 'Editar evento'}
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="field">
            <label htmlFor="ev-title">Título</label>
            <input
              id="ev-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Nome do evento"
            />
          </div>

          <div className="field">
            <span className="field-label">Tipo</span>
            <div className="chips" style={{ paddingBottom: 0 }}>
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`chip${form.type === t.value ? ' active' : ''}`}
                  style={
                    form.type === t.value
                      ? { background: t.color, boxShadow: `0 4px 14px ${t.color}55` }
                      : undefined
                  }
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="ev-date">Data</label>
              <input
                id="ev-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="ev-time">Hora</label>
              <input
                id="ev-time"
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="ev-location">Local</label>
            <input
              id="ev-location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Cidade, igreja ou plataforma"
            />
          </div>

          <div className="field">
            <label htmlFor="ev-desc">Descrição</label>
            <textarea
              id="ev-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Detalhes do evento"
            />
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: '100%' }}
            onClick={() => setForm((f) => ({ ...f, alertEnabled: !f.alertEnabled }))}
          >
            {form.alertEnabled ? <Bell size={18} color="#E91E8C" /> : <BellOff size={18} />}
            {form.alertEnabled
              ? 'Alerta push 24h ativado'
              : 'Ativar alerta push (24h antes)'}
          </button>

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
                if (!confirm('Excluir este evento?')) return;
                try {
                  await onDelete();
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Erro ao excluir');
                }
              }}
            >
              <Trash2 size={18} />
              Excluir evento
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
