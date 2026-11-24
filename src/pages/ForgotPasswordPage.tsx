import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { useAuth } from '../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../lib/firebaseErrors';

export const ForgotPasswordPage: React.FC = () => {
  const { sendResetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSent(false);

    if (!isConfigured) {
      setError('Configure o projeto Firebase em src/lib/firebase.ts antes de recuperar a senha.');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Informe um endereço de e-mail válido.');
      return;
    }

    setSubmitting(true);
    try {
      await sendResetPassword(trimmedEmail);
      setSent(true);
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Informe o e-mail da sua conta para receber o link de redefinição."
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

      {sent ? (
        <div className="space-y-5">
          <div className="p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 text-sm text-[#172033] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Solicitação enviada</p>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Se houver uma conta de e-mail e senha associada a{' '}
                <strong className="text-[#172033]">{email.trim()}</strong>, você receberá as
                instruções para redefinir sua senha em instantes. Verifique também a caixa de spam.
              </p>
            </div>
          </div>

          <Link
            to="/entrar"
            className="w-full min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
          >
            Voltar para entrar
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-[#172033] mb-1.5">
              E-mail cadastrado
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@exemplo.com"
              disabled={submitting}
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg placeholder:text-[#64748B]/70 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !isConfigured}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{submitting ? 'Enviando link...' : 'Enviar link de recuperação'}</span>
          </button>

          <p className="pt-2 text-center text-sm text-[#64748B]">
            Lembrou sua senha?{' '}
            <Link
              to="/entrar"
              className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              Voltar para entrar
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
};
