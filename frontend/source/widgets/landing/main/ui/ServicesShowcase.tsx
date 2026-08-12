"use client";

import { useRouter } from "next/navigation";
import { DesignSpecialistsMap } from "@/source/features/design-map-filter";
import { ExpertiseExpertsMap, DirectionExpertsMap } from "@/source/features/expert-map-filter";
import { ServicesAccordion, type ServicesAccordionItem } from "../../shared/ui/ServicesAccordion";
import { SERVICES_SHOWCASE, type ServiceShowcaseItem } from "../../shared/model/servicesShowcase";
import { buildLandingHref } from "../../shared/model/buildHref";
import s from "./services-showcase.module.scss";

function DirectionMap({ item }: { item: ServiceShowcaseItem }) {
  if (item.slug === "epb") return <ExpertiseExpertsMap />;
  if (item.slug === "proektirovanie") return <DesignSpecialistsMap />;
  return <DirectionExpertsMap direction={item.direction ?? null} />;
}

type ServicesShowcaseProps = {
  basePath?: string;
  activeHref?: string;
};

const ServicesShowcase = ({ basePath = "", activeHref = "/" }: ServicesShowcaseProps) => {
  const router = useRouter();
  const activeIndex = SERVICES_SHOWCASE.findIndex((item) => item.href === activeHref);

  const openDirection = (item: ServicesAccordionItem) => {
    if (!item.href || item.href === activeHref) return;
    router.push(buildLandingHref(basePath, item.href));
  };

  return (
    <ServicesAccordion
      items={SERVICES_SHOWCASE}
      hideItemText
      mobileStack
      initialActiveIndex={activeIndex >= 0 ? activeIndex : 0}
      onSelect={openDirection}
      renderVisual={(item) => (
        <div className={s.mapVisual}>
          <p className={s.mapText}>{item.text}</p>
          <div className={s.mapBox}>
            <DirectionMap item={item} />
          </div>
        </div>
      )}
    />
  );
};

export default ServicesShowcase;
