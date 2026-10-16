import type { ReactNode } from "react";
import { CabinetShell } from "../ui/shells/cabinet-shell";

/** Страница кабинета или публикаций. */
interface CabinetLayoutProps {
  children: ReactNode;
}

/** Сохраняет меню и счётчики кабинета при переходах между его страницами и публикациями. */
export default function CabinetLayout({ children }: CabinetLayoutProps) {
  return <CabinetShell>{children}</CabinetShell>;
}
