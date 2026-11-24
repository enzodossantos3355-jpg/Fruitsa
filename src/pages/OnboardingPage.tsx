import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Check, Loader2, LogOut } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { UserAvatar } from '../components/UserAvatar';
import { useAuth } from '../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../lib/firebaseErrors';
import { PROFILE_LIMITS } from '../lib/studioService';
import type { AvatarTone } from '../types/studio';

const AVATAR_TONES: Array<{ value: AvatarTone; label: string; swatch: string }> = [
  { value: 'blue', label: 'Azul principal', swatch: 'bg-[#2563EB]' },
  { value: 'sky', label: 'Azul celeste', swatch: 'bg-[#0EA5E9]' },
  { value: 'slate', label: 'Grafite cinema', swatch: 'bg-[#172033]' },
  { value: 'emerald', label: 'Verde estúdio', swatch: 'bg-[#10B981]' },
  { value: 'amber', label: 'Âmbar quente', swatch: 'bg-[#F59E0B]' },
];

export const OnboardingPage: React.FC = () => {
  const { user, completeOnboarding, signOutUser } = useAuth();
  const [studioName, setStudioName] = useState('');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [avatarTone, setAvatarTone] = useState<AvatarTone>('blue');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateRequiredFields = (): string | null => {
    if (studioName.trim().length < PROFILE_LIMITS.studioNameMin) {
      return 'Informe o nome do seu estúdio (mínimo de 2 caracteres).';
    }
    if (displayName.trim().length < PROFILE_LIMITS.displayNameMin) {
      return 'Informe seu nome de exibição (mínimo de 2 caracteres).';
    }
    return null;
  };

  const handleComplete = async (skipOptionals: boolean) => {
    setError(null);
    const validationError = validateRequiredFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmedPhoto = skipOptionals ? '' : photoURL.trim();
    if (!skipOptionals && trimmedPhoto && !trimmedPhoto.startsWith('https://')) {
      setError('A URL da foto de perfil deve começar com https:// ou ficar em branco.');
      return;
    }

    setSubmitting(true);
    try {
      await completeOnboarding({
        studioName: studioName.trim(),
        displayName: displayName.trim(),
        photoURL: trimmedPhoto,
        avatarTone: skipOptionals ? 'blue' : avatarTone,
        studioBio: '',
        onboardingSkippedOptionals: skipOptionals,
      });
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void handleComplete(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <BrandLogo />
          <button
            type="button"
            onClick={() => void signOutUser()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#172033] transition-colors py-2 px-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="mb-7">
            <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase mb-2">
              Configuração inicial
            </p>
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#172033] mb-1.5">
              Prepare a identidade do seu estúdio
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Defina as informações básicas do seu espaço de trabalho. Você poderá editar estes
              dados a qualquer momento nas configurações.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-lg bg-[#F43F5E]/8 border border-[#F43F5E]/25 text-xs text-[#172033] flex items-start gap-2.5 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Required Studio Identity */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="onboarding-studio-name"
                  className="block text-sm font-medium text-[#172033] mb-1.5"
                >
                  Nome do estúdio <span className="text-[#F43F5E]">*</span>
                </label>
                <input
                  id="onboarding-studio-name"
                  type="text"
                  required
                  maxLength={PROFILE_LIMITS.studioNameMax}
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  placeholder="Ex.: Estúdio Pomar Criativo"
                  disabled={submitting}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg placeholder:text-[#64748B]/70 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="onboarding-display-name"
                  className="block text-sm font-medium text-[#172033] mb-1.5"
                >
                  Nome de exibição <span className="text-[#F43F5E]">*</span>
                </label>
                <input
                  id="onboarding-display-name"
                  type="text"
                  required
                  maxLength={PROFILE_LIMITS.displayNameMax}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Seu nome como diretor ou criador"
                  disabled={submitting}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg placeholder:text-[#64748B]/70 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Optional Profile Visual */}
            <div className="pt-5 border-t border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#172033]">Foto de perfil</p>
                <span className="text-xs text-[#64748B]">Opcional</span>
              </div>

              <div className="flex items-center gap-4">
                <UserAvatar
                  name={displayName || studioName || user?.email}
                  photoURL={photoURL}
                  tone={avatarTone}
                  size="xl"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    id="onboarding-photo-url"
                    type="url"
                    maxLength={PROFILE_LIMITS.photoUrlMax}
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://... (opcional)"
                    disabled={submitting}
                    className="w-full min-h-[42px] px-3 py-2 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg placeholder:text-[#64748B]/70 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-[#64748B]">
                    Informe um link HTTPS ou utilize o monograma colorido abaixo. O envio direto de
                    arquivos será habilitado com o módulo de armazenamento em etapa futura.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[#64748B] mb-2">
                  Cor do monograma (quando sem foto)
                </p>
                <div className="flex items-center gap-2.5">
                  {AVATAR_TONES.map((tone) => {
                    const selected = avatarTone === tone.value;
                    return (
                      <button
                        key={tone.value}
                        type="button"
                        onClick={() => setAvatarTone(tone.value)}
                        aria-label={tone.label}
                        aria-pressed={selected}
                        className={`w-9 h-9 rounded-lg ${tone.swatch} inline-flex items-center justify-center transition-transform cursor-pointer ${
                          selected ? 'ring-2 ring-offset-2 ring-[#2563EB]' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        {selected && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={() => void handleComplete(true)}
                disabled={submitting}
                className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-[#64748B] hover:text-[#172033] hover:bg-[#F5F7FA] rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
              >
                Pular opcionais
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>{submitting ? 'Salvando estúdio...' : 'Concluir configuração'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
