import { Pause, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, showMiniPlayer } = useApp();
  const navigate = useNavigate();

  if (!showMiniPlayer) return null;

  return (
    <div
      className="mini-player anim-fade-up"
      role="button"
      tabIndex={0}
      onClick={() => navigate('/player')}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/player')}
    >
      <div
        className="mini-cover"
        style={{ backgroundImage: currentTrack.cover }}
      />
      <div className="mini-info">
        <div className="title">{currentTrack.title}</div>
        <div className="artist">{currentTrack.artist}</div>
      </div>
      <div className="mini-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-play"
          style={{ width: 42, height: 42, minHeight: 42 }}
          aria-label={isPlaying ? 'Pausar' : 'Tocar'}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={18} fill="#fff" /> : <Play size={18} fill="#fff" style={{ marginLeft: 2 }} />}
        </button>
      </div>
    </div>
  );
}
