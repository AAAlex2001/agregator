"use client";

import cn from "classnames";
import { useRef, useState } from "react";
import LightGallery from "lightgallery/react";
import type { InitDetail } from "lightgallery/lg-events";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { downloadFile } from "@/shared/lib/download-file";
import { escapeHtml } from "@/shared/lib/escape-html";
import {
  getFilePreviewUrl,
  getFileThumbnailUrl,
  isImageFileName,
} from "./model/file-preview";
import type { FileGalleryProps } from "./model/types";
import { FileActionsModal } from "./ui/file-actions-modal";
import { FileTile } from "./ui/file-tile";
import styles from "./style.module.scss";

/** Галерея файлов с просмотром, скачиванием и переданными действиями редактирования. */
export function FileGallery({
  items,
  label,
  hint,
  emptyText = "Файлы отсутствуют",
  hideWhenEmpty = false,
  variant = "readonly",
  onAdd,
  input,
  blockClassName,
  labelClassName,
  hintClassName,
  gridProps,
}: FileGalleryProps) {
  const galleryRef = useRef<LightGalleryInstance | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const activeItem = items[activeIndex];

  const slides = items.map((item) => {
    const isImage = item.isImage ?? isImageFileName(item.name);

    return {
      src: item.previewUrl ?? getFilePreviewUrl(item.url, item.name),
      thumb: item.thumbnailUrl ?? getFileThumbnailUrl(item.url, item.name),
      subHtml: `<h4>${escapeHtml(item.name)}</h4>`,
      iframe: !isImage,
      iframeTitle: isImage ? undefined : item.name,
    };
  });

  /** Запоминает галерею, чтобы открыть её из диалога действий. */
  function rememberGallery(detail: InitDetail) {
    galleryRef.current = detail.instance;
  }

  /** Скачивает выбранный файл отдельной ссылкой, сохраняя имя документа. */
  function downloadActiveFile() {
    if (activeItem) {
      downloadFile(activeItem.url, activeItem.name);
    }
  }

  /** Закрывает диалог действий перед открытием полноэкранного просмотра. */
  function viewFile() {
    if (!activeItem || !galleryRef.current) {
      return;
    }

    setActiveId(null);

    requestAnimationFrame(() => {
      galleryRef.current?.openGallery(activeIndex);
    });
  }

  /** Закрывает диалог действий с файлом. */
  function closeActions() {
    setActiveId(null);
  }

  if (items.length === 0 && !onAdd && hideWhenEmpty) {
    return null;
  }

  return (
    <div className={cn(styles.block, blockClassName)}>
      {label && <span className={cn(styles.label, labelClassName)}>{label}</span>}

      {items.length === 0 && !onAdd ? (
        <div className={styles.empty}>{emptyText}</div>
      ) : (
        <div
          {...gridProps}
          className={cn(styles.grid, gridProps?.className)}
        >
          {input}

          {onAdd && (
            <button
              type="button"
              className={cn(
                styles.addButton,
                styles.tile,
                variant === "editable" ? styles.tileEditable : styles.tileReadonly,
              )}
              onClick={onAdd}
              aria-label="Добавить файл"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="var(--color-orange-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {items.map((item) => (
            <FileTile
              key={item.id}
              item={item}
              variant={variant}
              onOpen={() => setActiveId(item.id)}
            />
          ))}
        </div>
      )}

      {hint && <span className={cn(styles.hint, hintClassName)}>{hint}</span>}

      {slides.length > 0 && (
        <LightGallery
          onInit={rememberGallery}
          plugins={[lgThumbnail, lgZoom]}
          dynamic
          dynamicEl={slides}
          speed={300}
          download={false}
          mobileSettings={{
            showCloseIcon: true,
            controls: false,
            download: false,
          }}
        />
      )}

      <FileActionsModal
        open={Boolean(activeItem)}
        fileName={activeItem?.name ?? ""}
        onView={viewFile}
        onDownload={downloadActiveFile}
        onClose={closeActions}
      />
    </div>
  );
}

export type { FileGalleryItem } from "./model/types";
