"use client";

import Image from "next/image";
import cn from "classnames";
import { useState } from "react";
import s from "./post.module.scss";

interface Props {
  src?: string | null;
  name: string;
  className?: string;
}

/** Аватар автора; если фото недоступно, показывает первую букву имени. */
export function PostAvatar({ src, name, className }: Props) {
  return (
    <AvatarImage
      key={src}
      src={src}
      name={name}
      className={className}
    />
  );
}

/** Показывает фотографию по адресу, который вернул сервер. */
function AvatarImage({ src, name, className }: Props) {
  const [broken, setBroken] = useState(false);
  return (
    <span className={cn(s.avatar, className)}>
      {src && !broken ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="64px"
          unoptimized
          onError={() => setBroken(true)}
        />
      ) : (
        <span aria-label={name}>{name.charAt(0).toUpperCase()}</span>
      )}
    </span>
  );
}
