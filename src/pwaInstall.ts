type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/** Captura o evento cedo — senão o botão Instalar fica “morto”. */
let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(e: BeforeInstallPromptEvent | null) => void>();

export function initPwaInstallCapture() {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    listeners.forEach((fn) => fn(deferred));
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    listeners.forEach((fn) => fn(null));
  });
}

export function getDeferredInstall() {
  return deferred;
}

export function subscribeInstallPrompt(fn: (e: BeforeInstallPromptEvent | null) => void) {
  listeners.add(fn);
  fn(deferred);
  return () => {
    listeners.delete(fn);
  };
}

export type { BeforeInstallPromptEvent };
