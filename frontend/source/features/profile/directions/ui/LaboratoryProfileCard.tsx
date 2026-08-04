"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  fetchLaboratoryProfile,
  LaboratoryProfileFields,
  laboratoryProfileSchema,
  saveLaboratoryProfile,
  type LaboratoryProfile,
} from "@/source/features/directions/laboratory";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function validate(profile: LaboratoryProfile): string | null {
  return firstSchemaError(laboratoryProfileSchema, profile);
}

export function LaboratoryProfileCard() {
  const { value, setValue } = useDirectionProfile({
    title: "Лабораторные исследования",
    load: fetchLaboratoryProfile,
    save: saveLaboratoryProfile,
    validate,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <LaboratoryProfileFields value={value} onChange={setValue} />;
}
