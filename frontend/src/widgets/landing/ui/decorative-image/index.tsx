import Image from "next/image";

/** Изображение оформления, его контейнер и размер для адаптивной загрузки. */
interface DecorativeImageProps {
  src: string;
  sizes: string;
  className: string;
  fit?: "contain" | "cover";
}

/** Показывает фоновую иллюстрацию, скрытую от программ чтения с экрана. */
export function DecorativeImage({
  src,
  sizes,
  className,
  fit = "contain",
}: DecorativeImageProps) {
  return (
    <div className={className}>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        style={{ objectFit: fit }}
      />
    </div>
  );
}
