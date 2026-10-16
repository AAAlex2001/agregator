"use client";

import LightGallery from "lightgallery/react";
import type { InitDetail } from "lightgallery/lg-events";
import lgZoom from "lightgallery/plugins/zoom";
import { escapeHtml } from "@/shared/lib/escape-html";

/** Адрес PDF, подпись просмотра и закрытие окна. */
interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

/** Открывает PDF во встроенном полноэкранном просмотре с увеличением. */
export function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  const slides = [
    {
      src: url,
      thumb: url,
      subHtml: `<h4>${escapeHtml(title)}</h4>`,
      iframe: true,
      iframeTitle: title,
    },
  ];

  /** Показывает документ сразу после подключения галереи. */
  function openGallery({ instance }: InitDetail) {
    requestAnimationFrame(() => instance.openGallery(0));
  }

  return (
    <LightGallery
      dynamic
      dynamicEl={slides}
      plugins={[lgZoom]}
      speed={300}
      download={false}
      mobileSettings={{
        showCloseIcon: true,
        controls: false,
        download: false,
      }}
      onInit={openGallery}
      onAfterClose={onClose}
    />
  );
}
