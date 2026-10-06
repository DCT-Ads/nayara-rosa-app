import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Download, MonitorSmartphone, Smartphone, X } from 'lucide-react';
import { LogoMark } from './StatusBar';
import {
  subscribeInstallPrompt,
  type BeforeInstallPromptEvent,
} from '../pwaInstall';

function useAppMode() {
  const [standalone, setStandalone] = useState(false);
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : true,
  );

  useEffect(() => {
    const mqStand = window.matchMedia('(display-mode: standalone)');
    const mqNarrow = window.matchMedia('(max-width: 768px)');
    const iosStandalone =
      'standalone' in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

    const sync = () => {
      setStandalone(mqStand.matches || iosStandalone);
      setNarrow(mqNarrow.matches);
    };
    sync();
    mqStand.addEventListener('change', sync);
    mqNarrow.addEventListener('change', sync);
    return () => {
      mqStand.removeEventListener('change', sync);
      mqNarrow.removeEventListener('change', sync);
    };
  }, []);

  const isApp = standalone || narrow;
  return { standalone, narrow, isApp };
}

export function AppShell({ children }: { children: ReactNode }) {
  const { standalone, isApp } = useAppMode();
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

  const modeLabel = useMemo(() => {
    if (standalone) return 'Modo app instalado';
    if (isApp) return 'Site mobile / app';
    return 'Site desktop';
  }, [standalone, isApp]);

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
    <div className={`app-shell${isApp ? ' app-shell--native' : ' app-shell--site'}`}>
      {!isApp && (
        <aside className="site-panel anim-fade-up">
          <div className="site-brand">
            <LogoMark size={56} />
            <div>
              <p className="caption gold-soft">Oficial · Cantora</p>
              <h1 className="h2">Nayara Rosa</h1>
            </div>
          </div>
          <p className="caption site-copy">
            Site e aplicativo no mesmo lugar: use no navegador ou instale no celular
            como app (ícone na tela inicial).
          </p>
          <ul className="site-points">
            <li>
              <MonitorSmartphone size={16} /> Site completo no desktop
            </li>
            <li>
              <Smartphone size={16} /> App instalável (PWA) no celular
            </li>
          </ul>
          {!standalone && !installedHint && (
            <button
              type="button"
              className="btn btn-primary site-install-btn"
              onClick={handleInstall}
            >
              <Download size={18} />
              Instalar aplicativo
            </button>
          )}
          {installedHint && (
            <p className="caption gold-soft">App instalado com sucesso.</p>
          )}
          <p className="muted" style={{ marginTop: 12 }}>
            {modeLabel}
          </p>
        </aside>
      )}

      <div className={`phone-frame${isApp ? ' phone-frame--native' : ''}`}>{children}</div>

      {isApp && !standalone && !installedHint && (
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
