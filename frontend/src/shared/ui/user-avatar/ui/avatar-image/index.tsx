import { useState, type ReactNode } from "react";

/** Загружаемое изображение и замена при ошибке. */
interface AvatarImageProps {
  src: string;
  alt: string;
  className: string;
  fallback: ReactNode;
}

/** Запоминает ошибку только для текущего изображения; новый URL сбрасывает состояние через key. */
export function AvatarImage({ src, alt, className, fallback }: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
