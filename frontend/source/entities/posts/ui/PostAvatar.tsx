"use client";

import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import s from "./post.module.scss";

interface PostAvatarProps {
  src: string | null;
  name: string;
  className?: string;
}

/** Фото автора; если его нет или оно не загрузилось — первая буква имени. */
export function PostAvatar({ src, name, className }: PostAvatarProps) {
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);
  const showPhoto = src && src !== brokenSrc;
  const initial = name.charAt(0).toUpperCase();

  return (
    <span className={cn(s.avatar, className)}>
      {showPhoto ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="64px"
          unoptimized
          onError={() => setBrokenSrc(src)}
        />
      ) : (
        <span aria-label={name}>{initial}</span>
      )}
    </span>
  );
}
