"use client";

import { useEffect, useState } from "react";
import { fetchAuditCatalogs } from "@/source/features/directions/audit";
import { fetchTechDiagCatalogs } from "@/source/features/directions/tech-diag";
import {
  CADASTRAL_FILTER_GROUPS,
  FORENSIC_FILTER_GROUPS,
  RESEARCH_FILTER_GROUPS,
  type MapFilterGroup,
} from "./mapFilterGroups";

const STATIC_GROUPS: Record<string, MapFilterGroup[]> = {
  CADASTRAL: CADASTRAL_FILTER_GROUPS,
  FORENSIC: FORENSIC_FILTER_GROUPS,
  RESEARCH: RESEARCH_FILTER_GROUPS,
};

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
  }, [direction]);

  if (direction !== null && direction in STATIC_GROUPS) return STATIC_GROUPS[direction];
  if (direction === "AUDIT_SUPB" || direction === "TECH_DIAG") return loaded;
  return [];
}

function toOption(item: { code: string; title: string }) {
  return { value: item.code, short: item.code, title: item.title };
}
