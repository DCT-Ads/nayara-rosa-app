import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Download, MonitorSmartphone, Smartphone } from 'lucide-react';

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

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setInstalledHint(true);
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
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setInstallEvent(null);
  }

  return (
    <div className={`app-shell${isApp ? ' app-shell--native' : ' app-shell--site'}`}>
      {!isApp && (
        <aside className="site-panel anim-fade-up">
          <div className="site-brand">
            <img src="/icons/icon.svg" alt="" width={48} height={48} />
            <div>
              <p className="caption gold-soft">Oficial</p>
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
          {installEvent && (
            <button type="button" className="btn btn-primary" onClick={handleInstall}>
              <Download size={18} />
              Instalar aplicativo
            </button>
          )}
          {!installEvent && !installedHint && (
            <p className="muted site-hint">
              No celular: menu do navegador → &quot;Adicionar à tela inicial&quot; / &quot;Instalar app&quot;.
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

      {isApp && !standalone && installEvent && (
        <button type="button" className="install-fab" onClick={handleInstall}>
          <Download size={16} />
          Instalar app
        </button>
      )}
    </div>
  );
}
