"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  emptyTechDiagCatalogs,
  fetchTechDiagCatalogs,
  fetchTechDiagHolderProfile,
  saveTechDiagHolderProfile,
  TechDiagHolderProfileFields,
  type TechDiagCatalogs,
} from "@/source/features/directions/tech-diag";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

export function TechDiagHolderProfileCard() {
  const [catalogs, setCatalogs] = useState<TechDiagCatalogs>(emptyTechDiagCatalogs);
  const { value, setValue } = useDirectionProfile({
    title: "Техническое освидетельствование и диагностирование",
    load: fetchTechDiagHolderProfile,
    save: saveTechDiagHolderProfile,
  });

  useEffect(() => {
    let alive = true;
    fetchTechDiagCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <TechDiagHolderProfileFields value={value} onChange={setValue} catalogs={catalogs} />;
}
