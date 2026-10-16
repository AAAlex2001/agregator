import type { HTMLAttributes, ReactNode, Ref } from "react";

/** Файл галереи: устойчивый id, имя и готовый URL; onRemove разрешает удаление. */
export interface FileGalleryItem {
  id: string;
  name: string;
  url: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  isImage?: boolean;
  onRemove?: () => void;
}

/** HTML-свойства сетки, в том числе обработчики перетаскивания файлов. */
interface FileGalleryGridProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/** Файлы и оформление галереи; ограничения загрузки остаются в вызывающей фиче. */
export interface FileGalleryProps {
  items: FileGalleryItem[];
  label?: string;
  hint?: string;
  emptyText?: string;
  hideWhenEmpty?: boolean;
  variant?: "readonly" | "editable";
  onAdd?: () => void;
  input?: ReactNode;
  blockClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  gridProps?: FileGalleryGridProps;
}
