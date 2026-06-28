"use client";

import { useEffect, useRef } from "react";
import LightGallery from "lightgallery/react";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";
import lgZoom from "lightgallery/plugins/zoom";

interface Props {
  url: string;
  title: string;
  onClose: () => void;
}

export function LiningPdfViewer({ url, title, onClose }: Props) {
  const lgRef = useRef<LightGalleryInstance | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => lgRef.current?.openGallery(0));
  }, []);

  return (
    <LightGallery
      onInit={(detail) => {
        lgRef.current = detail.instance;
      }}
      onAfterClose={onClose}
      plugins={[lgZoom]}
      dynamic
      dynamicEl={[{ src: url, thumb: url, subHtml: `<h4>${title}</h4>`, iframe: true, iframeTitle: title }]}
      speed={300}
      download={false}
      mobileSettings={{ showCloseIcon: true, controls: false, download: false }}
    />
  );
}
