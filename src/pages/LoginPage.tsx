import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { useAuth } from '../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../lib/firebaseErrors';

export const LoginPage: React.FC = () => {
  const { signInWithEmail, signInWithGoogle, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError('Configure o projeto Firebase em src/lib/firebase.ts antes de entrar.');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Informe um endereço de e-mail válido.');
      return;
    }
    if (!password) {
      setError('Informe sua senha para continuar.');
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmail(trimmedEmail, password);
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    if (!isConfigured) {
      setError('Configure o projeto Firebase em src/lib/firebase.ts antes de entrar com o Google.');
      return;
    }
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const busy = submitting || googleSubmitting;

  return (
    <AuthShell
      title="Entrar no FruitStudio"
      subtitle="Acesse seu estúdio com sua conta Google ou e-mail e senha."
    >
      {error && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-lg bg-[#F43F5E]/8 border border-[#F43F5E]/25 text-xs text-[#172033] flex items-start gap-2.5 leading-relaxed"
        >
          <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={busy || !isConfigured}
        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#172033] bg-white hover:bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {googleSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
        )}
        <span>{googleSubmitting ? 'Conectando com o Google...' : 'Entrar com Google'}</span>
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-[#E2E8F0]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#64748B]">ou continue com e-mail</span>
        </div>
      </div>

      <form onSubmit={handleEmailSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[#172033] mb-1.5">
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@exemplo.com"
            disabled={busy}
            className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg placeholder:text-[#64748B]/70 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium text-[#172033]">
              Senha
            </label>
            <Link
              to="/recuperar-senha"
              className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              Recuperar senha
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={busy}
              className="w-full min-h-[44px] pl-3.5 pr-11 py-2.5 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg placeholder:text-[#64748B]/70 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center rounded-md text-[#64748B] hover:text-[#172033] hover:bg-[#F5F7FA] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy || !isConfigured}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{submitting ? 'Entrando...' : 'Entrar'}</span>
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#64748B]">
        Ainda não tem uma conta?{' '}
        <Link
          to="/cadastro"
          className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </AuthShell>
  );
};
