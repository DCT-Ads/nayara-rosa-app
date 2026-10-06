import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';
import { MiniPlayer } from './MiniPlayer';

export function AppLayout() {
  const { isAuthenticated, showMiniPlayer } = useApp();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="app-content">
      <StatusBar />
      <div className={`screen-scroll${showMiniPlayer ? '' : ' no-mini'}`}>
        <Outlet />
      </div>
      <MiniPlayer />
      <BottomNav />
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="app-content">
      <Outlet />
    </div>
  );
}
