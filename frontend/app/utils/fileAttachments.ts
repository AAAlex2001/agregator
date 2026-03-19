const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif", "heic", "heif"];

function stripQueryAndHash(value: string): string {
  return value.split("#")[0]?.split("?")[0] ?? value;
}

export function getFileNameFromPath(filePath: string): string {
  const cleanPath = stripQueryAndHash(filePath);
  const fileName = cleanPath.split("/").pop() || cleanPath;
  return decodeURIComponent(fileName);
}

export function isImageFilePath(filePath: string): boolean {
  const cleanPath = stripQueryAndHash(filePath);
  const extension = cleanPath.split(".").pop()?.toLowerCase();
  if (!extension) {
    return false;
  }
  return IMAGE_EXTENSIONS.includes(extension);
}

export function isPdfFilePath(filePath: string): boolean {
  const cleanPath = stripQueryAndHash(filePath);
  return cleanPath.split(".").pop()?.toLowerCase() === "pdf";
}

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
}

export function resolveFileUrl(filePath: string): string {
  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    if (typeof window !== "undefined") {
      return new URL(normalizedPath, window.location.origin).toString();
    }
    return normalizedPath;
  }

  if (/^https?:\/\//i.test(apiBaseUrl)) {
    return new URL(normalizedPath, apiBaseUrl).toString();
  }

  if (apiBaseUrl.startsWith("/")) {
    if (typeof window !== "undefined") {
      return new URL(normalizedPath, window.location.origin).toString();
    }
    return normalizedPath;
  }

  if (typeof window !== "undefined") {
    return new URL(normalizedPath, window.location.origin).toString();
  }

  return normalizedPath;
}

export async function downloadFileByPath(filePath: string): Promise<void> {
  const fileUrl = resolveFileUrl(filePath);
  const fileName = getFileNameFromPath(filePath);

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } catch {
    const fallbackLink = document.createElement("a");
    fallbackLink.href = fileUrl;
    fallbackLink.download = fileName;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noreferrer";
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    fallbackLink.remove();
  }
}

const BROWSER_PREVIEWABLE_EXTENSIONS = [
  ...IMAGE_EXTENSIONS,
  "pdf",
];

export function openFileInBrowser(filePath: string): void {
  const fileUrl = resolveFileUrl(filePath);
  const ext = stripQueryAndHash(filePath).split(".").pop()?.toLowerCase() || "";

  if (BROWSER_PREVIEWABLE_EXTENSIONS.includes(ext)) {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  } else {
    window.open(
      `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`,
      "_blank",
      "noopener,noreferrer"
    );
  }
}
