"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  fetchResearchProfile,
  ResearchProfileFields,
  saveResearchProfile,
} from "@/source/features/directions/research";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

export function ResearchProfileCard() {
  const { value, setValue } = useDirectionProfile({
    title: "Научно-исследовательские работы",
    load: fetchResearchProfile,
    save: saveResearchProfile,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <ResearchProfileFields value={value} onChange={setValue} />;
}
