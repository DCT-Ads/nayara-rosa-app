import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { images } from '../data/content';

const banners = [
  {
    title: 'Cordas de Amor',
    subtitle: 'Novo single · Avance Music',
    bg: images.cordasDeAmor,
    tag: 'Lançamento',
    overlay: 'bottom' as const,
  },
  {
    title: '@nayararosaof',
    subtitle: 'Capa oficial do single',
    bg: images.cordasAlt,
    tag: 'Destaque',
    overlay: 'bottom' as const,
  },
  {
    title: 'Agenda Aberta',
    subtitle: 'Reserve seu show',
    bg: images.agendaNeon,
    tag: 'Shows',
    overlay: 'top' as const,
  },
];

export function HomeScreen() {
  const { userName, unreadCount, playTrack, library } = useApp();
  const navigate = useNavigate();
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, []);

  const banner = banners[bannerIdx];
  const hot = library.filter((t) => t.type === 'musica').slice(0, 4);

  return (
    <>
      <header className="page-header anim-fade-up">
        <div className="left">
          <p className="caption">Bem-vindo(a) à</p>
          <h1 className="h2">Nayara Rosa</h1>
        </div>
        <div className="actions">
          <button
            className="btn-icon relative"
            aria-label="Notificações"
            onClick={() => navigate('/notifications')}
          >
            <Bell size={20} strokeWidth={1.75} />
            {unreadCount > 0 && <span className="badge-dot" />}
          </button>
          <div
            className="avatar"
            title="Nayara Rosa"
            style={{
              backgroundImage: images.avatar,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              color: 'transparent',
            }}
            aria-label="Nayara Rosa"
          />
        </div>
      </header>

      <div className="search-bar anim-fade-up" style={{ animationDelay: '0.05s' }}>
        <Search size={18} strokeWidth={1.75} />
        <input placeholder="Buscar músicas, eventos..." aria-label="Buscar" />
      </div>

      <div className="banner-wrap anim-fade-up" style={{ animationDelay: '0.1s' }}>
        <div
          className="banner"
          style={{
            backgroundImage: banner.bg,
            backgroundPosition: banner.overlay === 'top' ? 'center 62%' : 'center',
          }}
        >
          <div
            className={`banner-overlay${banner.overlay === 'top' ? ' banner-overlay--top' : ''}`}
          />
          <div
            className={`banner-content${banner.overlay === 'top' ? ' banner-content--top' : ''}`}
          >
            <span
              className="chip active"
              style={{ alignSelf: 'flex-start', marginBottom: 10, padding: '4px 12px', fontSize: '0.7rem' }}
            >
              {banner.tag}
            </span>
            <h2 className="h2">{banner.title}</h2>
            <p className="caption">{banner.subtitle}</p>
          </div>
        </div>
        <div className="banner-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={i === bannerIdx ? 'active' : ''}
              onClick={() => setBannerIdx(i)}
              role="button"
              tabIndex={0}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <section className="section" style={{ paddingBottom: 8 }}>
        <div className="section-header">
          <h3 className="h3">Lançamentos</h3>
          <button className="see-all" onClick={() => navigate('/player')}>
            Ver tudo
          </button>
        </div>
      </section>

      <div className="carousel">
        {library.slice(0, 4).map((track, i) => (
          <button
            key={track.id}
            className="card-media anim-fade-up"
            style={{
              width: 148,
              height: 180,
              textAlign: 'left',
              animationDelay: `${0.12 + i * 0.06}s`,
            }}
            onClick={() => playTrack(track)}
          >
            <div className="card-media-bg" style={{ backgroundImage: track.cover }} />
            <div className="card-media-overlay" />
            <div className="card-media-content">
              <span className="h3" style={{ fontSize: '0.9rem' }}>
                {track.title}
              </span>
              <span className="caption">{track.type === 'video' ? 'Vídeo' : 'Música'}</span>
            </div>
          </button>
        ))}
      </div>

      <section className="section" style={{ marginTop: 20 }}>
        <div className="section-header">
          <h3 className="h3">Músicas em Alta</h3>
          <button className="see-all" onClick={() => navigate('/player')}>
            Ver tudo
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hot.map((track, i) => (
            <button
              key={track.id}
              className="card anim-fade-up"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 10,
                textAlign: 'left',
                width: '100%',
                animationDelay: `${0.2 + i * 0.05}s`,
              }}
              onClick={() => playTrack(track)}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  backgroundImage: track.cover,
                  backgroundSize: 'cover',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{track.title}</div>
                <div className="caption">
                  {track.plays} plays · {track.duration}
                </div>
              </div>
              <span className="btn-play" style={{ width: 36, height: 36, minHeight: 36 }}>
                <Play size={14} fill="#fff" style={{ marginLeft: 1 }} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
