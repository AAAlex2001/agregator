"use client";

import { useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import LightGallery from "lightgallery/react";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import {
  getFileDisplayName,
  getFileExtension,
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FileIcon } from "@/source/shared/ui/icons";
import { FileActionsModal } from "@/source/shared/ui/FileActionsModal";
import s from "./FileGallery.module.scss";

export interface FileGalleryItem {
  id: string;
  name: string;
  url: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  isImage?: boolean;
  onRemove?: () => void;
}

interface Props {
  files?: string[];
  items?: FileGalleryItem[];
  label?: string;
  hint?: string;
  emptyText?: string;
  hideWhenEmpty?: boolean;
  variant?: "readonly" | "editable";
  onAdd?: () => void;
  input?: ReactNode;
  blockClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  gridProps?: HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };
}

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function FileGallery({
  files = [],
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
}: Props) {
  const lgRef = useRef<LightGalleryInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const resolvedItems: FileGalleryItem[] = items ?? files.map((file, index) => {
    const fileUrl = resolveFileUrl(file);
    const name = getFileDisplayName(file, `Файл ${index + 1}`);
    const isImage = isImageFileName(name);

    return {
      id: `${file}-${index}`,
      name,
      url: fileUrl,
      previewUrl: isImage ? fileUrl : getFileGalleryPreviewUrl(fileUrl, name),
      thumbnailUrl: getFileGalleryThumbUrl(fileUrl, name),
      isImage,
    };
  });

  const dynamicSlides = useMemo(
    () =>
      resolvedItems.map((item) => {
        const previewUrl = item.previewUrl ?? item.url;
        const isImage = item.isImage ?? isImageFileName(item.name);
        return {
          src: previewUrl,
          thumb: item.thumbnailUrl ?? getFileGalleryThumbUrl(item.url, item.name),
          subHtml: `<h4>${item.name}</h4>`,
          iframe: !isImage,
          iframeTitle: !isImage ? item.name : undefined,
        };
      }),
    [resolvedItems],
  );

  if (!resolvedItems.length && !onAdd && hideWhenEmpty) {
    return null;
  }

  const gridClassName = gridProps?.className;
  const variantClassName = variant === "editable" ? s.tileEditable : s.tileReadonly;

  const downloadActive = () => {
    if (activeIndex === null) return;
    const item = resolvedItems[activeIndex];
    if (!item) return;
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.name;
    link.rel = "noopener";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewActive = () => {
    if (activeIndex === null || !lgRef.current) return;
    const index = activeIndex;
    setActiveIndex(null);
    requestAnimationFrame(() => {
      lgRef.current?.openGallery(index);
    });
  };

  const activeItem = activeIndex !== null ? resolvedItems[activeIndex] : null;

  return (
    <div className={joinClassNames(s.block, blockClassName)}>
      {label ? <span className={joinClassNames(s.label, labelClassName)}>{label}</span> : null}

      {!resolvedItems.length && !onAdd ? (
        <div className={s.empty}>{emptyText}</div>
      ) : (
        <div
          {...gridProps}
          className={joinClassNames(s.grid, gridClassName)}
        >
          {input}
          {onAdd ? (
            <button
              type="button"
              className={joinClassNames(s.addButton, s.tile, variantClassName)}
              onClick={onAdd}
              aria-label="Добавить файл"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5V19M5 12H19" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}

          {resolvedItems.map((item, index) => {
            const isImage = item.isImage ?? isImageFileName(item.name);

            return (
              <div key={item.id} className={s.item}>
                <button
                  type="button"
                  className={joinClassNames(s.tile, variantClassName, isImage && s.imageTile)}
                  onClick={() => setActiveIndex(index)}
                  title={item.name}
                  aria-label={`Открыть файл ${item.name}`}
                >
                  {isImage ? (
                    <img src={item.url} alt={item.name} className={s.image} />
                  ) : (
                    <span className={s.fileMeta}>
                      <FileIcon className={s.fileIcon} />
                      <span className={s.fileExtension}>{getFileExtension(item.name)}</span>
                    </span>
                  )}
                </button>

                {item.onRemove ? (
                  <button
                    type="button"
                    className={s.removeButton}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      item.onRemove?.();
                    }}
                    aria-label={`Удалить файл ${item.name}`}
                  >
                    ×
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {hint ? <span className={joinClassNames(s.hint, hintClassName)}>{hint}</span> : null}

      {dynamicSlides.length > 0 ? (
        <LightGallery
          onInit={(detail) => { lgRef.current = detail.instance; }}
          plugins={[lgThumbnail, lgZoom]}
          dynamic
          dynamicEl={dynamicSlides}
          speed={300}
          download={false}
        />
      ) : null}

      <FileActionsModal
        open={activeItem !== null}
        fileName={activeItem?.name ?? ""}
        onView={viewActive}
        onDownload={downloadActive}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
}
