"use client";

import { useState, type ReactNode } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { FormSection } from "@/source/shared/ui";
import type { UserRole } from "@/source/entities/user";
import { AuditCustomerProfileCard } from "./AuditCustomerProfileCard";
import { DirectionMarksCard } from "./DirectionMarksCard";
import { AuditExpertProfileCard } from "./AuditExpertProfileCard";
import { AuditLicenseHolderProfileCard } from "./AuditLicenseHolderProfileCard";
import { CadastralProfileCard } from "./CadastralProfileCard";
import { ExpertiseProfileCard } from "./ExpertiseProfileCard";
import { ForensicProfileCard } from "./ForensicProfileCard";
import { LaboratoryProfileCard } from "./LaboratoryProfileCard";
import { ResearchProfileCard } from "./ResearchProfileCard";
import { TechDiagHolderProfileCard } from "./TechDiagHolderProfileCard";
import { TechDiagProfileCard } from "./TechDiagProfileCard";
import { DesignHolderProfileCard } from "./DesignHolderProfileCard";
import { DesignProfileCard } from "./DesignProfileCard";
import { EcologyProfileCard } from "./EcologyProfileCard";
import { SurveyHolderProfileCard } from "./SurveyHolderProfileCard";
import { SurveyProfileCard } from "./SurveyProfileCard";
import s from "./DirectionsSection.module.scss";

const EXPERT_TABS = [
  { id: "EXPERTISE", label: "Экспертиза промышленной безопасности" },
  { id: "AUDIT_SUPB", label: "Аудит СУПБ" },
  { id: "CADASTRAL", label: "Кадастровые работы" },
  { id: "FORENSIC", label: "Судебная экспертиза" },
  { id: "RESEARCH", label: "НИР" },
  { id: "LABORATORY", label: "Лабораторные исследования" },
  { id: "TECH_DIAG", label: "Техдиагностирование" },
  { id: "DESIGN", label: "Проектирование" },
  { id: "ECOLOGY", label: "Экология" },
  { id: "SURVEY", label: "Изыскания" },
];

const CUSTOMER_TABS = [{ id: "AUDIT_SUPB", label: "Аудит СУПБ" }];

const LICENSE_HOLDER_TABS = [
  { id: "EXPERTISE", label: "Экспертиза промышленной безопасности" },
  { id: "AUDIT_SUPB", label: "Аудит СУПБ" },
  { id: "TECH_DIAG", label: "Лаборатория НК" },
  { id: "DESIGN", label: "СРО проектировщиков" },
  { id: "SURVEY", label: "СРО изыскателей" },
];

interface Props {
  role: UserRole;
  licenseHolderExpertiseCard?: ReactNode;
}

export function DirectionsSection({ role, licenseHolderExpertiseCard }: Props) {
  const tabs =
    role === "EXPERT"
      ? EXPERT_TABS
      : role === "CUSTOMER"
        ? CUSTOMER_TABS
        : LICENSE_HOLDER_TABS;
  const [activeKey, setActiveKey] = useState(tabs[0]?.id ?? "");

  if (!tabs.length) return null;

  const cards =
    role === "EXPERT"
      ? [
          { id: "EXPERTISE", card: <ExpertiseProfileCard /> },
          { id: "AUDIT_SUPB", card: <AuditExpertProfileCard /> },
          { id: "CADASTRAL", card: <CadastralProfileCard /> },
          { id: "FORENSIC", card: <ForensicProfileCard /> },
          { id: "RESEARCH", card: <ResearchProfileCard /> },
          { id: "LABORATORY", card: <LaboratoryProfileCard /> },
          { id: "TECH_DIAG", card: <TechDiagProfileCard /> },
          { id: "DESIGN", card: <DesignProfileCard /> },
          { id: "ECOLOGY", card: <EcologyProfileCard /> },
          { id: "SURVEY", card: <SurveyProfileCard /> },
        ]
      : role === "CUSTOMER"
        ? [{ id: "AUDIT_SUPB", card: <AuditCustomerProfileCard /> }]
        : [
            { id: "EXPERTISE", card: licenseHolderExpertiseCard },
            { id: "AUDIT_SUPB", card: <AuditLicenseHolderProfileCard /> },
            { id: "TECH_DIAG", card: <TechDiagHolderProfileCard /> },
            { id: "DESIGN", card: <DesignHolderProfileCard /> },
            { id: "SURVEY", card: <SurveyHolderProfileCard /> },
          ];

  return (
    <FormSection
      title="Направления работы"
      hint="Заполните анкету по каждому направлению, по которому готовы работать."
      collapsible
    >
      <div className={s.body}>
        <Tabs tabs={tabs} activeTab={activeKey} onTabChange={setActiveKey} variant="squared" />

        {cards.map((entry) => (
          <div key={entry.id} className={s.card} hidden={entry.id !== activeKey}>
            {entry.card}
          </div>
        ))}

        {role !== "EXPERT" && <DirectionMarksCard />}
      </div>
    </FormSection>
  );
}
