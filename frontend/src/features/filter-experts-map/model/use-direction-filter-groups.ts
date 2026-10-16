"use client";

import { useAuditOptions } from "@/entities/audit";
import { useEcologyOptions } from "@/entities/ecology";
import { useResearchOptions } from "@/entities/research";
import { useTechDiagOptions } from "@/entities/tech-diag";
import type { FilterDropdownOption } from "@/shared/ui/filter-dropdown";
import {
  CADASTRAL_FILTER_GROUPS,
  FORENSIC_FILTER_GROUPS,
} from "../config/direction-filter-groups";
import type { MapFilterGroup } from "./types";

/** Подготавливает код и название справочника для списка фильтра. */
function toCodeOption(option: { code: string; title: string }): FilterDropdownOption {
  return {
    value: option.code,
    short: option.code,
    title: option.title,
  };
}

/** Показывает научную квалификацию без технического сокращения её кода. */
function toTitleOption(option: { code: string; title: string }): FilterDropdownOption {
  return {
    value: option.code,
    title: option.title,
  };
}

/** Скрывает незагруженные списки; при повторной ошибке оставляет сохранённые варианты. */
function getLoadedGroups(
  groups: MapFilterGroup[],
  isLoading: boolean,
  error: string | null,
): MapFilterGroup[] {
  const hasOptions = groups.some((group) => group.options.length > 0);

  if (isLoading || (error && !hasOptions)) {
    return [];
  }

  return groups;
}

/** Получает справочники только выбранного направления и задаёт группы фильтров карты. */
export function useDirectionFilterGroups(direction: string | null): MapFilterGroup[] {
  const audit = useAuditOptions(direction === "AUDIT_SUPB");
  const techDiag = useTechDiagOptions(direction === "TECH_DIAG");
  const ecology = useEcologyOptions(direction === "ECOLOGY");
  const research = useResearchOptions(direction === "RESEARCH");

  if (direction === "CADASTRAL") {
    return CADASTRAL_FILTER_GROUPS;
  }

  if (direction === "FORENSIC") {
    return FORENSIC_FILTER_GROUPS;
  }

  if (direction === "AUDIT_SUPB") {
    return getLoadedGroups([
      {
        label: "Квалификация аудитора",
        options: audit.options.auditQualifications.map((option) => ({
          value: option.value,
          short: option.value,
          title: option.label,
        })),
      },
      {
        label: "Области аттестации",
        options: audit.options.industrialSafetyAreas.map((option) => ({
          value: option.value,
          short: option.value,
          title: option.label,
        })),
      },
    ], audit.isLoading, audit.error);
  }

  if (direction === "TECH_DIAG") {
    return getLoadedGroups([
      {
        label: "Виды контроля",
        options: techDiag.options.methods.map(toCodeOption),
      },
      {
        label: "Объекты контроля",
        options: techDiag.options.control_objects.map(toCodeOption),
      },
    ], techDiag.isLoading, techDiag.error);
  }

  if (direction === "ECOLOGY") {
    return getLoadedGroups([
      {
        label: "Виды работ",
        options: ecology.options.work_types.map(toCodeOption),
      },
    ], ecology.isLoading, ecology.error);
  }

  if (direction === "RESEARCH") {
    const qualifications = [
      ...research.options.academic_degrees,
      ...research.options.academic_titles,
    ];

    return getLoadedGroups([
      {
        label: "Степень и звание",
        options: qualifications.map(toTitleOption),
      },
      {
        label: "Отрасль науки",
        options: research.options.science_branches.map(toTitleOption),
      },
    ], research.isLoading, research.error);
  }

  return [];
}
