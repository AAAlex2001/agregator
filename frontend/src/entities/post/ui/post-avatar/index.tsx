import cn from "classnames";
import Image from "next/image";
import styles from "./style.module.scss";

/** Фото автора и подпись для его отображения без изображения. */
interface PostAvatarProps {
  src: string | null;
  name: string;
  className?: string;
}

/** Показывает фото автора, а без фото — первую букву имени. */
export function PostAvatar({
  src,
  name,
  className,
}: PostAvatarProps) {
  return (
    <span className={cn(styles.avatar, className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="64px"
          unoptimized
        />
      ) : (
        <span aria-label={name}>
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}
