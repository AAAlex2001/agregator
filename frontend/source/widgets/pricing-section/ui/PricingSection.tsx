"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Button from "@/source/shared/ui/Button";
import { PricingFeatureIcon } from "@/source/shared/ui/icons";
import { PricingCard, type PricingPlan } from "@/source/entities/pricing";
import { useSubscribeToPlan } from "@/source/features/pricing/subscribe";
import s from "./PricingSection.module.scss";

type Role = "customer" | "expert" | "license_holder";

const ROLE_TABS = [
  { id: "customer", label: "Я заказчик" },
  { id: "expert", label: "Я исполнитель" },
  { id: "license_holder", label: "Я держатель разрешительных документов" },
];

interface CtaConfig {
  label: string;
  href: string;
}

interface RoleHeader {
  title: string;
  subtitle?: string;
}

interface RoleTextBlock {
  title: string;
  subtitle?: string;
  headline: string;
  features: string[];
  footnote?: string;
  cta?: CtaConfig;
}

interface Props {
  expert: RoleHeader;
  customer: RoleHeader;
  footnote?: string;
  plans: PricingPlan[];
  defaultRole?: Role;
  customerHeadline: string;
  customerFeatures: string[];
  customerFootnote?: string;
  customerCta?: CtaConfig;
  licenseHolder: RoleTextBlock;
  openAuthOnSelect?: boolean;
}

export function PricingSection({
  expert,
  customer,
  footnote,
  plans,
  defaultRole = "expert",
  customerHeadline,
  customerFeatures,
  customerFootnote,
  customerCta,
  licenseHolder,
  openAuthOnSelect,
}: Props) {
  const { openAuth } = useAuthModal();
  const { select, pendingPlanId } = useSubscribeToPlan();
  const [role, setRole] = useState<Role>(defaultRole);

  const header: RoleHeader =
    role === "expert" ? expert : role === "customer" ? customer : licenseHolder;

  const handleSelect = (plan: PricingPlan) => {
    if (openAuthOnSelect) {
      openAuth("register");
      return;
    }
    select(plan);
  };
  const isPending = (planId: number) => !openAuthOnSelect && pendingPlanId === planId;
  const isCardDisabled = (planId: number) =>
    !openAuthOnSelect && pendingPlanId !== null && pendingPlanId !== planId;

  return (
    <section className={s.section} id="pricing">
      <div className={s.content}>
        <div className={s.header}>
          <Title text={header.title} />
          {header.subtitle ? <Subtitle text={header.subtitle} /> : null}
        </div>

        <div className={s.body}>
          <div className={s.innerBlock}>
            <Tabs
              tabs={ROLE_TABS}
              activeTab={role}
              onTabChange={(id) => setRole(id as Role)}
            />

            {role === "expert" ? (
              <div key="expert" className={`${s.roleContent} ${s.fadeIn}`}>
                <div className={s.grid}>
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`${s.gridItem} ${plan.highlighted ? s.gridItemHighlighted : ""}`}
                    >
                      <PricingCard
                        plan={plan}
                        onSelect={handleSelect}
                        isLoading={isPending(plan.id)}
                        disabled={isCardDisabled(plan.id)}
                      />
                    </div>
                  ))}
                </div>
                {footnote ? <p className={s.footnote}>{footnote}</p> : null}
              </div>
            ) : role === "customer" ? (
              <div key="customer" className={`${s.roleContent} ${s.fadeIn}`}>
                <p className={s.customerHeadline}>{customerHeadline}</p>
                <ul className={s.customerFeatures}>
                  {customerFeatures.map((feature) => (
                    <li key={feature} className={s.customerFeature}>
                      <PricingFeatureIcon className={s.customerCheck} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {customerFootnote ? <p className={s.footnote}>{customerFootnote}</p> : null}
              </div>
            ) : (
              <div key="license_holder" className={`${s.roleContent} ${s.fadeIn}`}>
                <p className={s.customerHeadline}>{licenseHolder.headline}</p>
                <ul className={s.customerFeatures}>
                  {licenseHolder.features.map((feature) => (
                    <li key={feature} className={s.customerFeature}>
                      <PricingFeatureIcon className={s.customerCheck} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {licenseHolder.footnote ? <p className={s.footnote}>{licenseHolder.footnote}</p> : null}
              </div>
            )}
          </div>

          {role === "customer" && customerCta ? (
            <Link key="customer-cta" href={customerCta.href} className={`${s.customerCtaWrap} ${s.fadeIn}`}>
              <Button variant="chat" className={s.customerCtaButton}>
                {customerCta.label}
              </Button>
            </Link>
          ) : null}

          {role === "license_holder" && licenseHolder.cta ? (
            <Link key="lh-cta" href={licenseHolder.cta.href} className={`${s.customerCtaWrap} ${s.fadeIn}`}>
              <Button variant="chat" className={s.customerCtaButton}>
                {licenseHolder.cta.label}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
