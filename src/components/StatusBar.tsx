import { Music2 } from 'lucide-react';

export function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center', opacity: 0.85 }}>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="3" width="3" height="9" rx="0.5" opacity="0.4" />
          <rect x="4" y="2" width="3" height="10" rx="0.5" opacity="0.6" />
          <rect x="8" y="0.5" width="3" height="11.5" rx="0.5" opacity="0.8" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" />
        </svg>
      </span>
    </div>
  );
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div
      className="logo-mark"
      style={{ width: size, height: size, borderRadius: size * 0.3, margin: 0 }}
    >
      <Music2 size={size * 0.45} color="#fff" strokeWidth={2.5} />
    </div>
  );
}
