"use client";

import { useState, type ReactNode } from "react";
import { FormSection } from "@/source/shared/ui";
import Tabs from "@/source/shared/ui/Tabs";
import { AuditCustomerProfileCard } from "./AuditCustomerProfileCard";
import { AuditExpertProfileCard } from "./AuditExpertProfileCard";
import { AuditLicenseHolderProfileCard } from "./AuditLicenseHolderProfileCard";
import { CadastralProfileCard } from "./CadastralProfileCard";
import { DesignHolderProfileCard } from "./DesignHolderProfileCard";
import { DesignProfileCard } from "./DesignProfileCard";
import { DirectionMarks } from "./DirectionMarks";
import { EcologyProfileCard } from "./EcologyProfileCard";
import { ExpertiseProfileCard } from "./ExpertiseProfileCard";
import { ForensicProfileCard } from "./ForensicProfileCard";
import { LaboratoryProfileCard } from "./LaboratoryProfileCard";
import { ResearchProfileCard } from "./ResearchProfileCard";
import { SurveyHolderProfileCard } from "./SurveyHolderProfileCard";
import { SurveyProfileCard } from "./SurveyProfileCard";
import { TechDiagHolderProfileCard } from "./TechDiagHolderProfileCard";
import { TechDiagProfileCard } from "./TechDiagProfileCard";
import s from "./DirectionsSection.module.scss";

interface DirectionTab {
  id: string;
  label: string;
  card: ReactNode;
}

const expertTabs = (): DirectionTab[] => [
  { id: "EXPERTISE", label: "Экспертиза промышленной безопасности", card: <ExpertiseProfileCard /> },
  { id: "AUDIT_SUPB", label: "Аудит СУПБ", card: <AuditExpertProfileCard /> },
  { id: "CADASTRAL", label: "Кадастровые работы", card: <CadastralProfileCard /> },
  { id: "FORENSIC", label: "Судебная экспертиза", card: <ForensicProfileCard /> },
  { id: "RESEARCH", label: "НИР", card: <ResearchProfileCard /> },
  { id: "LABORATORY", label: "Лабораторные исследования", card: <LaboratoryProfileCard /> },
  { id: "TECH_DIAG", label: "Техдиагностирование", card: <TechDiagProfileCard /> },
  { id: "DESIGN", label: "Проектирование", card: <DesignProfileCard /> },
  { id: "ECOLOGY", label: "Экология", card: <EcologyProfileCard /> },
  { id: "SURVEY", label: "Изыскания", card: <SurveyProfileCard /> },
];

const customerTabs = (): DirectionTab[] => [
  { id: "AUDIT_SUPB", label: "Аудит СУПБ", card: <AuditCustomerProfileCard /> },
];

const licenseHolderTabs = (licenseTerms: ReactNode): DirectionTab[] => [
  { id: "EXPERTISE", label: "Экспертиза промышленной безопасности", card: licenseTerms },
  { id: "AUDIT_SUPB", label: "Аудит СУПБ", card: <AuditLicenseHolderProfileCard /> },
  { id: "TECH_DIAG", label: "Лаборатория НК", card: <TechDiagHolderProfileCard /> },
  { id: "DESIGN", label: "СРО проектировщиков", card: <DesignHolderProfileCard /> },
  { id: "SURVEY", label: "СРО изыскателей", card: <SurveyHolderProfileCard /> },
];

function tabsFor(role: string, licenseTerms: ReactNode): DirectionTab[] {
  if (role === "EXPERT") return expertTabs();
  if (role === "LICENSE_HOLDER") return licenseHolderTabs(licenseTerms);
  return customerTabs();
}

interface DirectionsSectionProps {
  role: string;
  licenseTerms?: ReactNode;
}

/** Анкеты по направлениям во вкладках под роль; у заказчика и держателя документов ещё отметки направлений без анкет. */
export function DirectionsSection({ role, licenseTerms }: DirectionsSectionProps) {
  const tabs = tabsFor(role, licenseTerms);
  const [activeId, setActiveId] = useState(tabs[0].id);

  return (
    <FormSection
      title="Направления работы"
      hint="Заполните анкету по каждому направлению, по которому готовы работать."
      collapsible
    >
      <div className={s.body}>
        <Tabs tabs={tabs} activeTab={activeId} onTabChange={setActiveId} variant="squared" />

        {tabs.map((tab) => (
          <div key={tab.id} className={s.card} hidden={tab.id !== activeId}>
            {tab.card}
          </div>
        ))}

        {role !== "EXPERT" && <DirectionMarks />}
      </div>
    </FormSection>
  );
}
