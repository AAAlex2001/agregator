import type { ReactNode } from "react";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";

/** Содержимое публичного маршрута. */
interface PublicLayoutProps {
  children: ReactNode;
}

/** Добавляет прежнюю кнопку возврата наверх на публичные страницы. */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      {children}
      <ScrollToTop />
    </>
  );
}
