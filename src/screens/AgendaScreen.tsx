import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  BellOff,
  MapPin,
  Clock,
  CalendarPlus,
  Phone,
  Plus,
} from 'lucide-react';
import {
  CONTACT_PHONE,
  CONTACT_PHONE_RAW,
  images,
  type EventItem,
} from '../data/content';
import { useApp } from '../context/AppContext';
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  toggleEventAlert,
  updateEvent,
  type EventInput,
} from '../api/events';
import { EventEditorModal } from '../components/EventEditorModal';

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const DOW = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function typeClass(type: EventItem['type']) {
  if (type === 'show') return 'dot-show';
  if (type === 'live') return 'dot-live';
  return 'dot-lancamento';
}

function typeLabel(type: EventItem['type']) {
  if (type === 'show') return 'Show';
  if (type === 'live') return 'Live';
  return 'Lançamento';
}

function typeColor(type: EventItem['type']) {
  if (type === 'show') return '#E91E8C';
  if (type === 'live') return '#F5A623';
  return '#7C4DFF';
}

export function AgendaScreen() {
  const navigate = useNavigate();
  const { isAdmin, adminEmail } = useApp();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [saving, setSaving] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      setLoadError('');
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Falha ao carregar agenda');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = new Date(year, month, 1).getDay();

  const eventsByDay = useMemo(() => {
    const map: Record<number, EventItem[]> = {};
    events.forEach((e) => {
      const [y, m, d] = e.date.split('-').map(Number);
      if (y === year && m - 1 === month) {
        map[d] = map[d] ? [...map[d], e] : [e];
      }
    });
    return map;
  }, [events, month, year]);

  const upcoming = useMemo(() => {
    const now = new Date();
    const todayStr = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
    return events.filter((e) => e.date >= todayStr);
  }, [events]);

  const dayEvents = selected ? eventsByDay[Number(selected)] || [] : [];
  const listEvents = selected ? dayEvents : upcoming;

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
    setSelected(null);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    setSelected(null);
  }

  function openCreate() {
    setEditorMode('create');
    setEditing(null);
    setEditorOpen(true);
  }

  function openEdit(ev: EventItem) {
    if (!isAdmin) {
      setDetail(ev);
      return;
    }
    setEditorMode('edit');
    setEditing(ev);
    setEditorOpen(true);
  }

  async function handleSave(data: EventInput) {
    if (!adminEmail) throw new Error('Login admin necessário');
    setSaving(true);
    try {
      if (editorMode === 'create') {
        await createEvent(data, adminEmail);
      } else if (editing) {
        const updated = await updateEvent(editing.id, data, adminEmail);
        if (detail?.id === updated.id) setDetail(updated);
      }
      setEditorOpen(false);
      setEditing(null);
      await loadEvents();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!adminEmail || !editing) return;
    setSaving(true);
    try {
      await deleteEvent(editing.id, adminEmail);
      if (detail?.id === editing.id) setDetail(null);
      setEditorOpen(false);
      setEditing(null);
      await loadEvents();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleAlert(ev: EventItem) {
    if (!isAdmin || !adminEmail) return;
    const updated = await toggleEventAlert(ev.id, !ev.alertEnabled, adminEmail);
    setEvents((list) => list.map((e) => (e.id === updated.id ? updated : e)));
    if (detail?.id === updated.id) setDetail(updated);
  }

  if (detail && !isAdmin) {
    return (
      <div className="anim-fade-in">
        <header className="page-header">
          <button className="btn-icon" onClick={() => setDetail(null)} aria-label="Voltar">
            <ChevronLeft size={22} />
          </button>
          <h1 className="h2" style={{ flex: 1, textAlign: 'center' }}>
            Detalhes
          </h1>
          <div style={{ width: 40 }} />
        </header>

        <div className="section">
          <div className="card" style={{ padding: 20 }}>
            <span
              className="chip active"
              style={{
                display: 'inline-flex',
                marginBottom: 12,
                padding: '4px 12px',
                fontSize: '0.7rem',
                background: typeColor(detail.type),
                boxShadow: 'none',
              }}
            >
              {typeLabel(detail.type)}
            </span>
            <h2 className="h1" style={{ fontSize: '1.4rem' }}>
              {detail.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <p className="caption" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} /> {detail.date.split('-').reverse().join('/')} · {detail.time}
              </p>
              <p className="caption" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} /> {detail.location}
              </p>
            </div>
            <p style={{ marginTop: 16, color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.9rem' }}>
              {detail.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
              <div className="btn btn-ghost" style={{ width: '100%', cursor: 'default' }}>
                {detail.alertEnabled ? <Bell size={18} color="#E91E8C" /> : <BellOff size={18} />}
                {detail.alertEnabled
                  ? 'Alerta push 24h ativo'
                  : 'Alerta push não ativado'}
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                <CalendarPlus size={18} />
                Adicionar ao meu calendário
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="page-header anim-fade-up">
        <div className="left">
          <p className="caption">Calendário</p>
          <h1 className="h2">Agenda Geral</h1>
        </div>
        <div className="actions">
          {isAdmin && (
            <button className="btn-icon accent-fill" onClick={openCreate} aria-label="Adicionar evento">
              <Plus size={20} color="#fff" />
            </button>
          )}
          <button className="btn-icon relative" onClick={() => navigate('/notifications')}>
            <Bell size={20} />
          </button>
        </div>
      </header>

      {isAdmin && (
        <p className="caption gold-soft" style={{ padding: '0 20px 12px' }}>
          Modo admin — toque em um evento para editar
        </p>
      )}

      <div className="section anim-fade-up" style={{ animationDelay: '0.05s' }}>
        <div
          className="contact-banner"
          style={{ backgroundImage: images.agendaNeon, backgroundSize: 'cover', marginBottom: 20 }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(10,6,16,0.3), rgba(10,6,16,0.9))',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              className="caption"
              style={{ letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-pink)' }}
            >
              Agenda Aberta
            </p>
            <p className="h3" style={{ marginTop: 4 }}>
              Contrate seu show
            </p>
            <a
              className="phone accent-text"
              href={`https://wa.me/${CONTACT_PHONE_RAW}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Phone size={18} color="#F5A623" />
              {CONTACT_PHONE}
            </a>
          </div>
        </div>

        <div
          className="calendar"
          style={{ backgroundImage: images.calendarStage }}
        >
          <div className="calendar-overlay" aria-hidden />
          <div className="calendar-inner">
          <div className="cal-nav">
            <button className="btn-icon" onClick={prevMonth} aria-label="Mês anterior">
              <ChevronLeft size={20} />
            </button>
            <h3 className="h3">
              {MONTHS[month]} {year}
            </h3>
            <button className="btn-icon" onClick={nextMonth} aria-label="Próximo mês">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="cal-grid">
            {DOW.map((d, i) => (
              <div key={`${d}-${i}`} className="cal-dow">
                {d}
              </div>
            ))}
            {Array.from({ length: startDow }).map((_, i) => (
              <div key={`e-${i}`} className="cal-day empty" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              const dayEv = eventsByDay[day] || [];
              const isSelected = selected === String(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelected(String(day))}
                >
                  {day}
                  {dayEv.length > 0 && (
                    <span className="indicators">
                      {dayEv.slice(0, 3).map((ev) => (
                        <i key={ev.id} className={typeClass(ev.type)} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <span className="muted" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.75)' }}>
              <i
                className="dot-show"
                style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }}
              />{' '}
              Show
            </span>
            <span className="muted" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.75)' }}>
              <i
                className="dot-live"
                style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }}
              />{' '}
              Live
            </span>
            <span className="muted" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.75)' }}>
              <i
                className="dot-lancamento"
                style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }}
              />{' '}
              Lançamento
            </span>
          </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <h3 className="h3">
            {selected ? `Eventos · dia ${selected}` : 'Próximos eventos'}
          </h3>
          {isAdmin && (
            <button className="see-all" onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Plus size={14} /> Novo
            </button>
          )}
        </div>

        {loading && <p className="caption">Carregando agenda…</p>}
        {loadError && (
          <p className="caption" style={{ color: '#FF6B8A' }}>
            {loadError}. Confira se a API está rodando (`npm run dev`).
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {listEvents.map((ev) => (
            <button
              key={ev.id}
              className="card"
              style={{
                padding: 14,
                textAlign: 'left',
                width: '100%',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
              onClick={() => openEdit(ev)}
            >
              <div
                style={{
                  width: 4,
                  alignSelf: 'stretch',
                  borderRadius: 4,
                  background: typeColor(ev.type),
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ev.title}</div>
                <p className="caption" style={{ marginTop: 4 }}>
                  {ev.date.split('-').reverse().join('/')} · {ev.time} · {ev.location}
                </p>
              </div>
              <button
                className="btn-icon"
                style={{ width: 36, height: 36, minHeight: 36 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isAdmin) void handleToggleAlert(ev);
                }}
                aria-label="Alerta"
                disabled={!isAdmin}
              >
                {ev.alertEnabled ? (
                  <Bell size={16} color="#E91E8C" />
                ) : (
                  <BellOff size={16} />
                )}
              </button>
            </button>
          ))}
          {!loading && !loadError && listEvents.length === 0 && (
            <p className="caption" style={{ textAlign: 'center', padding: 20 }}>
              {selected ? 'Nenhum evento neste dia' : 'Nenhum evento próximo'}
            </p>
          )}
        </div>
      </section>

      {isAdmin && (
        <EventEditorModal
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
