"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  expertiseProfileSchema,
  ExpertiseProfileFields,
  fetchExpertiseProfile,
  saveExpertiseProfile,
  type ExpertiseProfile,
} from "@/source/features/directions/expertise";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function validate(profile: ExpertiseProfile): string | null {
  return firstSchemaError(expertiseProfileSchema, profile);
}

export function ExpertiseProfileCard() {
  const { value, setValue } = useDirectionProfile({
    title: "Экспертиза промышленной безопасности",
    load: fetchExpertiseProfile,
    save: saveExpertiseProfile,
    validate,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <ExpertiseProfileFields value={value} onChange={setValue} />;
}
