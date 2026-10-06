import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Download, MonitorSmartphone, Smartphone } from 'lucide-react';
import { LogoMark } from './StatusBar';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function useAppMode() {
  const [standalone, setStandalone] = useState(false);
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : true,
  );

  useEffect(() => {
    const mqStand = window.matchMedia('(display-mode: standalone)');
    const mqNarrow = window.matchMedia('(max-width: 768px)');
    const iosStandalone = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

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
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setShowInstallHelp(false);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setInstalledHint(true);
      setShowInstallHelp(false);
    };
    window.addEventListener('beforeinstallprompt', onBip);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const modeLabel = useMemo(() => {
    if (standalone) return 'Modo app instalado';
    if (isApp) return 'Site mobile / app';
    return 'Site desktop';
  }, [standalone, isApp]);

  async function handleInstall() {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'accepted') setInstallEvent(null);
      return;
    }
    setShowInstallHelp(true);
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
            <button type="button" className="btn btn-primary" onClick={handleInstall}>
              <Download size={18} />
              Instalar aplicativo
            </button>
          )}
          {(showInstallHelp || (!installEvent && !installedHint)) && !standalone && (
            <p className="muted site-hint">
              No celular: menu do navegador → &quot;Adicionar à tela inicial&quot; / &quot;Instalar app&quot;.
              No computador (Chrome/Edge), o botão abre o convite de instalação quando o
              navegador liberar.
            </p>
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
    </div>
  );
}
