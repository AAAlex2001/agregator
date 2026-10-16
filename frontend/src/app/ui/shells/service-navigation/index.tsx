"use client";

import { useRouter } from "next/navigation";
import type { DirectionCode } from "@/entities/direction";
import {
  DesignSpecialistsMap,
  DirectionExpertsMap,
  ExpertiseExpertsMap,
  SurveySpecialistsMap,
} from "@/features/filter-experts-map";
import { LandingNavigation } from "@/widgets/landing";

/** Активная услуга и префикс страниц внутри кабинета. */
interface ServiceNavigationProps {
  activeHref: string;
  basePath: string;
}

/** Подключает профильные фильтры карты выбранного направления. */
function renderMap(direction: DirectionCode | null) {
  if (direction === "EXPERTISE") {
    return <ExpertiseExpertsMap />;
  }

  if (direction === "DESIGN") {
    return <DesignSpecialistsMap />;
  }

  if (direction === "SURVEY") {
    return <SurveySpecialistsMap />;
  }

  return <DirectionExpertsMap direction={direction} />;
}

/** Связывает выбор услуги с маршрутом приложения и соответствующей картой. */
export function ServiceNavigation({
  activeHref,
  basePath,
}: ServiceNavigationProps) {
  const router = useRouter();

  /** Открывает выбранную услугу в публичном разделе или кабинете. */
  function navigate(href: string) {
    router.push(href === "/" ? basePath || "/" : `${basePath}${href}`);
  }

  return (
    <LandingNavigation
      activeHref={activeHref}
      onNavigate={navigate}
      renderMap={renderMap}
    />
  );
}
