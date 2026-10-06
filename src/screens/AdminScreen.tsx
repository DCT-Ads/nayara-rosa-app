import { useNavigate } from 'react-router-dom';
import {
  Users,
  Music,
  HandHeart,
  CalendarDays,
  Bell,
  Download,
  Plus,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const metrics = [
  { label: 'Usuários ativos', value: '2.847', icon: Users, delta: '+12%' },
  { label: 'Downloads', value: '18.4k', icon: Music, delta: '+8%' },
  { label: 'Pedidos oração', value: '426', icon: HandHeart, delta: '+23%' },
  { label: 'Engaj. eventos', value: '71%', icon: CalendarDays, delta: '+5%' },
];

const bars = [42, 68, 55, 80, 72, 90, 64];
const openRate = [38, 45, 52, 48, 61, 58, 67];

const tableRows = [
  { item: 'Cordas de Amor', tipo: 'Música', metric: '12.4k plays', status: 'Ativo' },
  { item: 'Show Cascavel', tipo: 'Evento', metric: '340 RSVPs', status: 'Agendado' },
  { item: 'Ore 7 dias', tipo: 'Missão', metric: '891 ativos', status: 'Ativo' },
  { item: 'Live Instagram', tipo: 'Evento', metric: '1.2k alertas', status: 'Agendado' },
];

export function AdminScreen() {
  const { logout, userName, isAdmin } = useApp();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="section" style={{ paddingTop: 40 }}>
        <h1 className="h2">Acesso restrito</h1>
        <p className="caption" style={{ marginTop: 8 }}>
          Faça login com e-mail admin para o painel.
        </p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/home')}>
          Voltar ao app
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="page-header anim-fade-up">
        <button className="btn-icon" onClick={() => navigate('/home')} aria-label="Voltar">
          <ChevronLeft size={22} />
        </button>
        <div className="left" style={{ flex: 1 }}>
          <p className="caption">Painel Administrativo</p>
          <h1 className="h2">Dashboard</h1>
        </div>
        <button
          className="btn-icon"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          aria-label="Sair"
        >
          <LogOut size={18} />
        </button>
      </header>

      <div className="section anim-fade-up">
        <p className="caption" style={{ marginBottom: 14 }}>
          Olá, {userName} · visão geral
        </p>

        <div className="admin-grid">
          {metrics.map((m) => (
            <div key={m.label} className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <m.icon size={16} color="var(--accent-gold)" strokeWidth={1.75} />
                <span className="muted" style={{ color: '#6FCF97' }}>
                  {m.delta}
                </span>
              </div>
              <div className="value accent-text">{m.value}</div>
              <p className="muted" style={{ marginTop: 4 }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <section className="section anim-fade-up" style={{ animationDelay: '0.08s' }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="h3">Engajamento semanal</h3>
            <span className="muted">plays</span>
          </div>
          <div className="chart-bars">
            {bars.map((h, i) => (
              <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
              <span key={i} className="muted" style={{ flex: 1, textAlign: 'center' }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section anim-fade-up" style={{ animationDelay: '0.12s' }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Bell size={16} color="var(--accent-pink)" />
            <h3 className="h3">Taxa de abertura</h3>
          </div>
          <p className="caption">Push notifications · últimos 7 dias</p>
          <div className="chart-bars" style={{ height: 56 }}>
            {openRate.map((h, i) => (
              <span
                key={i}
                style={{
                  height: `${h}%`,
                  opacity: 0.7,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
          <p className="h2 accent-text" style={{ marginTop: 8, fontSize: '1.5rem' }}>
            64%
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h3 className="h3">Conteúdo</h3>
          <button className="see-all" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Download size={14} /> Exportar
          </button>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.7fr 0.9fr 0.7fr',
              gap: 4,
              padding: '10px 12px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {['Item', 'Tipo', 'Métrica', 'Status'].map((h) => (
              <span key={h} className="muted" style={{ fontWeight: 600 }}>
                {h}
              </span>
            ))}
          </div>
          {tableRows.map((row) => (
            <div
              key={row.item}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 0.7fr 0.9fr 0.7fr',
                gap: 4,
                padding: '12px',
                borderBottom: '1px solid var(--border)',
                fontSize: '0.75rem',
              }}
            >
              <span style={{ fontWeight: 600 }}>{row.item}</span>
              <span className="caption">{row.tipo}</span>
              <span className="caption">{row.metric}</span>
              <span className="gold-soft">{row.status}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          {['Adicionar evento', 'Adicionar música', 'Adicionar missão'].map((label) => (
            <button key={label} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Plus size={18} />
              {label}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
