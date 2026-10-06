import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { images } from '../data/content';
import { StatusBar } from '../components/StatusBar';

export function LoginScreen() {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email || 'fan@nayararosa.com';
    login(value);
    const admin = value.toLowerCase().trim() === 'admin@nayararosa';
    navigate(admin ? '/admin' : '/home');
  }

  return (
    <div className="login-screen">
      <div
        className="login-bg"
        style={{ backgroundImage: images.login }}
        role="img"
        aria-label="Nayara Rosa — foto de fundo"
      />
      <div className="login-overlay" />
      <StatusBar />
      <div className="login-body">
        <div className="login-brand">
          <div className="logo-mark logo-mark--photo">
            <img src="/icons/logo-nr.png" alt="Nayara Rosa" width={72} height={72} />
          </div>
          <h1 className="h1">Nayara Rosa</h1>
          <p className="caption" style={{ marginTop: 6 }}>
            Música · Fé · Missão
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                className="btn-icon"
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 36,
                  height: 36,
                  minHeight: 36,
                  border: 'none',
                  background: 'transparent',
                }}
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            Entrar
          </button>

          <div className="login-links">
            <button type="button" className="btn-text">
              Esqueci minha senha
            </button>
            <button type="button" className="btn-text accent-text" style={{ background: 'none' }}>
              Criar conta
            </button>
          </div>

          <p className="muted" style={{ textAlign: 'center', marginTop: 8 }}>
            Admin: admin@NayaraRosa
          </p>
        </form>
      </div>
    </div>
  );
}
