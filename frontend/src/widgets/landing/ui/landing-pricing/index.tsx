"use client";

import cn from "classnames";
import Link from "next/link";
import { useState } from "react";
import type { LandingPricingContent } from "@/entities/landing-content";
import { PricingCard } from "@/entities/pricing";
import type { PricingPlan } from "@/entities/pricing";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { Tabs } from "@/shared/ui/tabs";
import { Title } from "@/shared/ui/title";
import { PRICING_ROLE_TABS } from "../../config/pricing-roles";
import type { LandingPricingRole } from "../../model/types";
import { PricingRoleDetails } from "../pricing-role-details";
import styles from "./style.module.scss";

/** Тарифы и тексты из API; приложение обрабатывает выбор плана. */
interface LandingPricingProps {
  content: LandingPricingContent;
  plans: PricingPlan[];
  onSelectPlan: (plan: PricingPlan) => void;
  defaultRole?: LandingPricingRole;
}

/** Показывает условия работы для трёх ролей и тарифы исполнителя. */
export function LandingPricing({
  content,
  plans,
  onSelectPlan,
  defaultRole = "expert",
}: LandingPricingProps) {
  const [role, setRole] = useState<LandingPricingRole>(defaultRole);
  let title = content.expert_title;
  let subtitle = content.expert_subtitle;

  if (role === "customer") {
    title = content.customer_title;
    subtitle = content.customer_subtitle;
  } else if (role === "license_holder") {
    title = content.license_holder_title;
    subtitle = content.license_holder_subtitle;
  }

  /** Переключает условия на одну из трёх ролей витрины. */
  function changeRole(nextRole: string) {
    if (
      nextRole === "customer"
      || nextRole === "expert"
      || nextRole === "license_holder"
    ) {
      setRole(nextRole);
    }
  }

  return (
    <section
      className={styles.section}
      id="pricing"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <Title text={title} />
          {subtitle ? <Subtitle text={subtitle} /> : null}
        </div>

        <div className={styles.body}>
          <div className={styles.innerBlock}>
            <Tabs
              tabs={PRICING_ROLE_TABS}
              activeTab={role}
              variant="outlined"
              onTabChange={changeRole}
            />

            <div
              key={role}
              className={cn(styles.roleContent, styles.fadeIn)}
            >
              {role === "expert" && (
                <>
                  <div className={styles.grid}>
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={cn(styles.gridItem, {
                          [styles.gridItemHighlighted]: plan.highlighted,
                        })}
                      >
                        <PricingCard
                          plan={plan}
                          onSelect={onSelectPlan}
                        />
                      </div>
                    ))}
                  </div>
                  {content.expert_footnote ? (
                    <p className={styles.footnote}>{content.expert_footnote}</p>
                  ) : null}
                </>
              )}

              {role === "customer" && (
                <PricingRoleDetails
                  headline={content.customer_headline}
                  features={content.customer_features}
                  footnote={content.customer_footnote}
                />
              )}

              {role === "license_holder" && (
                <PricingRoleDetails
                  headline={content.license_holder_headline}
                  features={content.license_holder_features}
                  footnote={content.license_holder_footnote}
                />
              )}
            </div>
          </div>

          {role === "customer" && (
            <Link
              key="customer-cta"
              href={content.customer_cta_href}
              className={cn(styles.customerCtaWrap, styles.fadeIn)}
            >
              <Button
                variant="chat"
                className={styles.customerCtaButton}
              >
                {content.customer_cta_label}
              </Button>
            </Link>
          )}

          {role === "license_holder" && (
            <Link
              key="lh-cta"
              href={content.license_holder_cta_href}
              className={cn(styles.customerCtaWrap, styles.fadeIn)}
            >
              <Button
                variant="chat"
                className={styles.customerCtaButton}
              >
                {content.license_holder_cta_label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
