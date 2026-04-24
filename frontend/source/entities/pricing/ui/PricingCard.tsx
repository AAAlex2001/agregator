"use client";

import Button from "@/source/shared/ui/Button";
import type { PricingPlan } from "../model/types";
import s from "./PricingCard.module.scss";

interface Props {
  plan: PricingPlan;
  onSelect?: (plan: PricingPlan) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

function CheckIcon() {
  return (
    <svg className={s.check} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#FFB800" fillOpacity="0.12" />
      <path
        d="M5.83 10.42l2.5 2.5 5.84-5.84"
        stroke="#FFB800"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingCard({ plan, onSelect, isLoading, disabled }: Props) {
  const highlighted = plan.highlighted;
  const pillsStyle = highlighted ? s.pillsHighlighted : s.pillsDefault;

  return (
    <article className={`${s.card} ${highlighted ? s.cardHighlighted : ""}`}>
      <div className={s.inner}>
        <div className={`${s.pillsBlock} ${pillsStyle}`}>
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

        <Button
          variant={highlighted ? "rounded" : "roundedMuted"}
          fullWidth
          isLoading={isLoading}
          disabled={disabled}
          onClick={() => onSelect?.(plan)}
        >
          {plan.cta_label}
        </Button>
      </div>

      <ul className={s.features}>
        {plan.features.map((feature) => (
          <li key={feature} className={s.feature}>
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
