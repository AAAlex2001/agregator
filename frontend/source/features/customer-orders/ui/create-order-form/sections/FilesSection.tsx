"use client";

import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import base from "./sectionBase.module.scss";
import s from "./filesSection.module.scss";

interface Props {
  existingFiles: string[];
  files: File[];
  dropzoneOptions: DropzoneOptions;
  onRemoveFile: (index: number) => void;
  onRemoveExistingFile: (index: number) => void;
}

interface NewFilePreview {
  file: File;
  url: string;
}

function FileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 20V4C5 3.73478 5.10536 3.48043 5.29289 3.29289C5.48043 3.10536 5.73478 3 6 3H12.172C12.7024 3.00011 13.211 3.2109 13.586 3.586L18.414 8.414C18.7891 8.78899 18.9999 9.29761 19 9.828V20C19 20.2652 18.8946 20.5196 18.7071 20.7071C18.5196 20.8946 18.2652 21 18 21H6C5.73478 21 5.48043 20.8946 5.29289 20.7071C5.10536 20.5196 5 20.2652 5 20Z"
        stroke="#CED2D6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V9C12 9.26522 12.1054 9.51957 12.2929 9.70711C12.4804 9.89464 12.7348 10 13 10H19"
        stroke="#CED2D6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isImageName(name: string) {
  return /\.(jpe?g|png|gif|webp)$/i.test(name);
}

function shortName(name: string) {
  return name.length > 10 ? `${name.slice(0, 10)}…` : name;
}

export function FilesSection({
  existingFiles,
  files,
  dropzoneOptions,
  onRemoveFile,
  onRemoveExistingFile,
}: Props) {
  const [previews, setPreviews] = useState<NewFilePreview[]>([]);
  const dropzone = useDropzone({
    ...dropzoneOptions,
    noClick: true,
  });

  useEffect(() => {
    const nextPreviews = files
      .filter((file) => isImageName(file.name))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  return (
    <section className={base.section}>
      <span className={base.label}>Файлы</span>

      <LightGallery plugins={[lgThumbnail]} selector="a" speed={300} download={false}>
        <div
          {...dropzone.getRootProps({
            className: `${s.fileRow} ${dropzone.isDragActive ? s.fileRowActive : ""}`,
          })}
        >
          <input {...dropzone.getInputProps()} />

          <button type="button" className={s.fileAdd} onClick={() => dropzone.open()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {existingFiles.map((file, index) => {
            const fileUrl = resolveFileUrl(file);
            const name = file.split("/").pop() ?? "Файл";
            const isImage = isImageName(name);

            return (
              <div key={file} className={s.fileThumbnail}>
                {isImage ? (
                  <a href={fileUrl} className={s.anchor}>
                    <img src={fileUrl} alt={name} className={s.filePreviewImage} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className={`${s.anchor} ${s.fileNameButton}`}
                    onClick={() => window.open(fileUrl, "_blank", "noopener,noreferrer")}
                  >
                    <span className={s.fileName}>{shortName(name)}</span>
                  </button>
                )}
                <button type="button" className={s.fileRemove} onClick={() => onRemoveExistingFile(index)}>×</button>
              </div>
            );
          })}

          {files.map((file, index) => {
            const preview = previews.find((item) => item.file === file);

            return (
              <div key={`${file.name}-${index}`} className={s.fileThumbnail}>
                {preview ? (
                  <a href={preview.url} className={s.anchor}>
                    <img src={preview.url} alt={file.name} className={s.filePreviewImage} />
                  </a>
                ) : (
                  <>
                    <FileIcon />
                    <span className={s.fileName}>{shortName(file.name)}</span>
                  </>
                )}
                <button type="button" className={s.fileRemove} onClick={() => onRemoveFile(index)}>×</button>
              </div>
            );
          })}
        </div>
      </LightGallery>

      <span className={s.hint}>PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX</span>
    </section>
  );
}