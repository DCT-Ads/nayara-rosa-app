import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Music, CalendarDays, HandHeart, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { NotificationItem } from '../data/content';

function iconFor(type: NotificationItem['type']) {
  if (type === 'evento') return CalendarDays;
  if (type === 'musica') return Music;
  if (type === 'oracao') return HandHeart;
  return Settings;
}

export function NotificationsScreen() {
  const { notifications, markAllRead, unreadCount } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <header className="page-header anim-fade-up">
        <button className="btn-icon" onClick={() => navigate(-1)} aria-label="Voltar">
          <ChevronLeft size={22} />
        </button>
        <div className="left" style={{ flex: 1 }}>
          <h1 className="h2">Notificações</h1>
          <p className="caption">
            {unreadCount > 0 ? `${unreadCount} não lidas` : 'Tudo em dia'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-text" onClick={markAllRead}>
            Marcar lidas
          </button>
        )}
      </header>

      <div className="section anim-fade-up">
        <div
          className="card"
          style={{
            padding: 14,
            marginBottom: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            background: 'var(--accent-gradient-soft)',
            borderColor: 'rgba(233,30,140,0.25)',
          }}
        >
          <Bell size={20} color="#F5A623" />
          <p className="caption" style={{ color: 'var(--text-secondary)' }}>
            Alertas de eventos são enviados automaticamente <strong style={{ color: '#fff' }}>24h antes</strong>.
          </p>
        </div>

        {notifications.map((n) => {
          const Icon = iconFor(n.type);
          return (
            <div key={n.id} className={`notif-item${!n.read ? ' unread' : ''}`}>
              <div className="notif-icon">
                <Icon size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{n.title}</span>
                  <span className="muted">{n.time}</span>
                </div>
                <p className="caption" style={{ marginTop: 4 }}>
                  {n.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
