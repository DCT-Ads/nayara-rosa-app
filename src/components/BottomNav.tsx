import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, HandHeart, Music } from 'lucide-react';

const tabs = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/altar', label: 'Altar', icon: HandHeart },
  { to: '/player', label: 'Player', icon: Music },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <svg width="0" height="0" aria-hidden>
        <defs>
          <linearGradient id="navAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E91E8C" />
            <stop offset="100%" stopColor="#F5A623" />
          </linearGradient>
        </defs>
      </svg>
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon-wrap">
            <Icon size={22} strokeWidth={1.75} />
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
