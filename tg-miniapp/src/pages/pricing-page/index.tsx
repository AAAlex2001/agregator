import cn from "classnames";
import { Screen } from "@/widgets/app-shell";
import { Button, Card, Spinner } from "@/shared/ui";
import { CheckIcon, CrownIcon } from "@/shared/ui/icons/interface";
import { usePlans } from "@/entites/tariff";
import { useBuyTariff } from "@/features/buy-tariff";
import s from "./style.module.scss";

export function PricingPage() {
  const { plans } = usePlans();
  const { buy, payingId } = useBuyTariff();

  return (
    <Screen bare heading="Тарифы" panel>
      {plans === null ? (
        <Spinner page />
      ) : plans.length === 0 ? (
        <p className={s.empty}>Тарифы пока недоступны</p>
      ) : (
        plans.map((plan) => (
          <Card key={plan.id} className={cn(s.plan, { [s.hot]: plan.highlighted })}>
            {plan.highlighted && (
              <span className={s.crown}>
                <CrownIcon width={118} height={118} />
              </span>
            )}
            <div className={s.head}>
              <p className={s.name}>{plan.name}</p>
              {plan.badge && <span className={s.badge}>{plan.badge}</span>}
            </div>

            <div className={s.priceRow}>
              <span className={s.price}>{plan.price_display}</span>
              <span className={s.period}>{plan.period_label}</span>
            </div>

            {plan.description && <p className={s.desc}>{plan.description}</p>}

            {plan.features.length > 0 && (
              <ul className={s.features}>
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <span className={s.featIcon}>
                      <CheckIcon width={16} height={16} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            <Button
              variant={plan.highlighted ? "primary" : "outline"}
              loading={payingId === plan.id}
              onClick={() => void buy(plan)}
            >
              {plan.cta_label || "Оформить"}
            </Button>
          </Card>
        ))
      )}
    </Screen>
  );
}
