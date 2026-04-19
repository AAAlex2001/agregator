"use client";

import { useEffect, useState, type ReactNode } from "react";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { ProfileIcon } from "@/source/shared/ui/icons";
import s from "./UserAvatar.module.scss";

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallback?: ReactNode;
}

export function UserAvatar({
  src,
  alt,
  className = "",
  imageClassName = "",
  fallback,
}: UserAvatarProps) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const imageSrc = src ? resolveFileUrl(src) : "";
  const showImage = Boolean(imageSrc) && !broken;

  return (
    <div className={`${s.avatar} ${className}`.trim()} aria-label={alt}>
      {showImage ? (
        <img
          src={imageSrc}
          alt={alt}
          className={`${s.image} ${imageClassName}`.trim()}
          onError={() => setBroken(true)}
        />
      ) : (
        fallback ?? <ProfileIcon className={s.fallback} />
      )}
    </div>
  );
}