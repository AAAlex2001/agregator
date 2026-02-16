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
