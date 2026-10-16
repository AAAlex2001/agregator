"use client";

import classNames from "classnames";
import { Button } from "@/shared/ui/button";
import { FeatureCheckIcon } from "@/shared/ui/icons";
import type { PricingCardState, PricingPlan } from "../../model/types";
import styles from "./style.module.scss";

/** Тариф, доступность его выбора и действие при нажатии на кнопку. */
interface PricingCardProps {
  plan: PricingPlan;
  state?: PricingCardState;
  onSelect?: (plan: PricingPlan) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/** Выбирает оформление кнопки по доступности и выделению тарифа. */
function getButtonVariant(state: PricingCardState, highlighted: boolean) {
  if (state === "active") {
    return "pillActive";
  }

  if (state === "disabled") {
    return "pillDisabled";
  }

  return highlighted ? "pill" : "pillMuted";
}

/** Показывает цену, возможности и кнопку выбора одного тарифа. */
export function PricingCard({
  plan,
  state = "available",
  onSelect,
  isLoading,
  disabled,
}: PricingCardProps) {
  const isActive = state === "active";
  const isDisabled = state === "disabled";

  /** Передаёт доступный тариф в сценарий регистрации или оформления подписки. */
  function selectPlan() {
    if (!isActive && !isDisabled) {
      onSelect?.(plan);
    }
  }

  return (
    <article
      className={classNames(styles.card, {
        [styles.cardHighlighted]: plan.highlighted,
        [styles.cardSingle]: plan.kind === "SINGLE",
        [styles.cardYearly]: plan.kind === "YEARLY",
        [styles.cardDisabled]: isDisabled,
      })}
    >
      <div className={styles.inner}>
        <div className={styles.infoBlock}>
          <div
            className={classNames(styles.pillsBlock, {
              [styles.pillsHighlighted]: plan.highlighted,
            })}
          >
            <div className={styles.pillsRow}>
              <div className={classNames(styles.pill, styles.pillName)}>
                <span>{plan.name}</span>
              </div>

              {plan.badge ? (
                <div className={classNames(styles.pill, styles.pillBadge)}>
                  <span>{plan.badge}</span>
                </div>
              ) : null}
            </div>

            <div className={styles.price}>
              <span className={styles.priceValue}>{plan.price_display}</span>
              <span className={styles.pricePeriod}>{plan.period_label}</span>
            </div>
          </div>

          <p className={styles.description}>{plan.description}</p>
        </div>

        <Button
          variant={getButtonVariant(state, plan.highlighted)}
          fullWidth
          isLoading={isLoading}
          disabled={disabled || isDisabled || isActive}
          onClick={selectPlan}
        >
          {isActive ? "Активен" : plan.cta_label}
        </Button>
      </div>

      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={styles.feature}
          >
            <FeatureCheckIcon className={styles.check} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
