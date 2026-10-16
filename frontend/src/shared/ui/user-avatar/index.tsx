"use client";

import cn from "classnames";
import type { ReactNode } from "react";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { ProfileIcon } from "@/shared/ui/icons";
import { AvatarImage } from "./ui/avatar-image";
import styles from "./style.module.scss";

/** Изображение пользователя и содержимое на случай отсутствующего или повреждённого файла. */
interface UserAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallback?: ReactNode;
}

/** Показывает аватар, а при ошибке загрузки заменяет его иконкой или переданной заглушкой. */
export function UserAvatar({
  src,
  alt,
  className = "",
  imageClassName = "",
  fallback,
}: UserAvatarProps) {
  const imageSource = src ? resolveFileUrl(src) : "";
  const placeholder = fallback ?? <ProfileIcon className={styles.fallback} />;

  return (
    <div
      className={cn(styles.wrapper, className)}
      aria-label={alt}
    >
      {imageSource ? (
        <AvatarImage
          key={imageSource}
          src={imageSource}
          alt={alt}
          className={cn(styles.image, imageClassName)}
          fallback={placeholder}
        />
      ) : (
        placeholder
      )}
    </div>
  );
}
