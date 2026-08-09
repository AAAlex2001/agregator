"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  fetchLaboratoryProfile,
  LaboratoryProfileFields,
  saveLaboratoryProfile,
} from "@/source/features/directions/laboratory";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

export function LaboratoryProfileCard() {
  const { value, setValue } = useDirectionProfile({
    title: "Лабораторные исследования",
    load: fetchLaboratoryProfile,
    save: saveLaboratoryProfile,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <LaboratoryProfileFields value={value} onChange={setValue} />;
}
