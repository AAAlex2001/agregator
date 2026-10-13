import type { ReactNode } from "react";
import { CabinetShell } from "@/source/widgets/app-shell";

/** Сохраняет меню и общие данные при переходах между кабинетом и публикациями. */
export default function CabinetLayout({ children }: { children: ReactNode }) {
  return <CabinetShell>{children}</CabinetShell>;
}
