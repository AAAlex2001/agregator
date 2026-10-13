"use client";

import type { OrderWorkType } from "@/source/entities/order";
import { AuditOrderFields, type AuditOrderDetails } from "../audit";
import { CadastralOrderFields, type CadastralOrderDetails } from "../cadastral";
import { DesignOrderFields, type DesignOrderDetails } from "../design";
import { EcologyOrderFields, type EcologyOrderDetails } from "../ecology";
import { ForensicOrderFields, type ForensicOrderDetails } from "../forensic";
import { LaboratoryOrderFields, type LaboratoryOrderDetails } from "../laboratory";
import { ResearchOrderFields, type ResearchOrderDetails } from "../research";
import { SurveyOrderFields, type SurveyOrderDetails } from "../survey";
import { TechDiagOrderFields, type TechDiagOrderDetails } from "../tech-diag";
import type { OrderCatalogs } from "./catalogs";
import type { DirectionOrderDetails } from "./types";

interface DirectionOrderFieldsProps {
  workType: OrderWorkType;
  value: DirectionOrderDetails;
  catalogs: OrderCatalogs;
  onChange: (value: DirectionOrderDetails) => void;
}

/** Анкета заказа выбранного направления. */
export function DirectionOrderFields({ workType, value, catalogs, onChange }: DirectionOrderFieldsProps) {
  switch (workType) {
    case "AUDIT_SUPB":
      return <AuditOrderFields value={value as AuditOrderDetails} onChange={onChange} catalogs={catalogs.audit} />;
    case "CADASTRAL":
      return <CadastralOrderFields value={value as CadastralOrderDetails} onChange={onChange} />;
    case "DESIGN":
      return <DesignOrderFields value={value as DesignOrderDetails} onChange={onChange} catalogs={catalogs.design} />;
    case "ECOLOGY":
      return <EcologyOrderFields value={value as EcologyOrderDetails} onChange={onChange} catalogs={catalogs.ecology} />;
    case "FORENSIC":
      return <ForensicOrderFields value={value as ForensicOrderDetails} onChange={onChange} />;
    case "LABORATORY":
      return <LaboratoryOrderFields value={value as LaboratoryOrderDetails} onChange={onChange} />;
    case "RESEARCH":
      return <ResearchOrderFields value={value as ResearchOrderDetails} onChange={onChange} />;
    case "SURVEY":
      return <SurveyOrderFields value={value as SurveyOrderDetails} onChange={onChange} catalogs={catalogs.survey} />;
    case "TECH_DIAG":
      return <TechDiagOrderFields value={value as TechDiagOrderDetails} onChange={onChange} />;
    default:
      return null;
  }
}
