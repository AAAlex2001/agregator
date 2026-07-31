"use client";

import Button from "@/source/shared/ui/Button";
import { ServicesAccordion } from "../../shared/ui/ServicesAccordion";
import { HeroExpertsMap } from "../../shared/ui/HeroExpertsMap";
import { SERVICES_SHOWCASE } from "../../shared/model/servicesShowcase";
import s from "./services-showcase.module.scss";

type ServicesShowcaseProps = {
  buttonText: string;
};

const ServicesShowcase = ({ buttonText }: ServicesShowcaseProps) => (
  <ServicesAccordion
    items={SERVICES_SHOWCASE}
    hideItemText
    mobileStack
    renderVisual={(item) => (
      <div className={s.mapVisual}>
        <p className={s.mapText}>{item.text}</p>
        <div className={s.mapBox}>
          <HeroExpertsMap hideHead mapOnly={item.href !== "/"} />
        </div>
      </div>
    )}
    renderActions={(item) => {
      if (item.href === "/") return null;
      return item.href ? (
        <Button href={item.href} variant="primary" fullWidth showArrow className={s.button}>
          {buttonText}
        </Button>
      ) : (
        <Button variant="primary" fullWidth className={s.button}>
          Скоро
        </Button>
      );
    }}
  />
);

export default ServicesShowcase;
