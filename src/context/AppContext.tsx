import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { tracks as fallbackTracks, type Track, notifications as seedNotifs, type NotificationItem } from '../data/content';
import { isAdminEmail } from '../api/events';
import { fetchMedia } from '../api/media';

type AppContextValue = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  adminEmail: string | null;
  userName: string;
  library: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  showMiniPlayer: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  login: (email: string) => void;
  logout: () => void;
  togglePlay: () => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  markAllRead: () => void;
  setShowMiniPlayer: (v: boolean) => void;
  refreshLibrary: () => Promise<void>;
  attachVideoEl: (el: HTMLVideoElement | null) => void;
  pauseMainPlayback: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const emptyTrack: Track = {
  id: 'empty',
  title: 'Nenhuma mídia',
  artist: 'Nayara Rosa',
  type: 'musica',
  duration: '0:00',
  cover: 'linear-gradient(145deg, #1A0A18 0%, #5C1840 50%, #2A0A20 100%)',
};

function hasMedia(track: Track | undefined | null) {
  return Boolean(track?.mediaUrl?.trim());
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState('Fã');
  const [library, setLibrary] = useState<Track[]>(fallbackTracks);
  const [currentTrack, setTrack] = useState<Track>(fallbackTracks[0] || emptyTrack);
  const [isPlaying, setPlaying] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);
  const [notifications, setNotifications] = useState(seedNotifs);
  const [videoEpoch, setVideoEpoch] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const overlayVideoRef = useRef<HTMLVideoElement | null>(null);

  const activeVideo = () => overlayVideoRef.current || fallbackVideoRef.current;

  const refreshLibrary = useCallback(async () => {
    try {
      const data = await fetchMedia();
      if (data.length) {
        setLibrary(data);
        setTrack((prev) => {
          const still = data.find((t) => t.id === prev.id);
          if (still) return still;
          return data.find((t) => hasMedia(t)) || data[0];
        });
      }
    } catch {
      /* mantém fallback */
    }
  }, []);

  useEffect(() => {
    void refreshLibrary();
  }, [refreshLibrary]);

  const attachVideoEl = useCallback((el: HTMLVideoElement | null) => {
    overlayVideoRef.current = el;
    setVideoEpoch((n) => n + 1);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setPlaying(false);
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const video = activeVideo();
    const src = currentTrack.mediaUrl?.trim() || '';
    const isVideo = currentTrack.type === 'video';

    if (audio) {
      if (src && !isVideo) {
        const abs = new URL(src, window.location.origin).href;
        if (audio.src !== abs) {
          audio.src = src;
          audio.load();
        }
        if (isPlaying) void audio.play().catch(() => setPlaying(false));
        else audio.pause();
      } else {
        audio.pause();
      }
    }

    if (video) {
      if (src && isVideo) {
        const abs = new URL(src, window.location.origin).href;
        if (video.src !== abs) {
          video.src = src;
          video.load();
        }
        if (isPlaying) void video.play().catch(() => setPlaying(false));
        else video.pause();
      } else {
        video.pause();
      }
    }

    // Evita áudio duplo: se o expandido montou o vídeo, pausa o fallback
    if (overlayVideoRef.current && fallbackVideoRef.current && overlayVideoRef.current !== fallbackVideoRef.current) {
      fallbackVideoRef.current.pause();
    }
  }, [currentTrack, isPlaying, videoEpoch]);

  const login = useCallback((email: string) => {
    const normalized = email.trim() || 'fan@nayararosa.com';
    const admin = isAdminEmail(normalized);
    const name = normalized.split('@')[0] || 'Fã';
    setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    setAdmin(admin);
    setAdminEmail(admin ? normalized.toLowerCase() : null);
    setAuth(true);
  }, []);

  const logout = useCallback(() => {
    setAuth(false);
    setAdmin(false);
    setAdminEmail(null);
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!hasMedia(currentTrack)) return;
    setPlaying((p) => !p);
  }, [currentTrack]);

  const pauseMainPlayback = useCallback(() => {
    setPlaying(false);
  }, []);

  const playTrack = useCallback((track: Track) => {
    setTrack(track);
    setPlaying(hasMedia(track));
    setShowMiniPlayer(true);
  }, []);

  const stepTrack = useCallback((dir: 1 | -1) => {
    setLibrary((lib) => {
      setTrack((t) => {
        if (!lib.length) return t;
        const playable = lib.filter((x) => hasMedia(x));
        const list = playable.length ? playable : lib;
        const i = list.findIndex((x) => x.id === t.id);
        const next = list[(Math.max(i, 0) + dir + list.length) % list.length];
        setPlaying(hasMedia(next));
        return next;
      });
      return lib;
    });
  }, []);

  const nextTrack = useCallback(() => stepTrack(1), [stepTrack]);
  const prevTrack = useCallback(() => stepTrack(-1), [stepTrack]);

  const markAllRead = useCallback(() => {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAdmin,
      adminEmail,
      userName,
      library,
      currentTrack,
      isPlaying,
      showMiniPlayer,
      notifications,
      unreadCount,
      login,
      logout,
      togglePlay,
      playTrack,
      nextTrack,
      prevTrack,
      markAllRead,
      setShowMiniPlayer,
      refreshLibrary,
      attachVideoEl,
      pauseMainPlayback,
    }),
    [
      isAuthenticated,
      isAdmin,
      adminEmail,
      userName,
      library,
      currentTrack,
      isPlaying,
      showMiniPlayer,
      notifications,
      unreadCount,
      login,
      logout,
      togglePlay,
      playTrack,
      nextTrack,
      prevTrack,
      markAllRead,
      refreshLibrary,
      attachVideoEl,
      pauseMainPlayback,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" style={{ display: 'none' }} />
      <video ref={fallbackVideoRef} preload="metadata" playsInline style={{ display: 'none' }} />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
