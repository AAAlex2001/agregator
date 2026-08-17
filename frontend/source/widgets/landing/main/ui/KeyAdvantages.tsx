"use client";

import s from "./key-advantages.module.scss";
import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { scrollToRegistration } from "../../shared/lib/scrollToRegistration";

import type { LandingStep } from "../model/landing.data";

type Role = "client" | "expert" | "license_holder";

type KeyAdvantagesProps = {
  clientSteps: LandingStep[];
  expertSteps: LandingStep[];
  licenseHolderSteps: LandingStep[];
  title: string;
  subtitle: string;
};

const KeyAdvantages = ({
  clientSteps,
  expertSteps,
  licenseHolderSteps,
  title,
  subtitle,
}: KeyAdvantagesProps) => {
  const [role, setRole] = useState<Role>("client");

  const stepsByRole: Record<Role, LandingStep[]> = {
    client: clientSteps,
    expert: expertSteps,
    license_holder: licenseHolderSteps,
  };
  const steps = stepsByRole[role];

  const tabs = [
    { id: "client", label: "Я заказчик" },
    { id: "expert", label: "Я исполнитель" },
  ];
  if (licenseHolderSteps.length > 0) {
    tabs.push({ id: "license_holder", label: "Я держатель разрешительных документов" });
  }

  return (
    <section className={s.section} id="key-advantages">
      <div className={s.content}>
        <div className={s.header}>
          <Title text={title} />
          <Subtitle text={subtitle} />
        </div>
        <div className={s.stepsInfo}>
          <Tabs
            tabs={tabs}
            activeTab={role}
            onTabChange={(tabId) => setRole(tabId as Role)}
          />
          <div className={s.steps}>
            {steps.map((value) => (
              <div className={s.step} key={`${role}-${value.id}`}>
                <div className={s.iconWrapper}>
                  <img src={value.icon} alt={value.title} loading="lazy" decoding="async" />
                </div>
                <div className={s.description}>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                  {value.subDescription && (
                    <span className={s.subDescription}>{value.subDescription}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={scrollToRegistration} variant="secondary" className={s.ctaButton}>
            Выбрать роль
          </Button>
        </div>
      </div>
    </section>
  );
};

export default KeyAdvantages;
