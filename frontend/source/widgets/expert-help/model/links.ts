import type { ComponentType } from "react";
import { DangerIcon, LiningIcon } from "@/source/shared/ui/icons";

export interface ExpertHelpLink {
  href: string;
  label: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
}

export const EXPERT_HELP_LINKS: ExpertHelpLink[] = [
  {
    href: "/expert/hazard",
    label: "Анализ риска аварий",
    description: "Расчёт показателей риска аварий по факторам R0–R9 с PDF-отчётом",
    Icon: DangerIcon,
  },
  {
    href: "/expert/lining",
    label: "Расчёт остаточного ресурса",
    description: "Срок службы анкерной крепи по факторам риска с PDF-отчётом",
    Icon: LiningIcon,
  },
];
