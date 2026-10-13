/** Копирует в буфер обмена адрес публикации на сайте. */
export function copyPostLink(id: number): Promise<void> {
  return navigator.clipboard.writeText(`${window.location.origin}/posts/${id}`);
}
