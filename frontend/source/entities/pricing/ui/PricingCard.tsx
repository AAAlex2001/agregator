"use client";

import Button from "@/source/shared/ui/Button";
import { PricingFeatureIcon } from "@/source/shared/ui/icons";
import type { PricingCardState, PricingPlan } from "../model/types";
import s from "./PricingCard.module.scss";

interface Props {
  plan: PricingPlan;
  state?: PricingCardState;
  onSelect?: (plan: PricingPlan) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function PricingCard({
  plan,
  state = "available",
  onSelect,
  isLoading,
  disabled,
}: Props) {
  const highlighted = plan.highlighted;
  const isActive = state === "active";
  const isDisabled = state === "disabled";

  const cardClass = [
    s.card,
    highlighted ? s.cardHighlighted : "",
    plan.kind === "SINGLE" ? s.cardSingle : "",
    plan.kind === "YEARLY" ? s.cardYearly : "",
    isActive ? s.cardActive : "",
    isDisabled ? s.cardDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const buttonVariant = isActive
    ? "pillActive"
    : isDisabled
      ? "pillDisabled"
      : highlighted
        ? "pill"
        : "pillMuted";

  const buttonLabel = isActive ? "Активен" : plan.cta_label;

  return (
    <article className={cardClass}>
      <div className={s.inner}>
        <div className={s.infoBlock}>
          <div className={`${s.pillsBlock} ${highlighted ? s.pillsHighlighted : ""}`}>
            <div className={s.pillsRow}>
              <div className={`${s.pill} ${s.pillName}`}>
                <span>{plan.name}</span>
              </div>
              {plan.badge ? (
                <div className={`${s.pill} ${s.pillBadge}`}>
                  <span>{plan.badge}</span>
                </div>
              ) : null}
            </div>
            <div className={s.price}>
              <span className={s.priceValue}>{plan.price_display}</span>
              <span className={s.pricePeriod}>{plan.period_label}</span>
            </div>
          </div>

          <p className={s.description}>{plan.description}</p>
        </div>

        <Button
          variant={buttonVariant}
          fullWidth
          isLoading={isLoading}
          disabled={disabled || isDisabled || isActive}
          onClick={() => {
            if (isDisabled || isActive) return;
            onSelect?.(plan);
          }}
        >
          {buttonLabel}
        </Button>
      </div>

      <ul className={s.features}>
        {plan.features.map((feature) => (
          <li key={feature} className={s.feature}>
            <PricingFeatureIcon className={s.check} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
