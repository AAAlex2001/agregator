"use client";

import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import s from "./TechnicalGallery.module.scss";

interface Props {
  files: string[];
  label?: string;
}

function isImageFile(name: string) {
  return /\.(jpe?g|png|gif|webp)$/i.test(name);
}

function shortName(name: string) {
  return name.length > 12 ? `${name.slice(0, 12)}…` : name;
}

export function TechnicalGallery({ files, label = "Файлы технического задания" }: Props) {
  return (
    <div className={s.block}>
      <span className={s.label}>{label}</span>

      {files.length === 0 ? (
        <div className={s.empty}>Файлы отсутствуют</div>
      ) : (
        <LightGallery plugins={[lgThumbnail, lgZoom]} selector="a.lg-image" speed={300} download={false}>
          <div className={s.grid}>
            {files.map((file, index) => {
              const fileUrl = resolveFileUrl(file);
              const name = file.split("/").pop() ?? `Файл ${index + 1}`;

              return isImageFile(name) ? (
                <a
                  key={`${file}-${index}`}
                  href={fileUrl}
                  className={`${s.tile} ${s.imageTile} lg-image`}
                  data-sub-html={name}
                >
                  <img src={fileUrl} alt={name} className={s.image} />
                </a>
              ) : (
                <a
                  key={`${file}-${index}`}
                  href={fileUrl}
                  className={s.tile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={s.fileName}>{shortName(name)}</span>
                </a>
              );
            })}
          </div>
        </LightGallery>
      )}
    </div>
  );
}