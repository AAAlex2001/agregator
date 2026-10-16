import type { Metadata } from "next";

/** Запрет индексации закрытого раздела кабинета. */
export const PRIVATE_SECTION_METADATA: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/** Заголовок страницы, закрытой от индексации: личный раздел или отсутствующий материал. */
export function createPrivateMetadata(title: string): Metadata {
  return {
    ...PRIVATE_SECTION_METADATA,
    title,
  };
}
