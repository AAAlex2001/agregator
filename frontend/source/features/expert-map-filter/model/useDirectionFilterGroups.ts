"use client";

import { useEffect, useState } from "react";
import { fetchAuditCatalogs } from "@/source/features/directions/audit";
import { fetchEcologyCatalogs } from "@/source/features/directions/ecology";
import { fetchResearchCatalogs } from "@/source/features/directions/research";
import { fetchTechDiagCatalogs } from "@/source/features/directions/tech-diag";
import {
  CADASTRAL_FILTER_GROUPS,
  FORENSIC_FILTER_GROUPS,
  type MapFilterGroup,
} from "./mapFilterGroups";

const STATIC_GROUPS: Record<string, MapFilterGroup[]> = {
  CADASTRAL: CADASTRAL_FILTER_GROUPS,
  FORENSIC: FORENSIC_FILTER_GROUPS,
};

const LOADED_DIRECTIONS = ["AUDIT_SUPB", "TECH_DIAG", "ECOLOGY", "RESEARCH"];

export function useDirectionFilterGroups(direction: string | null): MapFilterGroup[] {
  const [loaded, setLoaded] = useState<MapFilterGroup[]>([]);

  useEffect(() => {
    if (direction === "AUDIT_SUPB") {
      fetchAuditCatalogs()
        .then((catalogs) =>
          setLoaded([
            { label: "Квалификация аудитора", options: catalogs.audit_qualifications.map(toOption) },
            { label: "Области аттестации", options: catalogs.industrial_safety_areas.map(toOption) },
          ]),
        )
        .catch(() => {});
    }
    if (direction === "TECH_DIAG") {
      fetchTechDiagCatalogs()
        .then((catalogs) =>
          setLoaded([
            { label: "Виды контроля", options: catalogs.methods.map(toOption) },
            { label: "Объекты контроля", options: catalogs.control_objects.map(toOption) },
          ]),
        )
        .catch(() => {});
    }
    if (direction === "ECOLOGY") {
      fetchEcologyCatalogs()
        .then((catalogs) =>
          setLoaded([{ label: "Виды работ", options: catalogs.work_types.map(toOption) }]),
        )
        .catch(() => {});
    }
    if (direction === "RESEARCH") {
      fetchResearchCatalogs()
        .then((catalogs) =>
          setLoaded([
            { label: "Учёная степень", options: catalogs.academic_degrees.map(toTitleOption) },
            { label: "Отрасль науки", options: catalogs.science_branches.map(toTitleOption) },
            { label: "Учёное звание", options: catalogs.academic_titles.map(toTitleOption) },
          ]),
        )
        .catch(() => {});
    }
  }, [direction]);

  if (direction !== null && direction in STATIC_GROUPS) return STATIC_GROUPS[direction];
  if (direction !== null && LOADED_DIRECTIONS.includes(direction)) return loaded;
  return [];
}

function toOption(item: { code: string; title: string }) {
  return { value: item.code, short: item.code, title: item.title };
}

function toTitleOption(item: { code: string; title: string }) {
  return { value: item.code, title: item.title };
}
