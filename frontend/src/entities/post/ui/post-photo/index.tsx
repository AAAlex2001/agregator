import Image from "next/image";
import styles from "./style.module.scss";

/** Фотография в ленте и её позиция для полноэкранного просмотра. */
interface PostPhotoProps {
  src: string;
  index: number;
  onOpen: (index: number) => void;
}

/** Открывает выбранное фото публикации по нажатию на миниатюру. */
export function PostPhoto({
  src,
  index,
  onOpen,
}: PostPhotoProps) {
  /** Передаёт галерее позицию выбранного фото. */
  function openPhoto() {
    onOpen(index);
  }

  return (
    <button
      type="button"
      className={styles.photo}
      aria-label={`Открыть фото ${index + 1}`}
      onClick={openPhoto}
    >
      <Image
        src={src}
        alt={`Фото публикации ${index + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 900px"
        unoptimized
      />
    </button>
  );
}
