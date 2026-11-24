import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import {
  createUserStudioProfile,
  getUserStudioProfile,
  subscribeUserStudioProfile,
  updateUserStudioProfile,
} from '../lib/studioService';
import type {
  AuthProviderType,
  CreateStudioProfileInput,
  UpdateStudioProfileInput,
  UserStudioProfile,
} from '../types/studio';

interface AuthContextValue {
  user: User | null;
  profile: UserStudioProfile | null;
  loading: boolean;
  profileLoading: boolean;
  isConfigured: boolean;
  authProvider: AuthProviderType;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  sendResetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshCurrentUser: () => Promise<boolean>;
  completeOnboarding: (input: Omit<CreateStudioProfileInput, 'provider'>) => Promise<void>;
  updateStudioProfile: (input: UpdateStudioProfileInput) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function detectAuthProvider(user: User | null): AuthProviderType {
  if (!user) return 'password';
  const hasGoogle = user.providerData.some((p) => p.providerId === 'google.com');
  return hasGoogle ? 'google' : 'password';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserStudioProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [authVersion, setAuthVersion] = useState<number>(0);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setProfileLoading(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    if (!user.emailVerified) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    let active = true;

    const unsubscribe = subscribeUserStudioProfile(
      user.uid,
      (docProfile) => {
        if (!active) return;
        setProfile(docProfile);
        setProfileLoading(false);
      },
      () => {
        if (!active) return;
        setProfileLoading(false);
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, user?.emailVerified, authVersion]);

  const ensureAuthReady = useCallback(() => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'O Firebase ainda não foi configurado em src/lib/firebase.ts. Preencha a configuração pública do seu projeto Firebase para autenticar.'
      );
    }
    return auth;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const firebaseAuth = ensureAuthReady();
    await signInWithPopup(firebaseAuth, googleProvider);
  }, [ensureAuthReady]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const firebaseAuth = ensureAuthReady();
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    },
    [ensureAuthReady]
  );

  const signUpWithEmail = useCallback(
    async (name: string, email: string, password: string) => {
      const firebaseAuth = ensureAuthReady();
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const trimmedName = name.trim();
      if (trimmedName) {
        await updateProfile(credential.user, { displayName: trimmedName });
      }
      await sendEmailVerification(credential.user);
      setAuthVersion((v) => v + 1);
    },
    [ensureAuthReady]
  );

  const sendResetPassword = useCallback(
    async (email: string) => {
      const firebaseAuth = ensureAuthReady();
      await sendPasswordResetEmail(firebaseAuth, email.trim());
    },
    [ensureAuthReady]
  );

  const resendVerificationEmail = useCallback(async () => {
    const firebaseAuth = ensureAuthReady();
    if (!firebaseAuth.currentUser) {
      throw new Error('Nenhuma conta autenticada encontrada.');
    }
    await sendEmailVerification(firebaseAuth.currentUser);
  }, [ensureAuthReady]);

  const refreshCurrentUser = useCallback(async (): Promise<boolean> => {
    const firebaseAuth = ensureAuthReady();
    if (!firebaseAuth.currentUser) return false;
    await firebaseAuth.currentUser.reload();
    await firebaseAuth.currentUser.getIdToken(true);
    const refreshed = firebaseAuth.currentUser;
    setUser(refreshed);
    setAuthVersion((v) => v + 1);
    if (refreshed.emailVerified) {
      const fetched = await getUserStudioProfile(refreshed.uid);
      setProfile(fetched);
    }
    return Boolean(refreshed.emailVerified);
  }, [ensureAuthReady]);

  const completeOnboarding = useCallback(
    async (input: Omit<CreateStudioProfileInput, 'provider'>) => {
      const firebaseAuth = ensureAuthReady();
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('Sessão inválida. Entre novamente para concluir a configuração.');
      }

      const provider = detectAuthProvider(currentUser);
      await createUserStudioProfile(currentUser.uid, currentUser.email, {
        ...input,
        provider,
      });

      const nextPhoto = input.photoURL?.trim() || currentUser.photoURL || null;
      await updateProfile(currentUser, {
        displayName: input.displayName.trim(),
        photoURL: nextPhoto,
      });
      setAuthVersion((v) => v + 1);
    },
    [ensureAuthReady]
  );

  const handleUpdateStudioProfile = useCallback(
    async (input: UpdateStudioProfileInput) => {
      const firebaseAuth = ensureAuthReady();
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        throw new Error('Sessão inválida.');
      }
      await updateUserStudioProfile(currentUser.uid, input);
      await updateProfile(currentUser, {
        displayName: input.displayName.trim(),
        photoURL: input.photoURL.trim() || null,
      });
      setAuthVersion((v) => v + 1);
    },
    [ensureAuthReady]
  );

  const signOutUser = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
    setProfile(null);
  }, []);

  const authProvider = useMemo(() => detectAuthProvider(user), [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      profileLoading,
      isConfigured: isFirebaseConfigured,
      authProvider,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      sendResetPassword,
      resendVerificationEmail,
      refreshCurrentUser,
      completeOnboarding,
      updateStudioProfile: handleUpdateStudioProfile,
      signOutUser,
    }),
    [
      user,
      profile,
      loading,
      profileLoading,
      authProvider,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      sendResetPassword,
      resendVerificationEmail,
      refreshCurrentUser,
      completeOnboarding,
      handleUpdateStudioProfile,
      signOutUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return ctx;
}
