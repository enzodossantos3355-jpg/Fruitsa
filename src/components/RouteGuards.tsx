import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FullScreenLoader: React.FC<{ label?: string }> = ({ label = 'Carregando estúdio...' }) => (
  <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center gap-3 p-6">
    <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
    <p className="text-sm text-[#64748B] font-medium">{label}</p>
  </div>
);

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || (user && user.emailVerified && profileLoading)) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location.pathname }} replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verificar-email" replace />;
  }

  if (!profile?.onboardingCompleted) {
    return <Navigate to="/configuracao-inicial" replace />;
  }

  return <>{children}</>;
};

export const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || (user && user.emailVerified && profileLoading)) {
    return <FullScreenLoader label="Verificando dados do estúdio..." />;
  }

  if (!user) {
    return <Navigate to="/entrar" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verificar-email" replace />;
  }

  if (profile?.onboardingCompleted) {
    return <Navigate to="/studio" replace />;
  }

  return <>{children}</>;
};

export const EmailVerificationRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || (user && user.emailVerified && profileLoading)) {
    return <FullScreenLoader label="Verificando sessão..." />;
  }

  if (!user) {
    return <Navigate to="/entrar" replace />;
  }

  if (user.emailVerified) {
    return <Navigate to={profile?.onboardingCompleted ? '/studio' : '/configuracao-inicial'} replace />;
  }

  return <>{children}</>;
};

export const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || (user && user.emailVerified && profileLoading)) {
    return <FullScreenLoader label="Verificando autenticação..." />;
  }

  if (user) {
    if (!user.emailVerified) {
      return <Navigate to="/verificar-email" replace />;
    }
    if (!profile?.onboardingCompleted) {
      return <Navigate to="/configuracao-inicial" replace />;
    }
    return <Navigate to="/studio" replace />;
  }

  return <>{children}</>;
};
