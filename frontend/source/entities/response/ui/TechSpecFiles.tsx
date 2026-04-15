"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader } from "@/shared/ui";
import {
  createThumbnailBlobUrlFromImageUrl,
  revokeBlobImagePreview,
} from "@/shared/lib/blobImagePreview";
import {
  isImageFilePath, isPdfFilePath, isMobileDevice,
  openFileInBrowser, resolveFileUrl,
} from "@/shared/lib/fileAttachments";
import s from "./TechSpecFiles.module.scss";

function displayName(path: string) {
  const name = path.split("/").pop() || path;
  return name.length > 12 ? `${name.slice(0, 12)}…` : name;
}

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let gen: string | null = null;
    setLoaded(false);
    setUrl(null);
    void createThumbnailBlobUrlFromImageUrl(src).then((u) => {
      if (!alive) { revokeBlobImagePreview(u); return; }
      if (u) { gen = u; setUrl(u); } else setUrl(src);
    });
    return () => { alive = false; revokeBlobImagePreview(gen); };
  }, [src]);

  if (!url) return <Loader label="" size="sm" />;
  return (
    <>
      {!loaded && <Loader label="" size="sm" />}
      <img src={url} alt={alt} className={s.fileThumbnail}
        style={loaded ? undefined : { display: "none" }}
        onLoad={() => setLoaded(true)}
        onError={() => { if (url !== src) { setLoaded(false); setUrl(src); } else setLoaded(true); }}
      />
    </>
  );
}

export function TechSpecFiles({ title, files }: { title: string; files: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  if (!files.length) return null;

  const open = (file: string) => {
    if (isImageFilePath(file)) { setSelected(file); return; }
    if (isPdfFilePath(file) && !isMobileDevice()) { setSelected(file); return; }
    openFileInBrowser(file);
  };

  const isImg = selected ? isImageFilePath(selected) : false;
  const isPdf = selected ? isPdfFilePath(selected) : false;

  return (
    <>
      <div className={s.filesSection}>
        <span className={s.filesTitle}>{title}</span>
        <div className={s.filesRow}>
          {files.map((f, i) => (
            <button key={i} type="button" className={s.fileItem} onClick={() => open(f)}>
              {isImageFilePath(f)
                ? <Thumb src={resolveFileUrl(f)} alt={displayName(f)} />
                : displayName(f)}
            </button>
          ))}
        </div>
      </div>
      {selected && createPortal(
        <div className={s.overlay} onClick={() => setSelected(null)}>
          <div className={`${s.previewModal} ${isPdf ? s.previewPdfModal : ""}`}
            onClick={(e) => e.stopPropagation()}>
            <button type="button" className={s.previewClose} onClick={() => setSelected(null)}>×</button>
            {isImg && <img src={resolveFileUrl(selected)} alt="" className={s.previewImg} />}
            {isPdf && <iframe src={resolveFileUrl(selected)} className={s.previewPdf} title="PDF" />}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
