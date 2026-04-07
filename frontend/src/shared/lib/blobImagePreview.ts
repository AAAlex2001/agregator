interface ThumbnailOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
}

const DEFAULT_OPTIONS: Required<ThumbnailOptions> = {
  maxWidth: 360,
  maxHeight: 360,
  quality: 0.75,
  mimeType: "image/jpeg",
};

function calculateTargetSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Не удалось загрузить изображение"));
    image.src = src;
  });
}

export async function createThumbnailBlobUrlFromImageUrl(
  imageUrl: string,
  options?: ThumbnailOptions,
): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return null;
    }

    const sourceBlob = await response.blob();
    if (sourceBlob.size === 0) {
      return null;
    }

    const sourceObjectUrl = URL.createObjectURL(sourceBlob);

    try {
      const image = await loadImage(sourceObjectUrl);
      const target = calculateTargetSize(
        image.naturalWidth || image.width,
        image.naturalHeight || image.height,
        config.maxWidth,
        config.maxHeight,
      );

      const canvas = document.createElement("canvas");
      canvas.width = target.width;
      canvas.height = target.height;

      const context = canvas.getContext("2d");
      if (!context) {
        return null;
      }

      context.drawImage(image, 0, 0, target.width, target.height);

      const thumbnailBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, config.mimeType, config.quality);
      });

      if (!thumbnailBlob) {
        return null;
      }

      return URL.createObjectURL(thumbnailBlob);
    } finally {
      URL.revokeObjectURL(sourceObjectUrl);
    }
  } catch {
    return null;
  }
}

export function revokeBlobImagePreview(url: string | null | undefined): void {
  if (!url) {
    return;
  }

  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
