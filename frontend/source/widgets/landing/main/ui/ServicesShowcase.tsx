"use client";

import { useRouter } from "next/navigation";
import { ServicesAccordion, type ServicesAccordionItem } from "../../shared/ui/ServicesAccordion";
import { HeroExpertsMap } from "../../shared/ui/HeroExpertsMap";
import { SERVICES_SHOWCASE } from "../../shared/model/servicesShowcase";
import { buildLandingHref } from "../../shared/model/buildHref";
import s from "./services-showcase.module.scss";

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
            <HeroExpertsMap
              hideHead
              mapOnly={item.href !== "/"}
              direction={item.href === "/" ? undefined : (item.direction ?? null)}
            />
          </div>
        </div>
      )}
    />
  );
};

export default ServicesShowcase;
