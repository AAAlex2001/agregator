"use client";

import { useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { FormSection } from "@/source/shared/ui";
import type { UserRole } from "@/source/entities/user";
import { AuditCustomerProfileCard } from "./AuditCustomerProfileCard";
import { AuditExpertProfileCard } from "./AuditExpertProfileCard";
import { CadastralProfileCard } from "./CadastralProfileCard";
import { ExpertiseProfileCard } from "./ExpertiseProfileCard";
import { ForensicProfileCard } from "./ForensicProfileCard";
import { LaboratoryProfileCard } from "./LaboratoryProfileCard";
import { ResearchProfileCard } from "./ResearchProfileCard";
import s from "./DirectionsSection.module.scss";

const EXPERT_TABS = [
  { id: "EXPERTISE", label: "Экспертиза промышленной безопасности" },
  { id: "AUDIT_SUPB", label: "Аудит СУПБ" },
  { id: "CADASTRAL", label: "Кадастровые работы" },
  { id: "FORENSIC", label: "Судебная экспертиза" },
  { id: "RESEARCH", label: "НИР" },
  { id: "LABORATORY", label: "Лабораторные исследования" },
];

const CUSTOMER_TABS = [{ id: "AUDIT_SUPB", label: "Аудит СУПБ" }];

interface Props {
  role: UserRole;
}

export function DirectionsSection({ role }: Props) {
  const tabs = role === "EXPERT" ? EXPERT_TABS : role === "CUSTOMER" ? CUSTOMER_TABS : [];
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
        ]
      : [{ id: "AUDIT_SUPB", card: <AuditCustomerProfileCard /> }];

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
      </div>
    </FormSection>
  );
}
