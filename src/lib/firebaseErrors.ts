import { FirebaseError } from 'firebase/app';

export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'E-mail ou senha incorretos. Verifique os dados informados e tente novamente.';
      case 'auth/invalid-email':
        return 'O endereço de e-mail informado não é válido.';
      case 'auth/email-already-in-use':
        return 'Já existe uma conta cadastrada com este e-mail. Tente entrar ou recuperar sua senha.';
      case 'auth/weak-password':
        return 'A senha precisa ter pelo menos 6 caracteres para garantir a segurança da conta.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas em sequência. Aguarde alguns minutos antes de tentar novamente.';
      case 'auth/popup-closed-by-user':
        return 'A janela de login com o Google foi fechada antes da conclusão.';
      case 'auth/popup-blocked':
        return 'O navegador bloqueou a janela do Google. Permita pop-ups para este site e tente novamente.';
      case 'auth/cancelled-popup-request':
        return 'Já existe uma solicitação de login com o Google em andamento.';
      case 'auth/unauthorized-domain':
        return 'Este domínio ainda não está autorizado no Firebase Authentication. Adicione o endereço atual em Authentication > Settings > Authorized domains.';
      case 'auth/operation-not-allowed':
        return 'O login com e-mail e senha ainda não está habilitado no Firebase Console. Ative o provedor em Authentication > Sign-in method.';
      case 'auth/network-request-failed':
        return 'Falha de conexão com o servidor de autenticação. Verifique sua internet e tente novamente.';
      case 'auth/user-disabled':
        return 'Esta conta foi desativada. Entre em contato com o suporte do estúdio.';
      case 'auth/requires-recent-login':
        return 'Por segurança, entre novamente na sua conta para realizar esta operação.';
      case 'permission-denied':
        return 'Permissão insuficiente no Cloud Firestore. Verifique se o seu e-mail foi confirmado e se as regras de segurança estão atualizadas.';
      default:
        return `Não foi possível concluir a solicitação (${error.code}). Tente novamente.`;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Missing or insufficient permissions')) {
      return 'Permissão insuficiente para acessar os dados do estúdio. Confirme se o seu e-mail está verificado.';
    }
    if (error.message.includes('Quota exceeded')) {
      return 'O limite diário gratuito do Cloud Firestore foi atingido. O limite será renovado no próximo ciclo.';
    }
  }

  return 'Ocorreu um erro inesperado. Tente novamente em instantes.';
}
