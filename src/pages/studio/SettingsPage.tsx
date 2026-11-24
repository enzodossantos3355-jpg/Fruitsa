import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  KeyRound,
  Loader2,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { UserAvatar } from '../../components/UserAvatar';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../../lib/firebaseErrors';
import { PROFILE_LIMITS } from '../../lib/studioService';
import type { AvatarTone } from '../../types/studio';

const AVATAR_TONES: Array<{ value: AvatarTone; label: string; swatch: string }> = [
  { value: 'blue', label: 'Azul principal', swatch: 'bg-[#2563EB]' },
  { value: 'sky', label: 'Azul celeste', swatch: 'bg-[#0EA5E9]' },
  { value: 'slate', label: 'Grafite cinema', swatch: 'bg-[#172033]' },
  { value: 'emerald', label: 'Verde estúdio', swatch: 'bg-[#10B981]' },
  { value: 'amber', label: 'Âmbar quente', swatch: 'bg-[#F59E0B]' },
];

export const SettingsPage: React.FC = () => {
  const { user, profile, authProvider, updateStudioProfile, sendResetPassword, signOutUser } =
    useAuth();
  const navigate = useNavigate();

  const [studioName, setStudioName] = useState(profile?.studioName || '');
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [studioBio, setStudioBio] = useState(profile?.studioBio || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [avatarTone, setAvatarTone] = useState<AvatarTone>(profile?.avatarTone || 'blue');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setStudioName(profile.studioName);
    setDisplayName(profile.displayName);
    setStudioBio(profile.studioBio || '');
    setPhotoURL(profile.photoURL || '');
    setAvatarTone(profile.avatarTone || 'blue');
  }, [profile]);

  const hasChanges =
    studioName.trim() !== (profile?.studioName || '') ||
    displayName.trim() !== (profile?.displayName || '') ||
    studioBio.trim() !== (profile?.studioBio || '') ||
    photoURL.trim() !== (profile?.photoURL || '') ||
    avatarTone !== (profile?.avatarTone || 'blue');

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    if (studioName.trim().length < PROFILE_LIMITS.studioNameMin) {
      setSaveError('O nome do estúdio precisa ter pelo menos 2 caracteres.');
      return;
    }
    if (displayName.trim().length < PROFILE_LIMITS.displayNameMin) {
      setSaveError('O nome de exibição precisa ter pelo menos 2 caracteres.');
      return;
    }
    if (photoURL.trim() && !photoURL.trim().startsWith('https://')) {
      setSaveError('A URL da foto de perfil deve começar com https:// ou ficar vazia.');
      return;
    }

    setSaving(true);
    try {
      await updateStudioProfile({
        studioName: studioName.trim(),
        displayName: displayName.trim(),
        studioBio: studioBio.trim(),
        photoURL: photoURL.trim(),
        avatarTone,
      });
      setSaveSuccess('As informações do estúdio foram atualizadas com sucesso.');
    } catch (err) {
      setSaveError(getFirebaseErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetError(null);
    setResetMessage(null);
    setResetLoading(true);
    try {
      await sendResetPassword(user.email);
      setResetMessage(`Enviamos um link de redefinição de senha para ${user.email}.`);
    } catch (err) {
      setResetError(getFirebaseErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/entrar', { replace: true });
  };

  return (
    <div className="max-w-3xl space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#172033]">
          Configurações da conta e do estúdio
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          Gerencie a identidade pública do seu estúdio e os dados de segurança da sua conta.
        </p>
      </div>

      {/* Studio Profile Form */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-[#172033]">Identidade do estúdio</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Informações persistidas no Cloud Firestore e associadas exclusivamente à sua conta.
          </p>
        </div>

        <form onSubmit={handleSave} noValidate className="p-6 space-y-5">
          {saveError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-[#F43F5E]/8 border border-[#F43F5E]/25 text-xs text-[#172033] flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" />
              <span>{saveError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 text-xs text-[#172033] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>{saveSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-studio-name"
                className="block text-sm font-medium text-[#172033] mb-1.5"
              >
                Nome do estúdio
              </label>
              <input
                id="settings-studio-name"
                type="text"
                required
                maxLength={PROFILE_LIMITS.studioNameMax}
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                disabled={saving}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="settings-display-name"
                className="block text-sm font-medium text-[#172033] mb-1.5"
              >
                Nome de exibição
              </label>
              <input
                id="settings-display-name"
                type="text"
                required
                maxLength={PROFILE_LIMITS.displayNameMax}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={saving}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="settings-bio" className="block text-sm font-medium text-[#172033]">
                Descrição do estúdio
              </label>
              <span className="text-xs text-[#64748B] tabular-nums">
                {studioBio.length}/{PROFILE_LIMITS.studioBioMax}
              </span>
            </div>
            <textarea
              id="settings-bio"
              rows={3}
              maxLength={PROFILE_LIMITS.studioBioMax}
              value={studioBio}
              onChange={(e) => setStudioBio(e.target.value)}
              placeholder="Descreva brevemente o foco criativo ou o estilo das suas produções (opcional)."
              disabled={saving}
              className="w-full px-3.5 py-2.5 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg placeholder:text-[#64748B]/70 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <UserAvatar
                name={displayName || studioName}
                photoURL={photoURL}
                tone={avatarTone}
                size="xl"
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="settings-photo-url"
                  className="block text-sm font-medium text-[#172033] mb-1.5"
                >
                  URL da foto de perfil (opcional)
                </label>
                <input
                  id="settings-photo-url"
                  type="url"
                  maxLength={PROFILE_LIMITS.photoUrlMax}
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://..."
                  disabled={saving}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm text-[#172033] bg-white border border-[#E2E8F0] rounded-lg placeholder:text-[#64748B]/70 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#64748B] mb-2">
                Cor do monograma (exibida quando não há foto)
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

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving || !hasChanges}
              className="min-h-[42px] inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{saving ? 'Salvando...' : 'Salvar alterações'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Account & Security Section */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-[#172033]">Conta e segurança</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Credenciais gerenciadas diretamente pelo Firebase Authentication.
          </p>
        </div>

        <div className="p-6 space-y-5">
          <dl className="divide-y divide-[#E2E8F0] text-sm">
            <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <dt className="text-[#64748B]">E-mail da conta</dt>
              <dd className="font-medium text-[#172033] break-all">{user?.email}</dd>
            </div>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <dt className="text-[#64748B]">Método de acesso</dt>
              <dd className="font-medium text-[#172033]">
                {authProvider === 'google' ? 'Conta Google' : 'E-mail e senha'}
              </dd>
            </div>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <dt className="text-[#64748B]">Verificação de e-mail</dt>
              <dd className="inline-flex items-center gap-1.5 font-medium text-[#10B981]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verificado</span>
              </dd>
            </div>
          </dl>

          {resetError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-[#F43F5E]/8 border border-[#F43F5E]/25 text-xs text-[#172033] flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" />
              <span>{resetError}</span>
            </div>
          )}

          {resetMessage && (
            <div className="p-3.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 text-xs text-[#172033] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>{resetMessage}</span>
            </div>
          )}

          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {authProvider === 'password' ? (
              <button
                type="button"
                onClick={() => void handlePasswordReset()}
                disabled={resetLoading}
                className="min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#172033] bg-[#F5F7FA] hover:bg-[#E2E8F0]/60 border border-[#E2E8F0] rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
              >
                {resetLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                ) : (
                  <KeyRound className="w-4 h-4 text-[#64748B]" />
                )}
                <span>Enviar link para redefinir senha</span>
              </button>
            ) : (
              <p className="text-xs text-[#64748B]">
                Sua senha é gerenciada pela sua Conta Google.
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#F43F5E] bg-[#F43F5E]/6 hover:bg-[#F43F5E]/12 border border-[#F43F5E]/20 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Encerrar sessão
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
