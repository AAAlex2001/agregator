import cn from "classnames";
import Image from "next/image";
import s from "./post.module.scss";

interface PostAvatarProps {
  src: string | null;
  name: string;
  className?: string;
}

/** Фото автора, а без фото — первая буква имени. */
export function PostAvatar({ src, name, className }: PostAvatarProps) {
  return (
    <span className={cn(s.avatar, className)}>
      {src ? (
        <Image src={src} alt={name} fill sizes="64px" unoptimized />
      ) : (
        <span aria-label={name}>{name.charAt(0).toUpperCase()}</span>
      )}
    </span>
  );
}
