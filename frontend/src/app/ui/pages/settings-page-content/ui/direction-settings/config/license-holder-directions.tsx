import { AuditHolderProfileEditor } from "@/widgets/audit-holder-profile";
import { SroProfileEditor } from "@/widgets/sro-profile";
import { TechDiagHolderProfileEditor } from "@/widgets/tech-diag-holder-profile";
import type { DirectionTab } from "../model/types";

/** Анкеты держателя документов после вкладки условий лицензии. */
export const LICENSE_HOLDER_DIRECTIONS: DirectionTab[] = [
  {
    id: "AUDIT_SUPB",
    label: "Аудит СУПБ",
    editor: <AuditHolderProfileEditor />,
  },
  {
    id: "TECH_DIAG",
    label: "Лаборатория НК",
    editor: <TechDiagHolderProfileEditor />,
  },
  {
    id: "DESIGN",
    label: "СРО проектировщиков",
    editor: <SroProfileEditor direction="design" />,
  },
  {
    id: "SURVEY",
    label: "СРО изыскателей",
    editor: <SroProfileEditor direction="survey" />,
  },
];
