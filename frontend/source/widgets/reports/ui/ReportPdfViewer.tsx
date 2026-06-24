"use client";

import { useEffect, useRef } from "react";
import LightGallery from "lightgallery/react";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";
import lgZoom from "lightgallery/plugins/zoom";
import { getReportPdfUrl } from "@/source/features/reports";

interface Props {
  orderId: number;
  onClose: () => void;
}

export function ReportPdfViewer({ orderId, onClose }: Props) {
  const lgRef = useRef<LightGalleryInstance | null>(null);
  const url = getReportPdfUrl(orderId);

  useEffect(() => {
    requestAnimationFrame(() => lgRef.current?.openGallery(0));
  }, []);

  return (
    <LightGallery
      onInit={(detail) => { lgRef.current = detail.instance; }}
      onAfterClose={onClose}
      plugins={[lgZoom]}
      dynamic
      dynamicEl={[
        {
          src: url,
          thumb: url,
          subHtml: `<h4>Отчёт по тендеру №${orderId}</h4>`,
          iframe: true,
          iframeTitle: `Отчёт по тендеру №${orderId}`,
        },
      ]}
      speed={300}
      download={false}
      mobileSettings={{ showCloseIcon: true, controls: false, download: false }}
    />
  );
}
