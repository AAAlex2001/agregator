"use client";

import Button from "@/source/shared/ui/Button";
import Tabs from "@/source/shared/ui/Tabs";
import Loader from "@/source/shared/ui/Loader";
import type { DirectionKey } from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import { getDirectionForm } from "@/source/features/direction-forms";
import { useProfileDirections } from "../model/useProfileDirections";
import form from "@/source/entities/user/ui/ProfileForm.module.scss";
import s from "./DirectionsSection.module.scss";

interface Props {
  role: UserRole;
}

export function DirectionsSection({ role }: Props) {
  const { catalogs, directions, activeKey, profile, isSaving, selectDirection, changeProfile, save } =
    useProfileDirections(role);

  if (!directions.length || !activeKey) return null;

  const entry = getDirectionForm(activeKey, role);

  return (
    <section className={form.section}>
      <h2 className={form.subtitle}>Направления работы</h2>
      <div className={s.body}>
        <span className={s.hint}>
          Заполните анкету по каждому направлению, по которому готовы работать.
        </span>

        <Tabs
          tabs={directions.map((direction) => ({ id: direction.key, label: direction.title }))}
          activeTab={activeKey}
          onTabChange={(id) => selectDirection(id as DirectionKey)}
          variant="squared"
        />

        {!profile || !entry ? (
          <Loader />
        ) : (
          <>
            <entry.Form value={profile} onChange={changeProfile} catalogs={catalogs} />
            <div className={s.actions}>
              <Button type="button" variant="primary" fullWidth onClick={save} isLoading={isSaving}>
                Сохранить анкету
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
