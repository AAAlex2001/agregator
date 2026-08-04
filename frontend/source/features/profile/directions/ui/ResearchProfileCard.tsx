"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  fetchResearchProfile,
  ResearchProfileFields,
  researchProfileSchema,
  saveResearchProfile,
  type ResearchProfile,
} from "@/source/features/directions/research";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function validate(profile: ResearchProfile): string | null {
  return firstSchemaError(researchProfileSchema, profile);
}

export function ResearchProfileCard() {
  const { value, setValue } = useDirectionProfile({
    title: "Научно-исследовательские работы",
    load: fetchResearchProfile,
    save: saveResearchProfile,
    validate,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <ResearchProfileFields value={value} onChange={setValue} />;
}
