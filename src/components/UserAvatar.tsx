import React, { useState, useEffect } from 'react';
import type { AvatarTone } from '../types/studio';

interface UserAvatarProps {
  name?: string | null;
  photoURL?: string | null;
  tone?: AvatarTone;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const TONE_CLASSES: Record<AvatarTone, string> = {
  blue: 'bg-[#2563EB] text-white',
  sky: 'bg-[#0EA5E9] text-white',
  slate: 'bg-[#172033] text-white',
  emerald: 'bg-[#10B981] text-white',
  amber: 'bg-[#F59E0B] text-white',
};

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

function getInitials(name?: string | null): string {
  if (!name) return 'FS';
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'FS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  photoURL,
  tone = 'blue',
  size = 'md',
  className = '',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [photoURL]);

  const validPhoto = Boolean(photoURL && photoURL.trim().startsWith('https://') && !imageFailed);

  if (validPhoto && photoURL) {
    return (
      <img
        src={photoURL}
        alt={name ? `Foto de perfil de ${name}` : 'Foto de perfil'}
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
        className={`${SIZE_CLASSES[size]} rounded-lg object-cover border border-[#E2E8F0] shrink-0 bg-[#F5F7FA] ${className}`}
      />
    );
  }

  return (
    <span
      aria-label={name ? `Iniciais de ${name}` : 'Avatar do estúdio'}
      className={`${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]} rounded-lg font-semibold inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {getInitials(name)}
    </span>
  );
};
