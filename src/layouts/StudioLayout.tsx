import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  LayoutDashboard,
  LogOut,
  Menu,
  Plug,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { UserAvatar } from '../components/UserAvatar';
import { getNavItemByPath, NAV_GROUPS, STUDIO_NAVIGATION } from '../config/navigation';
import { useAuth } from '../contexts/AuthContext';

const SIDEBAR_STORAGE_KEY = 'fruitstudio_sidebar_collapsed';

export const StudioLayout: React.FC = () => {
  const { user, profile, signOutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const connectRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentNavItem = getNavItemByPath(location.pathname);

  useEffect(() => {
    setMobileDrawerOpen(false);
    setConnectOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (connectRef.current && !connectRef.current.contains(target)) {
        setConnectOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setConnectOpen(false);
        setProfileMenuOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // ignore storage restrictions
      }
      return next;
    });
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/entrar', { replace: true });
  };

  const displayName = profile?.displayName || user?.displayName || 'Criador';
  const studioName = profile?.studioName || 'Meu Estúdio';
  const photoURL = profile?.photoURL || user?.photoURL || '';
  const avatarTone = profile?.avatarTone || 'blue';

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172033] flex">
      {/* Desktop Collapsible Sidebar */}
      <aside
        aria-label="Menu principal do estúdio"
        className={`hidden lg:flex flex-col bg-white border-r border-[#E2E8F0] shrink-0 sticky top-0 h-screen transition-[width] duration-200 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`h-16 border-b border-[#E2E8F0] flex items-center ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          <Link to="/studio" aria-label="FruitStudio — Visão geral">
            <BrandLogo compact={collapsed} />
          </Link>
          {!collapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Recolher menu lateral"
              title="Recolher menu lateral"
              className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[#64748B] hover:text-[#172033] hover:bg-[#F5F7FA] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar Navigation Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-6">
          {NAV_GROUPS.map((groupName) => {
            const items = STUDIO_NAVIGATION.filter((item) => item.group === groupName);
            return (
              <div key={groupName}>
                {!collapsed ? (
                  <p className="px-2.5 mb-2 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
                    {groupName}
                  </p>
                ) : (
                  <div className="my-2 mx-2 border-t border-[#E2E8F0] first:hidden" />
                )}
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <NavLink
                          to={item.path}
                          end={item.path === '/studio'}
                          title={
                            collapsed
                              ? `${item.label}${!item.availableInStage1 ? ' (Etapa futura)' : ''}`
                              : undefined
                          }
                          className={({ isActive }) =>
                            `flex items-center ${
                              collapsed ? 'justify-center px-0' : 'justify-between px-2.5'
                            } h-10 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold'
                                : item.availableInStage1
                                  ? 'text-[#172033] hover:bg-[#F5F7FA] font-medium'
                                  : 'text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#172033] font-normal'
                            }`
                          }
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <Icon className="w-[18px] h-[18px] shrink-0" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                          </span>
                          {!collapsed && !item.availableInStage1 && (
                            <span className="text-[10px] font-medium text-[#64748B]/80 shrink-0 ml-2">
                              Em breve
                            </span>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer / Expand Control */}
        <div className="p-2.5 border-t border-[#E2E8F0]">
          {collapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expandir menu lateral"
              title="Expandir menu lateral"
              className="w-full h-10 rounded-lg inline-flex items-center justify-center text-[#64748B] hover:text-[#172033] hover:bg-[#F5F7FA] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="px-2.5 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0]">
              <p className="text-xs font-semibold text-[#172033] truncate">{studioName}</p>
              <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                Etapa 1 · Fundação ativa
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar (Compact 48px on mobile, 64px on desktop) */}
        <header className="sticky top-0 z-30 h-12 lg:h-16 bg-white border-b border-[#E2E8F0] px-3 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile Drawer Trigger + Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Abrir menu completo do estúdio"
              className="lg:hidden w-10 h-10 -ml-1 rounded-lg inline-flex items-center justify-center text-[#172033] hover:bg-[#F5F7FA] transition-colors cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="lg:hidden shrink-0">
              <BrandLogo compact />
            </div>

            <div className="flex items-center gap-2 min-w-0 text-sm">
              <span className="hidden sm:inline text-[#64748B] text-xs font-medium uppercase tracking-wider shrink-0">
                {currentNavItem?.group || 'ESTÚDIO'}
              </span>
              <span className="hidden sm:inline text-[#E2E8F0]" aria-hidden="true">
                /
              </span>
              <h1 className="font-semibold text-[#172033] truncate text-sm sm:text-[15px]">
                {currentNavItem?.label || 'Visão geral'}
              </h1>
            </div>
          </div>

          {/* Right: FruitStudio Connect Indicator + User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* FruitStudio Connect Status */}
            <div ref={connectRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setConnectOpen((prev) => !prev);
                  setProfileMenuOpen(false);
                }}
                aria-expanded={connectOpen}
                aria-label="Status do FruitStudio Connect: Não conectado"
                className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg border border-[#E2E8F0] bg-[#FAFBFD] hover:bg-[#F5F7FA] text-xs font-medium text-[#64748B] hover:text-[#172033] inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plug className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                <span className="hidden md:inline">FruitStudio Connect</span>
                <span className="hidden md:inline text-[#E2E8F0]" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#64748B]">Não conectado</span>
              </button>

              {connectOpen && (
                <div
                  role="dialog"
                  aria-label="Informações do FruitStudio Connect"
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-md p-4 z-50"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#172033]">
                      <Plug className="w-4 h-4 text-[#0EA5E9]" />
                      <span>FruitStudio Connect</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#F59E0B]">
                      Não implementado
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-3.5">
                    A extensão Chrome Manifest V3 ainda não está implementada nem conectada nesta
                    Etapa 1. O pareamento e a sincronização com o navegador serão liberados em uma
                    etapa futura.
                  </p>
                  <Link
                    to="/studio/integracoes"
                    onClick={() => setConnectOpen(false)}
                    className="inline-flex items-center justify-center w-full h-9 px-3 text-xs font-medium text-[#172033] bg-[#F5F7FA] hover:bg-[#E2E8F0]/70 border border-[#E2E8F0] rounded-lg transition-colors"
                  >
                    Ver detalhes em Integrações
                  </Link>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((prev) => !prev);
                  setConnectOpen(false);
                }}
                aria-expanded={profileMenuOpen}
                aria-label="Abrir menu da conta"
                className="flex items-center gap-2.5 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-lg hover:bg-[#F5F7FA] transition-colors cursor-pointer"
              >
                <UserAvatar
                  name={displayName}
                  photoURL={photoURL}
                  tone={avatarTone}
                  size="sm"
                />
                <div className="hidden sm:block text-left min-w-0 max-w-[150px]">
                  <p className="text-xs font-semibold text-[#172033] truncate leading-tight">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate leading-tight mt-0.5">
                    {studioName}
                  </p>
                </div>
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-md py-2 z-50"
                >
                  <div className="px-4 py-2.5 border-b border-[#E2E8F0]">
                    <p className="text-sm font-semibold text-[#172033] truncate">{displayName}</p>
                    <p className="text-xs text-[#64748B] truncate">{user?.email}</p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to="/studio/configuracoes"
                      onClick={() => setProfileMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#172033] hover:bg-[#F5F7FA] rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#64748B]" />
                      Configurações da conta
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void handleSignOut()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#F43F5E] hover:bg-[#F43F5E]/8 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Viewport Content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Dedicated Mobile Bottom Navigation (compact 56px, thumb-friendly) */}
      <nav
        aria-label="Navegação rápida mobile"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-white border-t border-[#E2E8F0] grid grid-cols-5"
      >
        <NavLink
          to="/studio"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[#2563EB]' : 'text-[#64748B]'
            }`
          }
        >
          <LayoutDashboard className="w-[18px] h-[18px]" />
          <span className="truncate max-w-[64px]">Início</span>
        </NavLink>
        <NavLink
          to="/studio/novelas"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[#2563EB]' : 'text-[#64748B]'
            }`
          }
        >
          <Film className="w-[18px] h-[18px]" />
          <span className="truncate max-w-[64px]">Novelas</span>
        </NavLink>
        <NavLink
          to="/studio/personagens"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[#2563EB]' : 'text-[#64748B]'
            }`
          }
        >
          <Users className="w-[18px] h-[18px]" />
          <span className="truncate max-w-[64px]">Recursos</span>
        </NavLink>
        <NavLink
          to="/studio/configuracoes"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[#2563EB]' : 'text-[#64748B]'
            }`
          }
        >
          <Settings className="w-[18px] h-[18px]" />
          <span className="truncate max-w-[64px]">Conta</span>
        </NavLink>
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#64748B] hover:text-[#172033] cursor-pointer"
        >
          <Menu className="w-[18px] h-[18px]" />
          <span>Menu</span>
        </button>
      </nav>

      {/* Mobile Full Navigation Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#172033]/40 backdrop-blur-[1px]"
            aria-hidden="true"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-xl z-10">
            <div className="h-14 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <BrandLogo />
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Fechar menu"
                className="w-10 h-10 -mr-1 rounded-lg inline-flex items-center justify-center text-[#64748B] hover:text-[#172033] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#FAFBFD] flex items-center gap-3">
              <UserAvatar
                name={displayName}
                photoURL={photoURL}
                tone={avatarTone}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#172033] truncate">{studioName}</p>
                <p className="text-xs text-[#64748B] truncate">{displayName}</p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
              {NAV_GROUPS.map((groupName) => {
                const items = STUDIO_NAVIGATION.filter((item) => item.group === groupName);
                return (
                  <div key={groupName}>
                    <p className="px-2.5 mb-1.5 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
                      {groupName}
                    </p>
                    <ul className="space-y-0.5">
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.id}>
                            <NavLink
                              to={item.path}
                              end={item.path === '/studio'}
                              onClick={() => setMobileDrawerOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center justify-between px-3 min-h-[44px] rounded-lg text-sm transition-colors ${
                                  isActive
                                    ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold'
                                    : item.availableInStage1
                                      ? 'text-[#172033] hover:bg-[#F5F7FA] font-medium'
                                      : 'text-[#64748B] hover:bg-[#F5F7FA]'
                                }`
                              }
                            >
                              <span className="flex items-center gap-3 min-w-0">
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="truncate">{item.label}</span>
                              </span>
                              {!item.availableInStage1 && (
                                <span className="text-[11px] text-[#64748B]/80 shrink-0 ml-2">
                                  Em breve
                                </span>
                              )}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>

            <div className="p-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#F43F5E] bg-[#F43F5E]/6 hover:bg-[#F43F5E]/12 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
