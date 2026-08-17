"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  emptyResearchCatalogs,
  fetchResearchCatalogs,
  fetchResearchProfile,
  ResearchProfileFields,
  saveResearchProfile,
  type ResearchCatalogs,
} from "@/source/features/directions/research";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

export function ResearchProfileCard() {
  const [catalogs, setCatalogs] = useState<ResearchCatalogs>(emptyResearchCatalogs);
  const { value, setValue } = useDirectionProfile({
    title: "Научно-исследовательские работы",
    load: fetchResearchProfile,
    save: saveResearchProfile,
  });

  useEffect(() => {
    let alive = true;
    fetchResearchCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <ResearchProfileFields value={value} onChange={setValue} catalogs={catalogs} />;
}
