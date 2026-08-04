"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useRegisterProfileSave } from "@/source/entities/user";

interface Options<TProfile> {
  title: string;
  load: () => Promise<TProfile>;
  save: (profile: TProfile) => Promise<TProfile>;
  validate: (profile: TProfile) => string | null;
}

export function useDirectionProfile<TProfile>({ title, load, save, validate }: Options<TProfile>) {
  const { showError } = useNotifications();
  const [value, setValue] = useState<TProfile | null>(null);
  const [saved, setSaved] = useState<TProfile | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    load()
      .then((profile) => {
        if (!alive) return;
        setValue(profile);
        setSaved(profile);
      })
      .catch(() => showError(`Не удалось загрузить анкету «${title}»`));
    return () => {
      alive = false;
    };
  }, [load, showError, title]);

  useRegisterProfileSave(async () => {
    if (value === null || value === saved) return;
    const message = validate(value);
    if (message) throw new Error(`${title}: ${message}`);
    const persisted = await save(value);
    setValue(persisted);
    setSaved(persisted);
  });

  const applyServerUpdate = (updater: () => Promise<TProfile>, merge: (current: TProfile, server: TProfile) => TProfile) => {
    if (isBusy) return;
    setIsBusy(true);
    updater()
      .then((server) => {
        setValue((current) => (current === null ? server : merge(current, server)));
        setSaved((current) => (current === null ? server : merge(current, server)));
      })
      .catch((error) =>
        showError(error instanceof Error ? error.message : "Не удалось обновить файлы анкеты"),
      )
      .finally(() => setIsBusy(false));
  };

  return { value, setValue, isBusy, applyServerUpdate };
}
