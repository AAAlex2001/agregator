"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/app/components";
import {
  createThumbnailBlobUrlFromImageUrl,
  revokeBlobImagePreview,
} from "@/app/utils/blobImagePreview";
import {
  downloadFileByPath,
  getFileNameFromPath,
  isImageFilePath,
  resolveFileUrl,
} from "@/app/utils/fileAttachments";
import styles from "./techSpecFiles.module.scss";

interface TechSpecFilesProps {
  techSpecTitle?: string;
  techSpecFiles?: string[];
}

function getFileDisplayName(filePath: string): string {
  const fileName = filePath.split("/").pop() || filePath;
  return fileName.length > 12 ? `${fileName.slice(0, 12)}…` : fileName;
}

function ImageThumbnail({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let generatedUrl: string | null = null;

    setLoaded(false);
    setThumbnailSrc(null);

    void createThumbnailBlobUrlFromImageUrl(src).then((url) => {
      if (!isMounted) {
        revokeBlobImagePreview(url);
        return;
      }

      if (url) {
        generatedUrl = url;
        setThumbnailSrc(url);
        return;
      }

      setThumbnailSrc(src);
    });

    return () => {
      isMounted = false;
      revokeBlobImagePreview(generatedUrl);
    };
  }, [src]);

  if (!thumbnailSrc) {
    return <Loader label="" size="sm" />;
  }

  return (
    <>
      {!loaded && <Loader label="" size="sm" />}
      <img
        src={thumbnailSrc}
        alt={alt}
        className={styles.fileThumbnailImage}
        style={loaded ? undefined : { display: "none" }}
        onLoad={() => {
          setLoaded(true);
        }}
        onError={() => {
          if (thumbnailSrc !== src) {
            setLoaded(false);
            setThumbnailSrc(src);
            return;
          }
          setLoaded(true);
        }}
      />
    </>
  );
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className={styles.previewLoaderWrap}>
          <Loader label="" size="lg" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={styles.previewImage}
        style={loaded ? undefined : { display: "none" }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

const TechSpecFiles = ({ techSpecTitle, techSpecFiles }: TechSpecFilesProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!techSpecTitle || !techSpecFiles || techSpecFiles.length === 0)
    return null;

  const handleFileClick = async (filePath: string) => {
    if (isImageFilePath(filePath)) {
      setSelectedImage(filePath);
      return;
    }

    await downloadFileByPath(filePath);
  };

  return (
    <>
      <div className={styles.filesSection}>
        <span className={styles.filesTitle}>{techSpecTitle}</span>
        <div className={styles.filesRow}>
          {techSpecFiles.map((file, index) => (
            <button
              key={index}
              type="button"
              className={styles.fileItem}
              onClick={() => void handleFileClick(file)}
            >
              {isImageFilePath(file) ? (
                <ImageThumbnail
                  src={resolveFileUrl(file)}
                  alt={getFileDisplayName(file)}
                />
              ) : (
                getFileDisplayName(file)
              )}
            </button>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div className={styles.previewOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.previewModal} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.previewClose} onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <PreviewImage
              src={resolveFileUrl(selectedImage)}
              alt={getFileNameFromPath(selectedImage)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TechSpecFiles;
