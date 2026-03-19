"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "@/app/icons";
import { Button, Loader } from "@/app/components";
import {
  createThumbnailBlobUrlFromImageUrl,
  revokeBlobImagePreview,
} from "@/app/utils/blobImagePreview";
import {
  getFileNameFromPath,
  isImageFilePath,
  isPdfFilePath,
  isMobileDevice,
  openFileInBrowser,
  resolveFileUrl,
} from "@/app/utils/fileAttachments";
import styles from "./technicalSection.module.scss";

interface TechnicalSectionProps {
  technicalFiles: string[];
  responsesDeadline?: string | null;
  onRespond?: () => void;
  isResponding?: boolean;
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

function PreviewPdf({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className={styles.previewLoaderWrap}>
          <Loader label="" size="lg" />
        </div>
      )}
      <iframe
        src={src}
        className={styles.previewPdf}
        style={loaded ? undefined : { display: "none" }}
        onLoad={() => setLoaded(true)}
        title="PDF Preview"
      />
    </>
  );
}

export default function TechnicalSection({ technicalFiles, responsesDeadline, onRespond, isResponding = false }: TechnicalSectionProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const deadlineExpired = responsesDeadline
    ? new Date(responsesDeadline) <= new Date()
    : false;

  const handleFileClick = (filePath: string) => {
    if (isImageFilePath(filePath)) {
      setSelectedFile(filePath);
      return;
    }

    if (isPdfFilePath(filePath)) {
      if (isMobileDevice()) {
        openFileInBrowser(filePath);
      } else {
        setSelectedFile(filePath);
      }
      return;
    }

    openFileInBrowser(filePath);
  };

  return (
    <div className={styles.technicalSection}>
      <div className={styles.technicalFiles}>
        <div className={styles.technicalTitle}>Файлы технического задания</div>
        <div className={styles.filesRow}>
          {technicalFiles.map((filePath, index) => (
            <button
              key={`${filePath}-${index}`}
              type="button"
              className={styles.fileItem}
              onClick={() => handleFileClick(filePath)}
            >
              {isImageFilePath(filePath) ? (
                <ImageThumbnail
                  src={resolveFileUrl(filePath)}
                  alt={getFileDisplayName(filePath)}
                />
              ) : (
                getFileDisplayName(filePath)
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actionArea}>
        {deadlineExpired && (
          <span className={styles.deadlineExpiredHint}>На заказ больше нельзя откликнуться</span>
        )}
        <Button
          type="button"
          variant="primary"
          size="md"
          className={styles.actionButton}
          onClick={onRespond}
          isLoading={isResponding}
          disabled={deadlineExpired}
        >
          <span className={styles.actionText}>Откликнуться</span>
          <ArrowIcon className={styles.actionArrow} color="#FFFFFF" />
        </Button>
      </div>

      {selectedFile && createPortal(
        <div className={styles.previewOverlay} onClick={() => setSelectedFile(null)}>
          <div
            className={`${styles.previewModal} ${isPdfFilePath(selectedFile) ? styles.previewModalPdf : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.previewClose} onClick={() => setSelectedFile(null)}>
              ×
            </button>
            {isImageFilePath(selectedFile) && (
              <PreviewImage
                src={resolveFileUrl(selectedFile)}
                alt={getFileNameFromPath(selectedFile)}
              />
            )}
            {isPdfFilePath(selectedFile) && (
              <PreviewPdf src={resolveFileUrl(selectedFile)} />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
