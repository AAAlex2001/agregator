"use client";

import { useEffect, useState } from "react";
import {
  AuditOrderFields,
  emptyAuditCatalogs,
  fetchAuditCatalogs,
  type AuditCatalogs,
} from "@/source/features/directions/audit";
import { CadastralOrderFields } from "@/source/features/directions/cadastral";
import {
  DesignOrderFields,
  emptyDesignCatalogs,
  fetchDesignCatalogs,
  type DesignCatalogs,
} from "@/source/features/directions/design";
import { EcologyOrderFields } from "@/source/features/directions/ecology";
import { ForensicOrderFields } from "@/source/features/directions/forensic";
import { LaboratoryOrderFields } from "@/source/features/directions/laboratory";
import { ResearchOrderFields } from "@/source/features/directions/research";
import {
  SurveyOrderFields,
  emptySurveyCatalogs,
  fetchSurveyCatalogs,
  type SurveyCatalogs,
} from "@/source/features/directions/survey";
import { TechDiagOrderFields } from "@/source/features/directions/tech-diag";
import type { StepProps } from "./types";
import base from "./sectionBase.module.scss";

export function DirectionDetailsSection({ state, dispatch }: StepProps) {
  const { workType } = state;
  const [auditCatalogs, setAuditCatalogs] = useState<AuditCatalogs>(emptyAuditCatalogs);
  const [designCatalogs, setDesignCatalogs] = useState<DesignCatalogs>(emptyDesignCatalogs);
  const [surveyCatalogs, setSurveyCatalogs] = useState<SurveyCatalogs>(emptySurveyCatalogs);

  useEffect(() => {
    if (workType !== "AUDIT_SUPB") return;
    fetchAuditCatalogs().then(setAuditCatalogs).catch(() => undefined);
  }, [workType]);

  useEffect(() => {
    if (workType !== "DESIGN") return;
    fetchDesignCatalogs().then(setDesignCatalogs).catch(() => undefined);
  }, [workType]);

  useEffect(() => {
    if (workType !== "SURVEY") return;
    fetchSurveyCatalogs().then(setSurveyCatalogs).catch(() => undefined);
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

      {workType === "DESIGN" && (
        <DesignOrderFields
          value={state.designDetails}
          onChange={(value) => dispatch({ type: "design", value })}
          catalogs={designCatalogs}
        />
      )}

      {workType === "ECOLOGY" && (
        <EcologyOrderFields
          value={state.ecologyDetails}
          onChange={(value) => dispatch({ type: "ecology", value })}
        />
      )}

      {workType === "SURVEY" && (
        <SurveyOrderFields
          value={state.surveyDetails}
          onChange={(value) => dispatch({ type: "survey", value })}
          catalogs={surveyCatalogs}
        />
      )}
    </section>
  );
}
