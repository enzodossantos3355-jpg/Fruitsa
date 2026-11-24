import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { app, firebaseConfig } from './firebase';

/**
 * Arquitetura preparada para Firebase Storage (Etapas futuras).
 * O serviço não é ativado automaticamente nem executa uploads nesta Etapa 1,
 * evitando custos ou ativação involuntária de recursos pagos.
 */
let storageInstance: FirebaseStorage | null = null;

export const STORAGE_PATHS = {
  userAvatar: (uid: string) => `users/${uid}/profile/avatar`,
  characterReference: (uid: string, characterId: string, fileName: string) =>
    `users/${uid}/characters/${characterId}/references/${fileName}`,
  scenarioReference: (uid: string, scenarioId: string, fileName: string) =>
    `users/${uid}/scenarios/${scenarioId}/references/${fileName}`,
  episodeCover: (uid: string, novelId: string, episodeId: string) =>
    `users/${uid}/novels/${novelId}/episodes/${episodeId}/cover`,
  exportArchive: (uid: string, novelId: string, archiveName: string) =>
    `users/${uid}/exports/${novelId}/${archiveName}`,
} as const;

export function isStorageBucketConfigured(): boolean {
  return Boolean(firebaseConfig.storageBucket && firebaseConfig.storageBucket.trim().length > 0);
}

export function getPreparedStorage(): FirebaseStorage | null {
  if (!app || !isStorageBucketConfigured()) {
    return null;
  }
  if (!storageInstance) {
    storageInstance = getStorage(app);
  }
  return storageInstance;
}
