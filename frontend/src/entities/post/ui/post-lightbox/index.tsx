"use client";

import LightGallery from "lightgallery/react";
import type { InitDetail } from "lightgallery/lg-events";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

/** Фотографии, открытая позиция и закрытие полноэкранного просмотра. */
interface PostLightboxProps {
  photos: string[];
  index: number;
  onClose: () => void;
}

/** Показывает фото с увеличением, миниатюрами и навигацией с клавиатуры. */
export function PostLightbox({
  photos,
  index,
  onClose,
}: PostLightboxProps) {
  const slides = photos.map((src) => ({
    src,
    thumb: src,
  }));

  /** Открывает выбранное фото после подключения галереи. */
  function openGallery({ instance }: InitDetail) {
    instance.openGallery(index);
  }

  return (
    <LightGallery
      dynamic
      dynamicEl={slides}
      plugins={[lgZoom, lgThumbnail]}
      download={false}
      hideScrollbar
      licenseKey={process.env.NEXT_PUBLIC_LIGHTGALLERY_LICENSE_KEY}
      onInit={openGallery}
      onAfterClose={onClose}
    />
  );
}
