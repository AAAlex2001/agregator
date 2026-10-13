"use client";

import Image from "next/image";
import { useState } from "react";
import { PostLightbox } from "./PostLightbox";
import s from "./post.module.scss";

/** Фотографии лентой с прокруткой; по нажатию — полноэкранный просмотр. */
export function PostGallery({ photos }: { photos: string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={s.gallery}>
      {photos.map((src, index) => (
        <button
          key={src}
          type="button"
          className={s.photo}
          aria-label={`Открыть фото ${index + 1}`}
          onClick={() => setOpenIndex(index)}
        >
          <Image
            src={src}
            alt={`Фото публикации ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            unoptimized
          />
        </button>
      ))}
      {openIndex !== null && (
        <PostLightbox
          photos={photos}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
}
