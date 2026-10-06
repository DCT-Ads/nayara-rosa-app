import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout, AuthLayout } from './components/AppLayout';
import { AppShell } from './components/AppShell';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AgendaScreen } from './screens/AgendaScreen';
import { AltarScreen } from './screens/AltarScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { AdminScreen } from './screens/AdminScreen';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginScreen />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/agenda" element={<AgendaScreen />} />
              <Route path="/altar" element={<AltarScreen />} />
              <Route path="/player" element={<PlayerScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />
              <Route path="/admin" element={<AdminScreen />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
}
