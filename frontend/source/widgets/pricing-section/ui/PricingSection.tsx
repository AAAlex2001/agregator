"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Tabs from "@/source/shared/ui/Tabs";
import { PricingCard, subscribeToPlan, type PricingPlan } from "@/source/entities/pricing";
import s from "./PricingSection.module.scss";

type Role = "customer" | "expert";

const ROLE_TABS = [
  { id: "customer", label: "Я заказчик" },
  { id: "expert", label: "Я эксперт" },
];

const DEFAULT_CUSTOMER_MESSAGE =
  "Заказчики размещают проекты бесплатно — эксперты получают доступ к заказам по тарифу";

const DEFAULT_CUSTOMER_FEATURES = [
  "Размещайте проекты без ограничений",
  "Выбирайте эксперта из откликов",
  "Оплата только исполнителю, без комиссии",
  "Связь напрямую в чате",
];

interface Props {
  title: string;
  subtitle?: string;
  footnote?: string;
  plans: PricingPlan[];
  defaultRole?: Role;
  showRoleTabs?: boolean;
  customerMessage?: string;
  customerFeatures?: string[];
}

export function PricingSection({
  title,
  subtitle,
  footnote,
  plans,
  defaultRole = "expert",
  showRoleTabs = true,
  customerMessage = DEFAULT_CUSTOMER_MESSAGE,
  customerFeatures = DEFAULT_CUSTOMER_FEATURES,
}: Props) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(defaultRole);
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlanSelect = async (plan: PricingPlan) => {
    setError(null);
    setPendingPlanId(plan.id);
    try {
      const returnUrl = `${window.location.origin}/settings?section=subscription`;
      const result = await subscribeToPlan(plan.id, returnUrl);
      window.location.href = result.confirmation_url;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ошибка оплаты";
      if (message.toLowerCase().includes("unauthor") || message.includes("401")) {
        router.push("/login");
        return;
      }
      setError(message);
    } finally {
      setPendingPlanId(null);
    }
  };

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
                onSelect={handlePlanSelect}
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
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="10" fill="#FFB800" fillOpacity="0.12" />
                  <path d="M5.83 10.42l2.5 2.5 5.84-5.84" stroke="#FFB800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error ? <p className={s.error}>{error}</p> : null}
      {footnote ? <p className={s.footnote}>{footnote}</p> : null}
    </section>
  );
}
