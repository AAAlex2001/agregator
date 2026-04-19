"use client";

import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import {
  getFileDisplayName,
  getFileExtension,
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  getShortFileName,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import s from "./FileGallery.module.scss";

interface Props {
  files: string[];
  label: string;
  emptyText?: string;
  hideWhenEmpty?: boolean;
}

export function FileGallery({
  files,
  label,
  emptyText = "Файлы отсутствуют",
  hideWhenEmpty = false,
}: Props) {
  if (!files.length && hideWhenEmpty) {
    return null;
  }

  return (
    <div className={s.block}>
      <span className={s.label}>{label}</span>

      {files.length === 0 ? (
        <div className={s.empty}>{emptyText}</div>
      ) : (
        <LightGallery
          plugins={[lgThumbnail, lgZoom]}
          selector="a"
          speed={300}
          download={false}
          exThumbImage="data-thumb"
        >
          <div className={s.grid}>
            {files.map((file, index) => {
              const fileUrl = resolveFileUrl(file);
              const name = getFileDisplayName(file, `Файл ${index + 1}`);
              const isImage = isImageFileName(name);
              const previewUrl = isImage ? fileUrl : getFileGalleryPreviewUrl(fileUrl, name);

              return (
                <a
                  key={`${file}-${index}`}
                  href={previewUrl}
                  className={`${s.tile} ${isImage ? s.imageTile : ""}`}
                  data-src={previewUrl}
                  data-sub-html={name}
                  data-thumb={getFileGalleryThumbUrl(fileUrl, name)}
                  data-iframe={isImage ? undefined : "true"}
                  data-iframe-title={isImage ? undefined : name}
                  title={name}
                >
                  {isImage ? (
                    <img src={fileUrl} alt={name} className={s.image} />
                  ) : (
                    <span className={s.fileMeta}>
                      <span className={s.fileExtension}>{getFileExtension(name)}</span>
                      <span className={s.fileName}>{getShortFileName(name)}</span>
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </LightGallery>
      )}
    </div>
  );
}