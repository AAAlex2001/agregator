import { useEffect, useState } from "react";
import cn from "classnames";
import { Screen } from "@/widgets/app-shell";
import { Button, Card, Spinner } from "@/shared/ui";
import { CheckIcon } from "@/shared/ui/icons/interface";
import { listPlans, subscribe, type Plan } from "@/entites/tariff";
import { emitError } from "@/shared/services/error-bus";
import { openLink } from "@/shared/services/telegram";
import s from "./style.module.scss";

const RETURN_URL = "https://tg.plus-resurs.com";

export function PricingPage() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [paying, setPaying] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    listPlans()
      .then((d) => {
        if (active) setPlans(d.plans);
      })
      .catch((e) => {
        emitError(e instanceof Error ? e.message : "Не удалось загрузить тарифы");
        if (active) setPlans([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const buy = async (plan: Plan) => {
    setPaying(plan.id);
    try {
      const res = await subscribe(plan.id, RETURN_URL);
      openLink(res.confirmation_url);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось оформить тариф");
    } finally {
      setPaying(null);
    }
  };

  return (
    <Screen title="Тарифы">
      {plans === null ? (
        <Spinner page />
      ) : plans.length === 0 ? (
        <p className={s.empty}>Тарифы пока недоступны</p>
      ) : (
        plans.map((plan) => (
          <Card key={plan.id} className={cn(s.plan, { [s.hot]: plan.highlighted })}>
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

            <Button loading={paying === plan.id} onClick={() => void buy(plan)}>
              {plan.cta_label || "Оформить"}
            </Button>
          </Card>
        ))
      )}
    </Screen>
  );
}
