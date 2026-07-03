import { openLink, tapHaptic } from "@/shared/services/telegram";

export function fileUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return window.location.origin + (url.startsWith("/") ? url : `/${url}`);
}

export function openFile(url: string): void {
  tapHaptic();
  openLink(fileUrl(url));
}

export function fileName(url: string): string {
  return url.split("/").pop() || url;
}
