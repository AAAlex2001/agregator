"use client";

import Tabs from "@/source/shared/ui/Tabs";
import { FormSection } from "@/source/shared/ui";
import type { DirectionKey } from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import { useProfileDirections } from "../model/useProfileDirections";
import s from "./DirectionsSection.module.scss";

interface Props {
  role: UserRole;
}

export function DirectionsSection({ role }: Props) {
  const { catalogs, tabs, activeKey, active, selectDirection, changeProfile } =
    useProfileDirections(role);

  if (!activeKey || !active) return null;

  return (
    <FormSection
      title="Направления работы"
      hint="Заполните анкету по каждому направлению, по которому готовы работать."
    >
      <div className={s.body}>
        <Tabs
          tabs={tabs}
          activeTab={activeKey}
          onTabChange={(id) => selectDirection(id as DirectionKey)}
          variant="squared"
        />

        <active.Form value={active.value} onChange={changeProfile} catalogs={catalogs} />
      </div>
    </FormSection>
  );
}
