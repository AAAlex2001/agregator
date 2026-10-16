"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { Tabs } from "@/shared/ui/tabs";
import { Title } from "@/shared/ui/title";
import { SERVICE_STEP_ROLES } from "../../config/step-roles";
import { scrollToRegistration } from "../../model/scroll-to-registration";
import type {
  ServiceStep as ServiceStepContent,
  ServiceStepRole,
} from "../../model/types";
import { ServiceStep } from "../service-step";
import styles from "./style.module.scss";

/** Шаги по ролям для блоков «Как это работает» и «Преимущества». */
interface ServiceStepsProps {
  variant: "process" | "advantages";
  title: string;
  subtitle: string;
  clientSteps: ServiceStepContent[];
  expertSteps: ServiceStepContent[];
  licenseHolderSteps: ServiceStepContent[];
}

/** Переключает описание работы платформы между доступными ролями. */
export function ServiceSteps({
  variant,
  title,
  subtitle,
  clientSteps,
  expertSteps,
  licenseHolderSteps,
}: ServiceStepsProps) {
  const [role, setRole] = useState<ServiceStepRole>("client");
  const isProcess = variant === "process";
  const tabs = licenseHolderSteps.length > 0
    ? SERVICE_STEP_ROLES
    : SERVICE_STEP_ROLES.filter((tab) => tab.id !== "license_holder");
  let steps = clientSteps;

  if (role === "expert") {
    steps = expertSteps;
  } else if (role === "license_holder") {
    steps = licenseHolderSteps;
  }

  /** Показывает шаги одной из ролей, доступных в переключателе. */
  function changeRole(nextRole: string) {
    if (
      nextRole === "client"
      || nextRole === "expert"
      || nextRole === "license_holder"
    ) {
      setRole(nextRole);
    }
  }

  return (
    <section
      className={styles.section}
      id={isProcess ? "how-it-works" : "key-advantages"}
      data-variant={variant}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <Title text={title} />
          <Subtitle text={subtitle} />
        </div>
        <div className={styles.stepsInfo}>
          <Tabs
            tabs={tabs}
            activeTab={role}
            variant="outlined"
            onTabChange={changeRole}
          />
          <div className={styles.steps}>
            {steps.map((step) => (
              <ServiceStep
                key={`${role}-${step.id}`}
                step={step}
                showDetails={!isProcess}
              />
            ))}
          </div>
          <Button
            onClick={scrollToRegistration}
            variant="secondary"
            className={styles.ctaButton}
          >
            {isProcess ? "Зарегистрироваться" : "Выбрать роль"}
          </Button>
        </div>
      </div>
    </section>
  );
}
