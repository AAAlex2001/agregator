"use client";

import { useState } from "react";
import type { UserProfile } from "@/entities/user";
import { DirectionMarks } from "@/features/edit-directions";
import { LicenseTermsForm } from "@/features/edit-license-terms";
import { FormSection } from "@/shared/ui/form-section";
import { Tabs } from "@/shared/ui/tabs";
import { CUSTOMER_DIRECTIONS } from "./config/customer-directions";
import { EXPERT_DIRECTIONS } from "./config/expert-directions";
import { LICENSE_HOLDER_DIRECTIONS } from "./config/license-holder-directions";
import type { DirectionTab } from "./model/types";
import styles from "./style.module.scss";

/** Профиль, роль которого определяет набор анкет. */
interface DirectionSettingsProps {
  profile: UserProfile;
}

/** Выбирает анкеты роли; у держателя во вкладке экспертизы — условия лицензии. */
function getDirectionTabs(profile: UserProfile): DirectionTab[] {
  if (profile.role === "EXPERT") {
    return EXPERT_DIRECTIONS;
  }

  if (profile.role === "LICENSE_HOLDER") {
    return [
      {
        id: "EXPERTISE",
        label: "Экспертиза промышленной безопасности",
        editor: <LicenseTermsForm profile={profile} />,
      },
      ...LICENSE_HOLDER_DIRECTIONS,
    ];
  }

  return CUSTOMER_DIRECTIONS;
}

/** Анкеты направлений во вкладках; у заказчика и держателя ещё отметки без анкет. */
export function DirectionSettings({ profile }: DirectionSettingsProps) {
  const tabs = getDirectionTabs(profile);
  const [activeId, setActiveId] = useState(tabs[0].id);

  return (
    <FormSection
      title="Направления работы"
      hint="Заполните анкету по каждому направлению, по которому готовы работать."
      collapsible
    >
      <div className={styles.body}>
        <Tabs
          tabs={tabs}
          activeTab={activeId}
          onTabChange={setActiveId}
          variant="squared"
        />

        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={styles.card}
            hidden={tab.id !== activeId}
          >
            {tab.editor}
          </div>
        ))}

        {profile.role !== "EXPERT" && <DirectionMarks profile={profile} />}
      </div>
    </FormSection>
  );
}
