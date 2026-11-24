import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreError';
import type {
  AvatarTone,
  CreateStudioProfileInput,
  StudioActivity,
  StudioActivityType,
  UpdateStudioProfileInput,
  UserStudioProfile,
} from '../types/studio';

export const PROFILE_LIMITS = {
  displayNameMin: 2,
  displayNameMax: 80,
  studioNameMin: 2,
  studioNameMax: 100,
  studioBioMax: 400,
  photoUrlMax: 500,
} as const;

const VALID_AVATAR_TONES: readonly AvatarTone[] = ['blue', 'sky', 'slate', 'emerald', 'amber'];

function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function sanitizePhotoUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (!trimmed.startsWith('https://')) {
    return '';
  }
  return trimmed.slice(0, PROFILE_LIMITS.photoUrlMax);
}

function sanitizeAvatarTone(tone?: AvatarTone): AvatarTone {
  if (tone && VALID_AVATAR_TONES.includes(tone)) {
    return tone;
  }
  return 'blue';
}

function createActivityId(): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : Math.random().toString(36).slice(2, 14);
  return `act_${Date.now()}_${randomPart}`;
}

export async function getUserStudioProfile(uid: string): Promise<UserStudioProfile | null> {
  if (!db) return null;
  const path = `users/${uid}`;
  try {
    const snapshot = await getDoc(doc(db, 'users', uid));
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as UserStudioProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeUserStudioProfile(
  uid: string,
  onData: (profile: UserStudioProfile | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    onData(null);
    return () => {};
  }
  const path = `users/${uid}`;
  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }
      onData(snapshot.data() as UserStudioProfile);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function createUserStudioProfile(
  uid: string,
  email: string,
  input: CreateStudioProfileInput
): Promise<void> {
  if (!db) {
    throw new Error('Firebase não inicializado.');
  }

  const displayName = sanitizeText(input.displayName, PROFILE_LIMITS.displayNameMax);
  const studioName = sanitizeText(input.studioName, PROFILE_LIMITS.studioNameMax);
  const studioBio = sanitizeText(input.studioBio ?? '', PROFILE_LIMITS.studioBioMax);
  const photoURL = sanitizePhotoUrl(input.photoURL);
  const avatarTone = sanitizeAvatarTone(input.avatarTone);

  if (displayName.length < PROFILE_LIMITS.displayNameMin) {
    throw new Error('O nome de exibição precisa ter pelo menos 2 caracteres.');
  }
  if (studioName.length < PROFILE_LIMITS.studioNameMin) {
    throw new Error('O nome do estúdio precisa ter pelo menos 2 caracteres.');
  }

  const path = `users/${uid}`;
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      email: sanitizeText(email, 254),
      displayName,
      studioName,
      studioBio,
      photoURL,
      avatarTone,
      onboardingCompleted: true,
      onboardingSkippedOptionals: Boolean(input.onboardingSkippedOptionals),
      provider: input.provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  await recordStudioActivity(
    uid,
    'studio_created',
    'Estúdio configurado',
    `Estúdio "${studioName}" inicializado na Etapa 1.`
  );
}

export async function updateUserStudioProfile(
  uid: string,
  input: UpdateStudioProfileInput
): Promise<void> {
  if (!db) {
    throw new Error('Firebase não inicializado.');
  }

  const displayName = sanitizeText(input.displayName, PROFILE_LIMITS.displayNameMax);
  const studioName = sanitizeText(input.studioName, PROFILE_LIMITS.studioNameMax);
  const studioBio = sanitizeText(input.studioBio, PROFILE_LIMITS.studioBioMax);
  const photoURL = sanitizePhotoUrl(input.photoURL);
  const avatarTone = sanitizeAvatarTone(input.avatarTone);

  if (displayName.length < PROFILE_LIMITS.displayNameMin) {
    throw new Error('O nome de exibição precisa ter pelo menos 2 caracteres.');
  }
  if (studioName.length < PROFILE_LIMITS.studioNameMin) {
    throw new Error('O nome do estúdio precisa ter pelo menos 2 caracteres.');
  }

  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      displayName,
      studioName,
      studioBio,
      photoURL,
      avatarTone,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  await recordStudioActivity(
    uid,
    'profile_updated',
    'Configurações do estúdio atualizadas',
    `Perfil de "${studioName}" salvo no Cloud Firestore.`
  );
}

export async function recordStudioActivity(
  uid: string,
  type: StudioActivityType,
  title: string,
  description: string
): Promise<void> {
  if (!db) return;
  const activityId = createActivityId();
  const path = `users/${uid}/activities/${activityId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'activities', activityId), {
      uid,
      type,
      title: sanitizeText(title, 120),
      description: sanitizeText(description, 240),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeStudioActivities(
  uid: string,
  onData: (activities: StudioActivity[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    onData([]);
    return () => {};
  }
  const path = `users/${uid}/activities`;
  const q = query(
    collection(db, 'users', uid, 'activities'),
    where('uid', '==', uid),
    limit(20)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: StudioActivity[] = snapshot.docs
        .map((item) => {
          const data = item.data();
          return {
            id: item.id,
            uid: data.uid,
            type: data.type,
            title: data.title,
            description: data.description,
            createdAt: data.createdAt ?? null,
          };
        })
        .sort((a, b) => {
          const timeA = a.createdAt ? a.createdAt.toMillis() : Number.MAX_SAFE_INTEGER;
          const timeB = b.createdAt ? b.createdAt.toMillis() : Number.MAX_SAFE_INTEGER;
          return timeB - timeA;
        })
        .slice(0, 10);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}
