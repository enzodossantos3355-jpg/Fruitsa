import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { STUDIO_NAVIGATION } from '../../config/navigation';

interface FutureModulePageProps {
  moduleId: string;
}

export const FutureModulePage: React.FC<FutureModulePageProps> = ({ moduleId }) => {
  const item = STUDIO_NAVIGATION.find((nav) => nav.id === moduleId);

  if (!item) {
    return null;
  }

  const Icon = item.icon;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
            <Icon className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F59E0B]">
            <Clock className="w-3.5 h-3.5" />
            <span>Indisponível nesta etapa · Previsto para etapas futuras</span>
          </span>
        </div>

        <p className="text-xs font-semibold tracking-wider text-[#64748B] uppercase mb-1.5">
          {item.group}
        </p>
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#172033] mb-3">{item.label}</h2>
        <p className="text-sm text-[#64748B] leading-relaxed mb-6">{item.plannedDescription}</p>

        {item.plannedCapabilities && item.plannedCapabilities.length > 0 && (
          <div className="pt-5 border-t border-[#E2E8F0]">
            <p className="text-xs font-semibold tracking-wider text-[#172033] uppercase mb-3">
              Escopo planejado na arquitetura
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748B]">
              {item.plannedCapabilities.map((capability, index) => (
                <li key={capability} className="flex items-start gap-3">
                  <span className="text-xs font-mono tabular-nums text-[#2563EB] mt-0.5 shrink-0">
                    0{index + 1}.
                  </span>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-[#64748B]">
            A rota e os tipos de dados já estão estruturados para receber este módulo sem
            refatoração destrutiva.
          </p>
          <Link
            to="/studio"
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 text-sm font-medium text-[#172033] bg-[#F5F7FA] hover:bg-[#E2E8F0]/60 border border-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Visão geral
          </Link>
        </div>
      </div>
    </div>
  );
};
