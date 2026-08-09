"use client";

import { useEffect, useState } from "react";
import {
  AuditOrderFields,
  emptyAuditCatalogs,
  fetchAuditCatalogs,
  type AuditCatalogs,
} from "@/source/features/directions/audit";
import { CadastralOrderFields } from "@/source/features/directions/cadastral";
import { ForensicOrderFields } from "@/source/features/directions/forensic";
import { LaboratoryOrderFields } from "@/source/features/directions/laboratory";
import { ResearchOrderFields } from "@/source/features/directions/research";
import { TechDiagOrderFields } from "@/source/features/directions/tech-diag";
import type { StepProps } from "./types";
import base from "./sectionBase.module.scss";

export function DirectionDetailsSection({ state, dispatch }: StepProps) {
  const { workType } = state;
  const [auditCatalogs, setAuditCatalogs] = useState<AuditCatalogs>(emptyAuditCatalogs);

  useEffect(() => {
    if (workType !== "AUDIT_SUPB") return;
    fetchAuditCatalogs().then(setAuditCatalogs).catch(() => undefined);
  }, [workType]);

  return (
    <section className={base.section}>
      {workType === "CADASTRAL" && (
        <CadastralOrderFields
          value={state.cadastralDetails}
          onChange={(value) => dispatch({ type: "cadastral", value })}
        />
      )}

      {workType === "FORENSIC" && (
        <ForensicOrderFields
          value={state.forensicDetails}
          onChange={(value) => dispatch({ type: "forensic", value })}
        />
      )}

      {workType === "RESEARCH" && (
        <ResearchOrderFields
          value={state.researchDetails}
          onChange={(value) => dispatch({ type: "research", value })}
        />
      )}

      {workType === "LABORATORY" && (
        <LaboratoryOrderFields
          value={state.laboratoryDetails}
          onChange={(value) => dispatch({ type: "laboratory", value })}
        />
      )}

      {workType === "AUDIT_SUPB" && (
        <AuditOrderFields
          value={state.auditDetails}
          onChange={(value) => dispatch({ type: "audit", value })}
          catalogs={auditCatalogs}
        />
      )}

      {workType === "TECH_DIAG" && (
        <TechDiagOrderFields
          value={state.techDiagDetails}
          onChange={(value) => dispatch({ type: "techDiag", value })}
        />
      )}
    </section>
  );
}
