import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clapperboard,
  Clock,
  Film,
  Plug,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeStudioActivities } from '../../lib/studioService';
import type { StudioActivity } from '../../types/studio';

function formatActivityDate(activity: StudioActivity): string {
  if (!activity.createdAt) return 'Agora';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(activity.createdAt.toDate());
  } catch {
    return 'Recente';
  }
}

export const OverviewPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activities, setActivities] = useState<StudioActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setActivities([]);
      setActivitiesLoading(false);
      return;
    }

    setActivitiesLoading(true);
    const unsubscribe = subscribeStudioActivities(
      user.uid,
      (items) => {
        setActivities(items);
        setActivitiesLoading(false);
      },
      () => {
        setActivitiesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const studioName = profile?.studioName || 'Seu Estúdio';
  const displayName = profile?.displayName || user?.displayName || 'Criador';

  const metrics = [
    {
      label: 'Novelas cadastradas',
      value: '0',
      detail: 'Disponível na próxima etapa',
    },
    {
      label: 'Episódios em produção',
      value: '0',
      detail: 'Nenhuma produção iniciada',
    },
    {
      label: 'Progresso das produções',
      value: '—',
      detail: 'Aguardando primeiro projeto',
    },
    {
      label: 'Projetos recentes',
      value: '0',
      detail: 'Catálogo vazio',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Studio Greeting Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#64748B] mb-1">
            Visão geral do estúdio · Etapa 1
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#172033] truncate">
            {studioName}
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Olá, {displayName}. A fundação do seu estúdio está pronta e conectada à sua conta.
          </p>
        </div>

        <Link
          to="/studio/configuracoes"
          className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 text-sm font-medium text-[#172033] bg-white hover:bg-[#FAFBFD] border border-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Settings className="w-4 h-4 text-[#64748B]" />
          Configurações do estúdio
        </Link>
      </section>

      {/* Prepared KPI Overview Strip (Zero Fake Data, Tabular Numerals) */}
      <section
        aria-label="Resumo do estúdio"
        className="bg-white border border-[#E2E8F0] rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric) => (
          <div key={metric.label} className="p-5 sm:p-6">
            <p className="text-xs font-medium text-[#64748B] mb-2">{metric.label}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] tabular-nums">
              {metric.value}
            </p>
            <p className="text-xs text-[#64748B] mt-1.5">{metric.detail}</p>
          </div>
        ))}
      </section>

      {/* Main Content Split: Empty State Projects + Real Activity & Foundation Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Projects & Production Progress Empty State */}
        <section className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl flex flex-col">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#172033]">Projetos recentes</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Novelas, temporadas e episódios ativos do seu estúdio
              </p>
            </div>
            <Link
              to="/studio/novelas"
              className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              Ver módulo futuro
            </Link>
          </div>

          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] mb-4">
              <Film className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-[#172033] mb-2">
              Nenhuma novela cadastrada ainda
            </h4>
            <p className="text-sm text-[#64748B] max-w-md leading-relaxed mb-6">
              O FruitStudio não cria projetos fictícios automaticamente. Os módulos de criação de
              novelas, episódios, bíblia de personagens e central de produção serão liberados nas
              próximas etapas.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                to="/studio/novelas"
                className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap"
              >
                <Clapperboard className="w-4 h-4" />
                Explorar estrutura de novelas
              </Link>
              <Link
                to="/studio/personagens"
                className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 text-sm font-medium text-[#172033] bg-[#F5F7FA] hover:bg-[#E2E8F0]/60 border border-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap"
              >
                Ver recursos planejados
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Right: Foundation Status + Real Activity Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Studio Foundation Readiness */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-semibold text-[#172033]">Estado da fundação</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Componentes ativos nesta primeira etapa
              </p>
            </div>
            <ul className="divide-y divide-[#E2E8F0] px-6 text-sm">
              <li className="py-3.5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-[#172033]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Conta autenticada</span>
                </span>
                <span className="text-xs font-medium text-[#10B981]">Ativo</span>
              </li>
              <li className="py-3.5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-[#172033]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Perfil salvo no Firestore</span>
                </span>
                <span className="text-xs font-medium text-[#10B981]">Isolado por UID</span>
              </li>
              <li className="py-3.5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-[#172033]">
                  <Plug className="w-4 h-4 text-[#64748B] shrink-0" />
                  <span>FruitStudio Connect</span>
                </span>
                <span className="text-xs font-medium text-[#64748B]">Não implementado</span>
              </li>
            </ul>
          </section>

          {/* Real Studio Activity Log */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-semibold text-[#172033]">Atividades recentes</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Registros reais da sua conta no estúdio
              </p>
            </div>

            {activitiesLoading ? (
              <div className="p-6 space-y-3">
                <div className="h-4 w-3/4 bg-[#F5F7FA] rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-[#F5F7FA] rounded animate-pulse" />
              </div>
            ) : activities.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] inline-flex items-center justify-center text-[#64748B] mb-3">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-[#172033]">Nenhuma atividade registrada</p>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Alterações de perfil e futuras movimentações de produção aparecerão aqui.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[#E2E8F0]">
                {activities.map((activity) => (
                  <li key={activity.id} className="px-6 py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-medium text-[#172033]">{activity.title}</p>
                      <span className="text-[11px] text-[#64748B] tabular-nums shrink-0">
                        {formatActivityDate(activity)}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        {activity.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
