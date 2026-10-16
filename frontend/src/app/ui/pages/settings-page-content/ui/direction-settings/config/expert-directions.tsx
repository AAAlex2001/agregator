import { AuditProfileEditor } from "@/widgets/audit-profile";
import { CadastralProfileEditor } from "@/widgets/cadastral-profile";
import { DesignProfileEditor } from "@/widgets/design-profile";
import { EcologyProfileEditor } from "@/widgets/ecology-profile";
import { ExpertiseProfileEditor } from "@/widgets/expertise-profile";
import { ForensicProfileEditor } from "@/widgets/forensic-profile";
import { LaboratoryProfileEditor } from "@/widgets/laboratory-profile";
import { ResearchProfileEditor } from "@/widgets/research-profile";
import { SurveyProfileEditor } from "@/widgets/survey-profile";
import { TechDiagProfileEditor } from "@/widgets/tech-diag-profile";
import type { DirectionTab } from "../model/types";

/** Анкеты исполнителя по всем направлениям в прежнем порядке вкладок. */
export const EXPERT_DIRECTIONS: DirectionTab[] = [
  {
    id: "EXPERTISE",
    label: "Экспертиза промышленной безопасности",
    editor: <ExpertiseProfileEditor />,
  },
  {
    id: "AUDIT_SUPB",
    label: "Аудит СУПБ",
    editor: <AuditProfileEditor />,
  },
  {
    id: "CADASTRAL",
    label: "Кадастровые работы",
    editor: <CadastralProfileEditor />,
  },
  {
    id: "FORENSIC",
    label: "Судебная экспертиза",
    editor: <ForensicProfileEditor />,
  },
  {
    id: "RESEARCH",
    label: "НИР",
    editor: <ResearchProfileEditor />,
  },
  {
    id: "LABORATORY",
    label: "Лабораторные исследования",
    editor: <LaboratoryProfileEditor />,
  },
  {
    id: "TECH_DIAG",
    label: "Техдиагностирование",
    editor: <TechDiagProfileEditor />,
  },
  {
    id: "DESIGN",
    label: "Проектирование",
    editor: <DesignProfileEditor />,
  },
  {
    id: "ECOLOGY",
    label: "Экология",
    editor: <EcologyProfileEditor />,
  },
  {
    id: "SURVEY",
    label: "Изыскания",
    editor: <SurveyProfileEditor />,
  },
];
