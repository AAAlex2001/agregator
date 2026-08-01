"use client";

import Tabs from "@/source/shared/ui/Tabs";
import Loader from "@/source/shared/ui/Loader";
import { FormSection } from "@/source/shared/ui";
import type { DirectionKey } from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import { getDirectionForm } from "@/source/features/direction-forms";
import { useProfileDirections } from "../model/useProfileDirections";
import s from "./DirectionsSection.module.scss";

interface Props {
  role: UserRole;
}

export function DirectionsSection({ role }: Props) {
  const { catalogs, directions, activeKey, profile, selectDirection, changeProfile } =
    useProfileDirections(role);

  if (!directions.length || !activeKey) return null;

  const entry = getDirectionForm(activeKey, role);

  return (
    <FormSection
      title="Направления работы"
      hint="Заполните анкету по каждому направлению, по которому готовы работать."
    >
      <div className={s.body}>
        <Tabs
          tabs={directions.map((direction) => ({ id: direction.key, label: direction.title }))}
          activeTab={activeKey}
          onTabChange={(id) => selectDirection(id as DirectionKey)}
          variant="squared"
        />

        {!profile || !entry ? (
          <Loader />
        ) : (
          <entry.Form value={profile} onChange={changeProfile} catalogs={catalogs} />
        )}
      </div>
    </FormSection>
  );
}
