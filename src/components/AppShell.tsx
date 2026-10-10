import { useEffect, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Download, HandHeart, Home, Music, X } from 'lucide-react';
import { LogoMark } from './StatusBar';
import {
  subscribeInstallPrompt,
  type BeforeInstallPromptEvent,
} from '../pwaInstall';

const desktopNav = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/altar', label: 'Altar', icon: HandHeart },
  { to: '/player', label: 'Player', icon: Music },
] as const;

function useAppMode() {
  const [standalone, setStandalone] = useState(false);
  const [desktop, setDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false,
  );

  useEffect(() => {
    const mqStand = window.matchMedia('(display-mode: standalone)');
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    const iosStandalone =
      'standalone' in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

    const sync = () => {
      setStandalone(mqStand.matches || iosStandalone);
      setDesktop(mqDesktop.matches);
    };
    sync();
    mqStand.addEventListener('change', sync);
    mqDesktop.addEventListener('change', sync);
    return () => {
      mqStand.removeEventListener('change', sync);
      mqDesktop.removeEventListener('change', sync);
    };
  }, []);

  return { standalone, desktop };
}

export function AppShell({ children }: { children: ReactNode }) {
  const { standalone, desktop } = useAppMode();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installedHint, setInstalledHint] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    return subscribeInstallPrompt((e) => {
      setInstallEvent(e);
    });
  }, []);

  useEffect(() => {
    const onInstalled = () => {
      setInstallEvent(null);
      setInstalledHint(true);
      setHelpOpen(false);
    };
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  async function handleInstall() {
    if (installEvent) {
      try {
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallEvent(null);
          setInstalledHint(true);
        }
      } catch {
        setHelpOpen(true);
      }
      return;
    }
    setHelpOpen(true);
  }

  return (
    <div className={`app-shell${desktop ? ' app-shell--desktop' : ' app-shell--native'}`}>
      {desktop && (
        <header className="desktop-nav">
          <NavLink to="/home" className="desktop-brand">
            <LogoMark size={40} />
            <span>
              <strong>Nayara Rosa</strong>
              <em>Música · Fé · Missão</em>
            </span>
          </NavLink>
          <nav className="desktop-links" aria-label="Navegação principal">
            {desktopNav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `desktop-link${isActive ? ' active' : ''}`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </NavLink>
            ))}
          </nav>
          {!standalone && !installedHint && (
            <button type="button" className="btn btn-primary desktop-install" onClick={handleInstall}>
              <Download size={16} />
              Instalar
            </button>
          )}
        </header>
      )}

      <div className={`phone-frame${desktop ? '' : ' phone-frame--native'}`}>{children}</div>

      {!desktop && !standalone && !installedHint && (
        <button type="button" className="install-fab" onClick={handleInstall}>
          <Download size={16} />
          Instalar app
        </button>
      )}

      {helpOpen && (
        <div className="install-modal-backdrop" role="presentation" onClick={() => setHelpOpen(false)}>
          <div
            className="install-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-help-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-icon install-modal-close"
              aria-label="Fechar"
              onClick={() => setHelpOpen(false)}
            >
              <X size={18} />
            </button>
            <h2 id="install-help-title" className="h3">
              Instalar o app
            </h2>
            <p className="caption" style={{ marginTop: 10, lineHeight: 1.5 }}>
              No celular (Chrome/Safari): abra o menu do navegador →{' '}
              <strong>&quot;Adicionar à tela inicial&quot;</strong> ou{' '}
              <strong>&quot;Instalar app&quot;</strong>.
            </p>
            <p className="caption" style={{ marginTop: 10, lineHeight: 1.5 }}>
              No computador (Chrome/Edge): use o ícone de instalação na barra de
              endereço, ou o menu ⋮ → Instalar Nayara Rosa.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 18 }}
              onClick={() => setHelpOpen(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
