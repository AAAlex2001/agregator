"use client";

import Tabs from "@/source/shared/ui/Tabs";
import { FormSection } from "@/source/shared/ui";
import type { DirectionKey } from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import { useProfileDirections } from "../model/useProfileDirections";
import { DirectionDocumentsField } from "./DirectionDocumentsField";
import s from "./DirectionsSection.module.scss";

interface Props {
  role: UserRole;
}

export function DirectionsSection({ role }: Props) {
  const { catalogs, tabs, activeKey, active, selectDirection, changeProfile, changeDocuments } =
    useProfileDirections(role);

  if (!activeKey || !active) return null;

  return (
    <FormSection
      title="Направления работы"
      hint="Заполните анкету по каждому направлению, по которому готовы работать."
      collapsible
    >
      <div className={s.body}>
        <Tabs
          tabs={tabs}
          activeTab={activeKey}
          onTabChange={(id) => selectDirection(id as DirectionKey)}
          variant="squared"
        />

        <active.Form value={active.value} onChange={changeProfile} catalogs={catalogs} />

        {active.supportsDocuments && (
          <DirectionDocumentsField
            directionKey={activeKey}
            documents={active.documents}
            onChange={changeDocuments}
          />
        )}
      </div>
    </FormSection>
  );
}
