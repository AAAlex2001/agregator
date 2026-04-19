const DOCUMENT_THUMB = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="24" fill="#FFF2E0"/><path d="M39 92V28c0-3.314 2.686-6 6-6h22.515c1.591 0 3.117.632 4.243 1.757l17.485 17.486A6 6 0 0 1 91 45.485V92c0 3.314-2.686 6-6 6H45c-3.314 0-6-2.686-6-6Z" fill="#fff" stroke="#FF8A00" stroke-width="6" stroke-linejoin="round"/><path d="M67 22v17c0 3.314 2.686 6 6 6h18" stroke="#FF8A00" stroke-width="6" stroke-linejoin="round"/><path d="M52 72h26" stroke="#FF8A00" stroke-width="6" stroke-linecap="round"/><path d="M52 84h18" stroke="#FF8A00" stroke-width="6" stroke-linecap="round"/></svg>',
)}`;

export function isImageFileName(name: string): boolean {
  return /\.(jpe?g|png|gif|webp)$/i.test(name);
}

function isOfficeFileName(name: string): boolean {
  return /\.(docx?|xlsx?)$/i.test(name);
}

function canUseOfficeViewer(fileUrl: string): boolean {
  return /^https?:\/\//i.test(fileUrl) && !/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(fileUrl);
}

export function getFileDisplayName(path: string, fallback = "Файл"): string {
  return path.split("/").pop() ?? fallback;
}

export function getShortFileName(name: string, limit = 12): string {
  return name.length > limit ? `${name.slice(0, limit)}…` : name;
}

export function getFileExtension(name: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(name);

  return (match?.[1] ?? "file").toUpperCase();
}

export function getFileGalleryPreviewUrl(fileUrl: string, name: string): string {
  if (isOfficeFileName(name) && canUseOfficeViewer(fileUrl)) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
  }

  return fileUrl;
}

export function getFileGalleryThumbUrl(fileUrl: string, name: string): string {
  return isImageFileName(name) ? fileUrl : DOCUMENT_THUMB;
}