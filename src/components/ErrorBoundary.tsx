import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    let readable = 'Ocorreu uma falha inesperada na interface do estúdio.';
    try {
      const parsed = JSON.parse(error.message);
      if (parsed && typeof parsed.error === 'string') {
        readable = parsed.error.includes('Missing or insufficient permissions')
          ? 'Permissão insuficiente no Cloud Firestore. Verifique se sua conta está autenticada e com e-mail verificado.'
          : parsed.error;
      }
    } catch {
      if (error.message) {
        readable = error.message;
      }
    }
    return { hasError: true, errorMessage: readable };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FruitStudio ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-xs">
            <div className="w-11 h-11 rounded-lg bg-[#F43F5E]/10 text-[#F43F5E] flex items-center justify-center mb-5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold text-[#172033] mb-2">
              Algo interrompeu o carregamento
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed mb-6">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar aplicação
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
