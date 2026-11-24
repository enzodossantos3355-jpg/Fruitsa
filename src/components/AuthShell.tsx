import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../contexts/AuthContext';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ title, subtitle, children }) => {
  const { isConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col lg:grid lg:grid-cols-12">
      {/* Left Editorial Cinema Panel (Desktop) */}
      <aside className="hidden lg:flex lg:col-span-5 bg-[#FFFFFF] border-r border-[#E2E8F0] p-10 xl:p-14 flex-col justify-between">
        <div>
          <Link to="/" aria-label="Voltar para a página inicial do FruitStudio">
            <BrandLogo />
          </Link>
        </div>

        <div className="max-w-md space-y-6">
          <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
            Estúdio audiovisual
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.025em] leading-tight text-[#172033] text-balance">
            Organização cinematográfica para suas novelas e vídeos curtos.
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Cada conta mantém seus próprios dados isolados no Cloud Firestore, preparados para
            receber roteiros, personagens, cenários e controles de produção nas próximas etapas.
          </p>

          <div className="pt-6 border-t border-[#E2E8F0] space-y-3 text-xs text-[#64748B]">
            <div className="flex items-center justify-between">
              <span>Isolamento de dados</span>
              <span className="text-[#172033] font-medium">Por conta autenticada (UID)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Persistência de sessão</span>
              <span className="text-[#172033] font-medium">Firebase Authentication</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Etapa atual</span>
              <span className="text-[#172033] font-medium">Fundação do estúdio</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#64748B]">
          © {new Date().getFullYear()} FruitStudio
        </div>
      </aside>

      {/* Right Form Column */}
      <main className="flex-1 lg:col-span-7 flex flex-col justify-between px-4 py-6 sm:px-8 sm:py-10">
        <div className="w-full max-w-md mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#172033] transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          <div className="lg:hidden">
            <BrandLogo />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto my-8">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#172033] mb-1.5">
                {title}
              </h1>
              <p className="text-sm text-[#64748B] leading-relaxed">{subtitle}</p>
            </div>

            {!isConfigured && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#172033] text-xs leading-relaxed flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Firebase ainda não configurado</p>
                  <p className="text-[#64748B]">
                    Insira a configuração pública do seu projeto Firebase Web em{' '}
                    <code className="font-mono text-[#172033]">src/lib/firebase.ts</code> para
                    habilitar a autenticação real. O aplicativo nunca simula logins sem conexão
                    válida.
                  </p>
                </div>
              </div>
            )}

            {children}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto text-center lg:hidden text-xs text-[#64748B]">
          © {new Date().getFullYear()} FruitStudio
        </div>
        <div className="hidden lg:block" />
      </main>
    </div>
  );
};
