"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  ExpertiseProfileFields,
  fetchExpertiseProfile,
  saveExpertiseProfile,
} from "@/source/features/directions/expertise";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

export function ExpertiseProfileCard() {
  const { value, setValue } = useDirectionProfile({
    title: "Экспертиза промышленной безопасности",
    load: fetchExpertiseProfile,
    save: saveExpertiseProfile,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <ExpertiseProfileFields value={value} onChange={setValue} />;
}
