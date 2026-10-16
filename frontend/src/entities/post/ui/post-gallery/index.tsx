"use client";

import { useState } from "react";
import { PostLightbox } from "../post-lightbox";
import { PostPhoto } from "../post-photo";
import styles from "./style.module.scss";

/** Адреса фотографий в порядке, заданном автором публикации. */
interface PostGalleryProps {
  photos: string[];
}

/** Показывает фотографии лентой и открывает выбранную на весь экран. */
export function PostGallery({ photos }: PostGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /** Выбирает фотографию для полноэкранного просмотра. */
  function openPhoto(index: number) {
    setOpenIndex(index);
  }

  /** Закрывает полноэкранный просмотр, сохраняя ленту фотографий. */
  function closePhotos() {
    setOpenIndex(null);
  }

  return (
    <div className={styles.gallery}>
      {photos.map((src, index) => (
        <PostPhoto
          key={src}
          src={src}
          index={index}
          onOpen={openPhoto}
        />
      ))}
      {openIndex !== null && (
        <PostLightbox
          photos={photos}
          index={openIndex}
          onClose={closePhotos}
        />
      )}
    </div>
  );
}
