import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, LogOut, Mail, RefreshCw } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { useAuth } from '../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../lib/firebaseErrors';

export const VerifyEmailPage: React.FC = () => {
  const { user, resendVerificationEmail, refreshCurrentUser, signOutUser } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckVerification = async () => {
    setError(null);
    setFeedback(null);
    setChecking(true);
    try {
      const verified = await refreshCurrentUser();
      if (!verified) {
        setError(
          'Ainda não identificamos a confirmação do seu e-mail. Abra o link enviado à sua caixa de entrada e tente novamente.'
        );
      }
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setFeedback(null);
    setResending(true);
    try {
      await resendVerificationEmail();
      setFeedback('Um novo e-mail de verificação foi enviado. Confira sua caixa de entrada e spam.');
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <AuthShell
      title="Verifique seu e-mail"
      subtitle="Confirme seu endereço de e-mail para proteger o acesso ao seu estúdio."
    >
      <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] mb-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] shrink-0">
          <Mail className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed text-[#64748B]">
          <p className="font-semibold text-[#172033] mb-0.5">Link de confirmação enviado para:</p>
          <p className="font-mono text-[#172033] break-all">{user?.email}</p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 p-3.5 rounded-lg bg-[#F43F5E]/8 border border-[#F43F5E]/25 text-xs text-[#172033] flex items-start gap-2.5 leading-relaxed"
        >
          <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {feedback && (
        <div className="mb-4 p-3.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 text-xs text-[#172033] flex items-start gap-2.5 leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleCheckVerification}
          disabled={checking || resending}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>{checking ? 'Verificando confirmação...' : 'Já verifiquei meu e-mail'}</span>
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={checking || resending}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#172033] bg-white hover:bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          {resending && <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />}
          <span>{resending ? 'Reenviando...' : 'Reenviar e-mail de verificação'}</span>
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-[#64748B] hover:text-[#172033] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair e usar outra conta</span>
        </button>
      </div>
    </AuthShell>
  );
};
