"use client";

import { useMemo, useRef, useState } from "react";
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
import { FileIcon } from "@/source/shared/ui/icons";
import { FileActionsModal } from "@/source/shared/ui/FileActionsModal";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_LABELS,
  documentPaths,
  type DocumentCategory,
  type OrderDocuments,
} from "../model/types";
import s from "./DocumentsGallery.module.scss";

interface Props {
  documents: OrderDocuments;
  heading?: string;
}

export function DocumentsGallery({ documents, heading = "Документы заказчика" }: Props) {
  const lgRef = useRef<LightGalleryInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const flatPaths = useMemo(() => documentPaths(documents), [documents]);

  const slides = useMemo(
    () => flatPaths.map((url) => {
      const name = getFileDisplayName(url, "Файл");
      const isImage = isImageFileName(name);
      return {
        src: isImage ? url : getFileGalleryPreviewUrl(url, name),
        thumb: getFileGalleryThumbUrl(url, name),
        subHtml: `<h4>${name}</h4>`,
        iframe: !isImage,
        iframeTitle: !isImage ? name : undefined,
      };
    }),
    [flatPaths],
  );

  const activeUrl = activeIndex !== null ? flatPaths[activeIndex] : null;
  const activeName = activeUrl ? getFileDisplayName(activeUrl, "Файл") : "";

  const downloadActive = () => {
    if (!activeUrl) return;
    const link = document.createElement("a");
    link.href = activeUrl;
    link.download = activeName;
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
    requestAnimationFrame(() => lgRef.current?.openGallery(index));
  };

  return (
    <div className={s.block}>
      <span className={s.heading}>{heading}</span>
      <div className={s.row}>
        {DOCUMENT_CATEGORIES.map((category) => (
          <Column
            key={category}
            category={category}
            urls={documents[category]}
            onOpen={(url) => setActiveIndex(flatPaths.indexOf(url))}
          />
        ))}
      </div>

      {slides.length > 0 ? (
        <LightGallery
          onInit={(detail) => { lgRef.current = detail.instance; }}
          plugins={[lgThumbnail, lgZoom]}
          dynamic
          dynamicEl={slides}
          speed={300}
          download={false}
        />
      ) : null}

      <FileActionsModal
        open={activeUrl !== null}
        fileName={activeName}
        onView={viewActive}
        onDownload={downloadActive}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
}

interface ColumnProps {
  category: DocumentCategory;
  urls: string[];
  onOpen: (url: string) => void;
}

function Column({ category, urls, onOpen }: ColumnProps) {
  return (
    <div className={s.column}>
      <div className={s.tiles}>
        {urls.length === 0 ? (
          <EmptyTile />
        ) : (
          urls.map((url) => <FileTile key={url} url={url} onOpen={() => onOpen(url)} />)
        )}
      </div>
      <span className={s.caption}>{DOCUMENT_LABELS[category]}</span>
    </div>
  );
}

function EmptyTile() {
  return (
    <div className={`${s.tile} ${s.tileEmpty}`} aria-hidden="true">
      <span className={s.dash}>—</span>
    </div>
  );
}

function FileTile({ url, onOpen }: { url: string; onOpen: () => void }) {
  const name = getFileDisplayName(url, "Файл");
  const isImage = isImageFileName(name);
  return (
    <button
      type="button"
      className={`${s.tile} ${isImage ? s.imageTile : ""}`.trim()}
      onClick={onOpen}
      title={name}
      aria-label={`Открыть файл ${name}`}
    >
      {isImage ? (
        <img src={url} alt={name} className={s.image} />
      ) : (
        <span className={s.fileMeta}>
          <FileIcon className={s.fileIcon} />
          <span className={s.fileExtension}>{getFileExtension(name)}</span>
        </span>
      )}
    </button>
  );
}
