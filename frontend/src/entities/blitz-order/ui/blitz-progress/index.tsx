import cn from "classnames";
import { BLITZ_STEP_LABELS, BLITZ_STEPS } from "../../config/labels";
import { blitzStepIndex } from "../../model/status";
import type { BlitzStatus } from "../../model/types";
import styles from "./style.module.scss";

/** Текущий статус заявки. */
interface BlitzProgressProps {
  status: BlitzStatus;
}

/** Шаги заявки полосой: пройденные, текущий и будущие. У отменённой заявки полосы нет. */
export function BlitzProgress({ status }: BlitzProgressProps) {
  if (status === "canceled") {
    return null;
  }

  const current = blitzStepIndex(status);

  return (
    <ol
      className={styles.steps}
      aria-label={`Шаг ${current + 1} из ${BLITZ_STEPS.length}`}
    >
      {BLITZ_STEPS.map((step, index) => (
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
