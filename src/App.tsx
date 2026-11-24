import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  EmailVerificationRoute,
  OnboardingRoute,
  ProtectedRoute,
  PublicAuthRoute,
} from './components/RouteGuards';
import { AuthProvider } from './contexts/AuthContext';
import { StudioLayout } from './layouts/StudioLayout';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { FutureModulePage } from './pages/studio/FutureModulePage';
import { OverviewPage } from './pages/studio/OverviewPage';
import { SettingsPage } from './pages/studio/SettingsPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Commercial Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Authentication Routes (Redirect if signed in) */}
            <Route
              path="/entrar"
              element={
                <PublicAuthRoute>
                  <LoginPage />
                </PublicAuthRoute>
              }
            />
            <Route
              path="/cadastro"
              element={
                <PublicAuthRoute>
                  <SignupPage />
                </PublicAuthRoute>
              }
            />
            <Route
              path="/recuperar-senha"
              element={
                <PublicAuthRoute>
                  <ForgotPasswordPage />
                </PublicAuthRoute>
              }
            />

            {/* Email Verification Gate */}
            <Route
              path="/verificar-email"
              element={
                <EmailVerificationRoute>
                  <VerifyEmailPage />
                </EmailVerificationRoute>
              }
            />

            {/* One-Time Initial Studio Onboarding */}
            <Route
              path="/configuracao-inicial"
              element={
                <OnboardingRoute>
                  <OnboardingPage />
                </OnboardingRoute>
              }
            />

            {/* Protected Internal Studio Shell */}
            <Route
              path="/studio"
              element={
                <ProtectedRoute>
                  <StudioLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="novelas" element={<FutureModulePage moduleId="minhas-novelas" />} />
              <Route path="producao" element={<FutureModulePage moduleId="central-de-producao" />} />
              <Route path="publicacoes" element={<FutureModulePage moduleId="publicacoes" />} />
              <Route path="personagens" element={<FutureModulePage moduleId="personagens" />} />
              <Route path="cenarios" element={<FutureModulePage moduleId="cenarios" />} />
              <Route path="biblioteca" element={<FutureModulePage moduleId="biblioteca" />} />
              <Route path="integracoes" element={<FutureModulePage moduleId="integracoes" />} />
              <Route path="armazenamento" element={<FutureModulePage moduleId="armazenamento" />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </Route>

            {/* SPA Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
