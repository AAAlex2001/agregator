import cn from "classnames";
import { BLITZ_STEP_LABELS } from "../../config/labels";
import { blitzStepIndex, blitzSteps } from "../../model/status";
import type { BlitzService, BlitzStatus } from "../../model/types";
import styles from "./style.module.scss";

/** Текущий статус заявки и сервис: у аудита есть шаг Плана. */
interface BlitzProgressProps {
  status: BlitzStatus;
  service: BlitzService;
}

/** Шаги заявки полосой: пройденные, текущий и будущие. У отменённой заявки полосы нет. */
export function BlitzProgress({ status, service }: BlitzProgressProps) {
  if (status === "canceled") {
    return null;
  }

  const steps = blitzSteps(service);
  const current = blitzStepIndex(status, service);

  return (
    <ol
      className={styles.steps}
      aria-label={`Шаг ${current + 1} из ${steps.length}`}
    >
      {steps.map((step, index) => (
        <li
          key={step}
          className={cn(styles.step, {
            [styles.passed]: index < current,
            [styles.current]: index === current,
          })}
          aria-current={index === current ? "step" : undefined}
        >
          <span className={styles.bar} />
          <span className={styles.label}>{BLITZ_STEP_LABELS[step]}</span>
        </li>
      ))}
    </ol>
  );
}
