import type { ReactNode } from "react";
import AdminShell from "@/widgets/admin/shell";

/** Страницы админки, доступные только после входа. */
export default function PanelLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
