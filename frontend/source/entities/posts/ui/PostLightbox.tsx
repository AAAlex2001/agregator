"use client";

import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

/** Открывает фотографии с увеличением, миниатюрами и навигацией с клавиатуры. */
export function PostLightbox({
  photos,
  index,
  onClose,
}: {
  photos: string[];
  index: number;
  onClose: () => void;
}) {
  return (
    <LightGallery
      dynamic
      dynamicEl={photos.map((src) => ({ src, thumb: src }))}
      plugins={[lgZoom, lgThumbnail]}
      download={false}
      hideScrollbar
      licenseKey={process.env.NEXT_PUBLIC_LIGHTGALLERY_LICENSE_KEY}
      onInit={({ instance }) => instance.openGallery(index)}
      onAfterClose={onClose}
    />
  );
}
