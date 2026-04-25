"use client";

import { useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { PricingFeatureIcon } from "@/source/shared/ui/icons";
import { PricingCard, type PricingPlan } from "@/source/entities/pricing";
import { useSubscribeToPlan } from "@/source/features/pricing/subscribe";
import s from "./PricingSection.module.scss";

type Role = "customer" | "expert";

const ROLE_TABS = [
  { id: "customer", label: "Я заказчик" },
  { id: "expert", label: "Я эксперт" },
];

interface Props {
  title: string;
  subtitle?: string;
  footnote?: string;
  plans: PricingPlan[];
  defaultRole?: Role;
  showRoleTabs?: boolean;
  customerMessage: string;
  customerFeatures: string[];
}

export function PricingSection({
  title,
  subtitle,
  footnote,
  plans,
  defaultRole = "expert",
  showRoleTabs = true,
  customerMessage,
  customerFeatures,
}: Props) {
  const { select, pendingPlanId } = useSubscribeToPlan();
  const [role, setRole] = useState<Role>(defaultRole);

  return (
    <section className={s.section} id="pricing">
      <header className={s.header}>
        <h2 className={s.title}>{title}</h2>
        {subtitle ? <p className={s.subtitle}>{subtitle}</p> : null}
      </header>

      {showRoleTabs ? (
        <Tabs
          variant="pill"
          tabs={ROLE_TABS}
          activeTab={role}
          onTabChange={(id) => setRole(id as Role)}
          className={s.tabs}
        />
      ) : null}

      {role === "expert" ? (
        <div className={s.grid}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`${s.gridItem} ${plan.highlighted ? s.gridItemHighlighted : ""}`}
            >
              <PricingCard
                plan={plan}
                onSelect={select}
                isLoading={pendingPlanId === plan.id}
                disabled={pendingPlanId !== null && pendingPlanId !== plan.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={s.customerCard}>
          <p className={s.customerHeadline}>{customerMessage}</p>
          <ul className={s.customerFeatures}>
            {customerFeatures.map((feature) => (
              <li key={feature} className={s.customerFeature}>
                <PricingFeatureIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {footnote ? <p className={s.footnote}>{footnote}</p> : null}
    </section>
  );
}
