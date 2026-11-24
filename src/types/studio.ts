import type { Timestamp } from 'firebase/firestore';

/* ============================================================================
 * ETAPA 1 — ACTIVE DOMAIN TYPES (Auth, Studio Profile, Onboarding, Activities)
 * ============================================================================ */

export type AvatarTone = 'blue' | 'sky' | 'slate' | 'emerald' | 'amber';
export type AuthProviderType = 'google' | 'password';
export type StudioActivityType = 'studio_created' | 'profile_updated' | 'account_verified';

export interface UserStudioProfile {
  uid: string;
  email: string;
  displayName: string;
  studioName: string;
  studioBio: string;
  photoURL: string;
  avatarTone: AvatarTone;
  onboardingCompleted: boolean;
  onboardingSkippedOptionals: boolean;
  provider: AuthProviderType;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface StudioActivity {
  id: string;
  uid: string;
  type: StudioActivityType;
  title: string;
  description: string;
  createdAt: Timestamp | null;
}

export interface CreateStudioProfileInput {
  displayName: string;
  studioName: string;
  studioBio?: string;
  photoURL?: string;
  avatarTone?: AvatarTone;
  onboardingSkippedOptionals: boolean;
  provider: AuthProviderType;
}

export interface UpdateStudioProfileInput {
  displayName: string;
  studioName: string;
  studioBio: string;
  photoURL: string;
  avatarTone: AvatarTone;
}

/* ============================================================================
 * PREPARED ARCHITECTURE FOR FUTURE STAGES (ETAPA 2+)
 * Strictly typed contracts — no active CRUD or mock data in Stage 1.
 * ============================================================================ */

export type ProductionMode = 'manual' | 'custom_drama' | 'viral_auto';

export interface ReferenceImageAsset {
  id: string;
  storagePath: string;
  downloadUrl: string;
  caption: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface WardrobeItem {
  id: string;
  label: string;
  promptSnippet: string;
  referenceImageId?: string;
}

export interface CharacterBibleEntry {
  id: string;
  uid: string;
  name: string;
  fruitSpecies: string;
  roleSummary: string;
  anchorPrompt: string;
  wardrobe: WardrobeItem[];
  referenceImages: ReferenceImageAsset[];
}

export interface ScenarioAsset {
  id: string;
  uid: string;
  name: string;
  lightingMood: string;
  environmentPrompt: string;
  referenceImages: ReferenceImageAsset[];
}

export interface SceneUnit {
  id: string;
  orderIndex: number;
  heading: string;
  visualDirection: string;
  dialogue: string;
  durationSeconds: number;
  characterIds: string[];
  scenarioId?: string;
}

export interface EpisodeUnit {
  id: string;
  novelId: string;
  seasonId?: string;
  number: number;
  title: string;
  isSpecialVideo: boolean;
  status: 'draft' | 'scripting' | 'in_production' | 'ready' | 'published';
  scenes: SceneUnit[];
}

export interface SeasonUnit {
  id: string;
  novelId: string;
  number: number;
  title: string;
}

export interface NarrativeMemorySnapshot {
  novelId: string;
  canonFacts: string[];
  activePlotThreads: string[];
  lastUpdatedEpisodeId?: string;
}

export interface NovelProject {
  id: string;
  uid: string;
  title: string;
  synopsis: string;
  productionMode: ProductionMode;
  customCreativePrompt?: string;
  hasSeasons: boolean;
  coverAssetId?: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
}

export interface VersionHistoryEntry {
  id: string;
  entityType: 'novel' | 'episode' | 'scene' | 'character';
  entityId: string;
  summary: string;
  createdAt: string;
}

export interface PublicationScheduleItem {
  id: string;
  episodeId: string;
  channel: string;
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'cancelled';
}

export interface StorageQuotaSpec {
  usedBytes: number;
  limitBytes: number;
  bucketConfigured: boolean;
}

export interface ConnectExtensionBridgeState {
  installed: boolean;
  connected: boolean;
  manifestVersion: 'v3';
  statusLabel: 'Não implementado';
}
