"use client";

import "keen-slider/keen-slider.min.css";
import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { PostLightbox } from "./PostLightbox";
import s from "./post.module.scss";

/** Листает фотографии; по нажатию открывает полноэкранный просмотр. */
export function PostGallery({ photos }: { photos: string[] }) {
  const [current, setCurrent] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slideChanged: (instance) => setCurrent(instance.track.details.rel),
  });
  return (
    <div className={s.gallery}>
      <div
        ref={sliderRef}
        className={cn("keen-slider", s.photos)}
      >
        {photos.map((src, index) => (
          <button
            key={src}
            type="button"
            className={cn("keen-slider__slide", s.photo)}
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
      </div>
      {photos.length > 1 && (
        <div className={s.thumbs}>
          {photos.map((src, index) => (
            <button
              key={src}
              type="button"
              className={cn(s.thumb, index === current && s.activeThumb)}
              aria-label={`Фото ${index + 1}`}
              aria-current={index === current}
              onClick={() => slider.current?.moveToIdx(index)}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
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
