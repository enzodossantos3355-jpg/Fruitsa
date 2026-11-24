import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clapperboard,
  Film,
  FolderOpen,
  Layers,
  Menu,
  PenTool,
  Plug,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { useAuth } from '../contexts/AuthContext';

const HERO_SCENE_IMG = '/src/assets/images/hero_studio_frame_1795542838751.jpg';
const CHARACTER_REF_IMG = '/src/assets/images/character_sheet_citrus_1795542839575.jpg';

const WORKFLOW_STEPS = [
  {
    index: '01',
    title: 'Crie e configure seu estúdio',
    status: 'Disponível na Etapa 1',
    available: true,
    description:
      'Autentique sua conta com segurança, defina a identidade do seu estúdio e centralize suas preferências em um ambiente isolado por conta.',
  },
  {
    index: '02',
    title: 'Estruture personagens e cenários',
    status: 'Etapa futura',
    available: false,
    description:
      'Monte sua bíblia de personagens de frutas, referências visuais, prompts âncora, guarda-roupa e biblioteca de cenários reutilizáveis.',
  },
  {
    index: '03',
    title: 'Roteirize novelas e episódios',
    status: 'Etapa futura',
    available: false,
    description:
      'Organize temporadas opcionais, episódios, cenas e vídeos especiais com memória narrativa e assistência de roteirização.',
  },
  {
    index: '04',
    title: 'Conduza a produção e publique',
    status: 'Etapa futura',
    available: false,
    description:
      'Acompanhe o progresso na central de produção, organize imagens e vídeos gerados, exporte pacotes ZIP e planeje o calendário editorial.',
  },
];

const SECONDARY_MODULES = [
  {
    index: '03',
    icon: PenTool,
    title: 'Roteirização assistida por inteligência artificial',
    description:
      'Motor criativo orientado por prompts personalizados, com suporte planejado para criação manual, drama personalizado e modo viral automático.',
  },
  {
    index: '04',
    icon: Clapperboard,
    title: 'Central de produção',
    description:
      'Painel operacional para acompanhar status de episódios, histórico de versões, revisões de continuidade e entregas prontas.',
  },
  {
    index: '05',
    icon: Layers,
    title: 'Editor de cenas',
    description:
      'Estruturação cena a cena vinculando falas, direção visual, personagens presentes, cenários e duração estimada.',
  },
  {
    index: '06',
    icon: FolderOpen,
    title: 'Organização de imagens e vídeos',
    description:
      'Biblioteca centralizada para catalogar quadros de referência, clipes curtos, capas e pacotes de exportação do projeto.',
  },
];

export const LandingPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [charImgFailed, setCharImgFailed] = useState(false);

  const authenticatedTarget = !user
    ? '/cadastro'
    : !user.emailVerified
      ? '/verificar-email'
      : profile?.onboardingCompleted
        ? '/studio'
        : '/configuracao-inicial';

  return (
    <div id="inicio" className="min-h-screen bg-[#F5F7FA] text-[#172033] flex flex-col">
      {/* Top Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-xs border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <Link to="/" aria-label="FruitStudio — Página inicial" className="shrink-0">
            <BrandLogo />
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#64748B]"
          >
            <a
              href="#inicio"
              className="hover:text-[#172033] transition-colors whitespace-nowrap shrink-0"
            >
              Início
            </a>
            <a
              href="#funcionalidades"
              className="hover:text-[#172033] transition-colors whitespace-nowrap shrink-0"
            >
              Funcionalidades
            </a>
            <a
              href="#como-funciona"
              className="hover:text-[#172033] transition-colors whitespace-nowrap shrink-0"
            >
              Como funciona
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            {user ? (
              <Link
                to={authenticatedTarget}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Acessar estúdio
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/entrar"
                  className="text-sm font-medium text-[#172033] hover:text-[#2563EB] transition-colors whitespace-nowrap shrink-0 px-2 py-2"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#172033] hover:bg-[#F5F7FA] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E2E8F0] px-4 pt-3 pb-5 space-y-2 shadow-sm">
            <a
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-[#172033] hover:bg-[#F5F7FA] rounded-lg"
            >
              Início
            </a>
            <a
              href="#funcionalidades"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-[#172033] hover:bg-[#F5F7FA] rounded-lg"
            >
              Funcionalidades
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-[#172033] hover:bg-[#F5F7FA] rounded-lg"
            >
              Como funciona
            </a>
            <div className="pt-3 mt-2 border-t border-[#E2E8F0] flex flex-col gap-2.5">
              {user ? (
                <Link
                  to={authenticatedTarget}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                >
                  Acessar estúdio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/entrar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center w-full min-h-[44px] px-4 py-2.5 text-sm font-medium text-[#172033] bg-[#F5F7FA] hover:bg-[#E2E8F0]/60 border border-[#E2E8F0] rounded-lg transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/cadastro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center w-full min-h-[44px] px-4 py-2.5 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                  >
                    Criar conta
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-14 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-xs sm:text-sm font-medium text-[#2563EB] mb-4">
                Plataforma de produção audiovisual · Novelas e vídeos curtos
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.03em] leading-[1.08] text-[#172033] text-balance mb-6">
                Grandes histórias começam no seu estúdio.
              </h1>
              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mb-8">
                O FruitStudio reúne em um único ambiente profissional a criação de histórias,
                a organização de personagens de frutas, a roteirização estruturada e o
                gerenciamento de ponta a ponta das suas produções audiovisuais.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to={authenticatedTarget}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Começar a criar
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#funcionalidades"
                  className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 text-sm font-semibold text-[#172033] bg-white hover:bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Conhecer funcionalidades
                </a>
              </div>
            </div>

            {/* Editorial Studio Interface Preview Composition */}
            <div className="mt-14 sm:mt-16">
              <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
                {/* Cinema Pro Studio Top Rail */}
                <div className="px-4 sm:px-6 py-3 border-b border-[#E2E8F0] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-semibold text-[#172033] whitespace-nowrap">
                      Ambiente FruitStudio
                    </span>
                    <span className="text-[#E2E8F0]" aria-hidden="true">
                      /
                    </span>
                    <span className="text-xs text-[#64748B] truncate">
                      Prévia editorial da interface de produção
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span>Etapa 1: Fundação ativa</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#2563EB] font-medium">
                      Editor de cenas em desenvolvimento
                    </span>
                  </div>
                </div>

                {/* 3-Column Editorial Studio Composition */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
                  {/* Left: Production Tree */}
                  <div className="lg:col-span-3 p-5 bg-[#FAFBFD] flex flex-col justify-between gap-6">
                    <div>
                      <p className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase mb-3">
                        Estrutura do projeto
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between px-2.5 py-2 rounded-md bg-[#2563EB]/8 text-[#172033] font-medium">
                          <span>Episódio 01 · Abertura</span>
                          <span className="text-[11px] font-mono tabular-nums text-[#2563EB]">
                            03 cenas
                          </span>
                        </div>
                        <div className="px-2.5 py-2 text-[#64748B] flex items-center justify-between">
                          <span>Cena 01 · Fachada do Café</span>
                          <span className="text-[11px] font-mono tabular-nums">14s</span>
                        </div>
                        <div className="px-2.5 py-2 text-[#64748B] flex items-center justify-between">
                          <span>Cena 02 · Encontro na Praça</span>
                          <span className="text-[11px] font-mono tabular-nums">18s</span>
                        </div>
                        <div className="px-2.5 py-2 text-[#64748B] flex items-center justify-between">
                          <span>Cena 03 · Desfecho Noturno</span>
                          <span className="text-[11px] font-mono tabular-nums">12s</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8F0]">
                      <p className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase mb-2">
                        Continuidade
                      </p>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        Personagens, cenários e direção visual conectados em um mesmo roteiro
                        versionado.
                      </p>
                    </div>
                  </div>

                  {/* Center: Cinema Viewport & Schematic Timeline */}
                  <div className="lg:col-span-6 p-5 bg-white flex flex-col gap-4">
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#172033]">
                      {!heroImgFailed ? (
                        <img
                          src={HERO_SCENE_IMG}
                          alt="Prévia editorial de cena cinematográfica com personagem de morango em frente a um café ao entardecer"
                          referrerPolicy="no-referrer"
                          onError={() => setHeroImgFailed(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#E2E8F0] bg-[#172033] p-6 text-center">
                          <Film className="w-8 h-8 text-[#0EA5E9]" />
                          <span className="text-sm font-medium">
                            Quadro de referência · Cena 01
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#172033]/85 via-[#172033]/35 to-transparent px-4 py-3 flex items-end justify-between gap-4">
                        <span className="text-xs font-medium text-white">
                          Cena 01 · Enquadramento médio · 50mm
                        </span>
                        <span className="text-xs font-mono tabular-nums text-white/90">
                          00:01:14:08
                        </span>
                      </div>
                    </div>

                    {/* Clean Schematic Timeline Strip */}
                    <div className="border border-[#E2E8F0] rounded-lg p-3.5 bg-[#FAFBFD] space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#64748B]">
                        <span>00:00</span>
                        <span>00:15</span>
                        <span>00:30</span>
                        <span>00:45</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-12 gap-1.5 items-center">
                          <span className="col-span-2 text-[11px] font-medium text-[#64748B]">
                            Cena
                          </span>
                          <div className="col-span-4 h-5 rounded-sm bg-[#2563EB]/15 border border-[#2563EB]/30 px-2 flex items-center text-[10px] font-medium text-[#172033] truncate">
                            Plano 01A
                          </div>
                          <div className="col-span-4 h-5 rounded-sm bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 px-2 flex items-center text-[10px] font-medium text-[#172033] truncate">
                            Plano 01B
                          </div>
                          <div className="col-span-2 h-5 rounded-sm bg-[#E2E8F0]/70 border border-[#E2E8F0]" />
                        </div>
                        <div className="grid grid-cols-12 gap-1.5 items-center">
                          <span className="col-span-2 text-[11px] font-medium text-[#64748B]">
                            Roteiro
                          </span>
                          <div className="col-span-7 h-5 rounded-sm bg-[#172033]/8 border border-[#E2E8F0] px-2 flex items-center text-[10px] text-[#64748B] truncate">
                            Diálogo principal e marcação de câmera
                          </div>
                          <div className="col-span-3 h-5 rounded-sm bg-[#172033]/5 border border-[#E2E8F0]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Character Reference Inspector */}
                  <div className="lg:col-span-3 p-5 bg-[#FAFBFD] flex flex-col justify-between gap-5">
                    <div>
                      <p className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase mb-3">
                        Bíblia de personagem
                      </p>
                      <div className="aspect-4/3 w-full rounded-lg overflow-hidden border border-[#E2E8F0] bg-white mb-3.5">
                        {!charImgFailed ? (
                          <img
                            src={CHARACTER_REF_IMG}
                            alt="Estudo conceitual de personagem tangerina com cardigã azul-marinho e óculos redondos"
                            referrerPolicy="no-referrer"
                            onError={() => setCharImgFailed(true)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-[#64748B] p-4 text-center">
                            <Users className="w-6 h-6 text-[#2563EB]" />
                            <span className="text-xs font-medium">Referência visual</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#172033]">
                        Ficha de consistência
                      </p>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        Centralize aparência, figurino, traços faciais e prompt âncora para
                        preservar a identidade em toda a temporada.
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-[#E2E8F0] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[#64748B]">
                        <span>Figurino base</span>
                        <span className="text-[#172033] font-medium">Cardigã clássico</span>
                      </div>
                      <div className="flex items-center justify-between text-[#64748B]">
                        <span>Referências</span>
                        <span className="text-[#172033] font-medium">Módulo futuro</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#64748B]">
                Composição ilustrativa da arquitetura prevista do estúdio. Na Etapa 1 estão
                disponíveis a autenticação, a configuração do estúdio, a estrutura de navegação e
                as configurações de conta.
              </p>
            </div>
          </div>
        </section>

        {/* Planned Capabilities Section */}
        <section
          id="funcionalidades"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E2E8F0]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase mb-3">
                Arquitetura planejada
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-[-0.025em] text-[#172033] text-balance mb-4">
                Ferramentas desenhadas para o ciclo completo da produção.
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                O FruitStudio está sendo construído em etapas sólidas. Abaixo estão os recursos
                que compõem a plataforma — com indicação transparente do que já opera na fundação
                e do que será entregue nas próximas fases.
              </p>
            </div>

            {/* Asymmetric Featured Pair */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <article className="lg:col-span-7 bg-[#FAFBFD] border border-[#E2E8F0] rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                      <Film className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-[#64748B]">
                      01 · Em desenvolvimento
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#172033] mb-3">
                    Gerenciamento de novelas e episódios
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Estruture cada novela com ou sem temporadas, organize a ordem dos episódios,
                    acompanhe vídeos especiais e mantenha a memória narrativa acessível durante
                    toda a produção.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#64748B]">
                  <span>Temporadas opcionais</span>
                  <span aria-hidden="true">·</span>
                  <span>Episódios e especiais</span>
                  <span aria-hidden="true">·</span>
                  <span>Histórico de versões</span>
                </div>
              </article>

              <article className="lg:col-span-5 bg-[#FAFBFD] border border-[#E2E8F0] rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0EA5E9]">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-[#64748B]">
                      02 · Em desenvolvimento
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#172033] mb-3">
                    Bíblia de personagens e referências visuais
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Conserve a identidade de cada personagem de fruta com prompts âncora, imagens
                    de referência e catálogo de figurinos reutilizáveis em novas cenas.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#64748B]">
                  <span>Prompts âncora</span>
                  <span aria-hidden="true">·</span>
                  <span>Guarda-roupa</span>
                  <span aria-hidden="true">·</span>
                  <span>Referências</span>
                </div>
              </article>
            </div>

            {/* Clean Hairline Grid for Modules 03–06 */}
            <div className="border border-[#E2E8F0] rounded-xl bg-white overflow-hidden mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
                {SECONDARY_MODULES.slice(0, 2).map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <article key={mod.index} className="p-6 sm:p-7">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <Icon className="w-5 h-5 text-[#2563EB]" />
                        <span className="text-xs text-[#64748B]">
                          {mod.index} · Em desenvolvimento
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[#172033] mb-2">{mod.title}</h3>
                      <p className="text-sm text-[#64748B] leading-relaxed">{mod.description}</p>
                    </article>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#E2E8F0] divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
                {SECONDARY_MODULES.slice(2, 4).map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <article key={mod.index} className="p-6 sm:p-7">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <Icon className="w-5 h-5 text-[#2563EB]" />
                        <span className="text-xs text-[#64748B]">
                          {mod.index} · Em desenvolvimento
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[#172033] mb-2">{mod.title}</h3>
                      <p className="text-sm text-[#64748B] leading-relaxed">{mod.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Module 07: FruitStudio Connect + Stage 1 Transparency */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <article className="lg:col-span-7 bg-[#FAFBFD] border border-[#E2E8F0] rounded-xl p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5 text-[#172033]">
                    <Plug className="w-5 h-5 text-[#0EA5E9]" />
                    <h3 className="text-base font-semibold">FruitStudio Connect</h3>
                  </div>
                  <span className="text-xs text-[#64748B]">07 · Em desenvolvimento</span>
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Extensão para navegador baseada em Chrome Manifest V3 planejada para conectar o
                  seu fluxo externo ao estúdio sem exigir chaves de API pagas. Esta integração
                  ainda não está disponível e será desenvolvida em etapa dedicada.
                </p>
              </article>

              <article className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5 text-[#172033]">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <h3 className="text-base font-semibold">Disponível agora · Etapa 1</h3>
                  </div>
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  A fundação já está operacional: autenticação real com Google ou e-mail e senha,
                  verificação de e-mail, isolamento de dados por conta, configuração do estúdio e
                  navegação preparada para os próximos módulos.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="como-funciona" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA]">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase mb-3">
                Fluxo de produção
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-[-0.025em] text-[#172033] text-balance mb-4">
                Da ideia inicial à organização final do episódio.
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Cada etapa foi planejada para manter clareza criativa e rigor operacional, sem
                planilhas espalhadas ou perda de continuidade entre capítulos.
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0] grid grid-cols-1 lg:grid-cols-4">
              {WORKFLOW_STEPS.map((step) => (
                <div key={step.index} className="p-6 sm:p-7 flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-mono font-medium tabular-nums text-[#2563EB]">
                        {step.index}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          step.available ? 'text-[#10B981]' : 'text-[#64748B]'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-[#172033] mb-2.5">{step.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quiet CTA Band */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#172033] text-balance mb-3">
                Prepare o seu estúdio desde a fundação.
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Crie sua conta gratuita para configurar a identidade do seu estúdio e acompanhar a
                liberação das próximas etapas de produção.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to={authenticatedTarget}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap"
              >
                {user ? 'Abrir meu estúdio' : 'Criar conta'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!user && (
                <Link
                  to="/entrar"
                  className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 text-sm font-semibold text-[#172033] bg-[#F5F7FA] hover:bg-[#E2E8F0]/60 border border-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap"
                >
                  Já tenho conta
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Organized Commercial Footer */}
      <footer className="bg-[#F5F7FA] border-t border-[#E2E8F0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E2E8F0]">
            <div className="md:col-span-5 space-y-3">
              <BrandLogo />
              <p className="text-sm text-[#64748B] leading-relaxed max-w-sm">
                Ambiente de organização e produção audiovisual para novelas e vídeos curtos com
                personagens de frutas.
              </p>
            </div>

            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-semibold tracking-wider text-[#172033] uppercase">
                Navegação
              </p>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li>
                  <a href="#inicio" className="hover:text-[#172033] transition-colors">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#funcionalidades" className="hover:text-[#172033] transition-colors">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-[#172033] transition-colors">
                    Como funciona
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <p className="text-xs font-semibold tracking-wider text-[#172033] uppercase">
                Acesso ao estúdio
              </p>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li>
                  <Link to="/entrar" className="hover:text-[#172033] transition-colors">
                    Entrar na conta
                  </Link>
                </li>
                <li>
                  <Link to="/cadastro" className="hover:text-[#172033] transition-colors">
                    Criar nova conta
                  </Link>
                </li>
                <li>
                  <Link to="/recuperar-senha" className="hover:text-[#172033] transition-colors">
                    Recuperar senha
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#64748B]">
            <p>© {new Date().getFullYear()} FruitStudio. Todos os direitos reservados.</p>
            <p>Etapa 1 · Fundação da plataforma</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
