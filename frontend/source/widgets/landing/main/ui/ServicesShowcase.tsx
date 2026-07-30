"use client";

import Button from "@/source/shared/ui/Button";
import { ServicesAccordion } from "../../shared/ui/ServicesAccordion";
import { SERVICES_SHOWCASE } from "../../shared/model/servicesShowcase";
import s from "./services-showcase.module.scss";

type ServicesShowcaseProps = {
  buttonText: string;
};

const ServicesShowcase = ({ buttonText }: ServicesShowcaseProps) => (
  <ServicesAccordion
    items={SERVICES_SHOWCASE}
    renderActions={(item) =>
      item.href ? (
        <Button href={item.href} variant="primary" fullWidth showArrow className={s.button}>
          {buttonText}
        </Button>
      ) : (
        <Button variant="primary" fullWidth className={s.button}>
          Скоро
        </Button>
      )
    }
  />
);

export default ServicesShowcase;
