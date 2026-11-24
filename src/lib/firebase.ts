import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  type Auth,
} from 'firebase/auth';
import {
  doc,
  getDocFromServer,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

/**
 * Configuração pública do Firebase Web centralizada para o frontend.
 * Permite operação direta como Static Site (incluindo Render) sem exigir
 * variáveis de ambiente adicionais para chaves públicas do Firebase Web.
 *
 * Nenhuma credencial administrativa, chave privada ou conta de serviço
 * deve ser adicionada a este arquivo.
 */
export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
}

export const firebaseConfig: FirebaseWebConfig = {
  apiKey: firebaseAppletConfig.apiKey,
  authDomain: firebaseAppletConfig.authDomain,
  projectId: firebaseAppletConfig.projectId,
  storageBucket: firebaseAppletConfig.storageBucket,
  messagingSenderId: firebaseAppletConfig.messagingSenderId,
  appId: firebaseAppletConfig.appId,
  firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId || undefined,
};

function hasValidValue(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim();
  if (normalized.length === 0) return false;
  if (normalized.startsWith('YOUR_') || normalized.startsWith('MY_')) return false;
  if (normalized === 'remixed-project-id') return false;
  return true;
}

export const isFirebaseConfigured: boolean =
  hasValidValue(firebaseConfig.apiKey) &&
  hasValidValue(firebaseConfig.authDomain) &&
  hasValidValue(firebaseConfig.projectId) &&
  hasValidValue(firebaseConfig.appId);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firestoreDb: Firestore | null = null;

if (isFirebaseConfigured) {
  firebaseApp =
    getApps().length > 0
      ? getApp()
      : initializeApp({
          apiKey: firebaseConfig.apiKey,
          authDomain: firebaseConfig.authDomain,
          projectId: firebaseConfig.projectId,
          storageBucket: firebaseConfig.storageBucket,
          messagingSenderId: firebaseConfig.messagingSenderId,
          appId: firebaseConfig.appId,
        });

  firebaseAuth = getAuth(firebaseApp);
  firebaseAuth.languageCode = 'pt-BR';

  // Persistência local segura da sessão autenticada
  setPersistence(firebaseAuth, browserLocalPersistence).catch((err) => {
    console.error('Falha ao configurar persistência de sessão do Firebase Auth:', err);
  });

  firestoreDb = firebaseConfig.firestoreDatabaseId
    ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
    : getFirestore(firebaseApp);
}

export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firestoreDb;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

async function testFirestoreConnection(): Promise<void> {
  if (!firestoreDb) return;
  try {
    await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error(
        'Não foi possível conectar ao Cloud Firestore. Verifique a configuração pública do projeto Firebase em src/lib/firebase.ts.'
      );
    }
  }
}

if (typeof window !== 'undefined' && firestoreDb) {
  void testFirestoreConnection();
}
