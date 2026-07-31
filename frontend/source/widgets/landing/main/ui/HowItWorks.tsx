"use client";

import s from "./how-it-works.module.scss";
import { useState } from "react";
import { AuthTrigger } from "@/source/shared/ui/AuthTrigger";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";

import type { LandingStep } from "../model/landing.data";

type Role = "client" | "expert" | "license_holder";

type HowItWorksProps = {
  clientSteps: LandingStep[];
  expertSteps: LandingStep[];
  licenseHolderSteps: LandingStep[];
  title: string;
  subtitle: string;
};

const HowItWorks = ({
  clientSteps,
  expertSteps,
  licenseHolderSteps,
  title,
  subtitle,
}: HowItWorksProps) => {
  const [role, setRole] = useState<Role>("client");

  const stepsByRole: Record<Role, LandingStep[]> = {
    client: clientSteps,
    expert: expertSteps,
    license_holder: licenseHolderSteps,
  };
  const steps = stepsByRole[role];

  return (
    <section className={s.section} id="how-it-works">
      <div className={s.content}>
        <div className={s.header}>
          <Title text={title} />
          <Subtitle text={subtitle} />
        </div>
        <div className={s.stepsInfo}>
          <Tabs
            tabs={[
              { id: "client", label: "Я заказчик" },
              { id: "expert", label: "Я исполнитель" },
              { id: "license_holder", label: "Я держатель разрешительных документов" },
            ]}
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
                </div>
              </div>
            ))}
          </div>
          <AuthTrigger tab="register" variant="secondary" className={s.ctaButton}>
            Зарегистрироваться
          </AuthTrigger>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
