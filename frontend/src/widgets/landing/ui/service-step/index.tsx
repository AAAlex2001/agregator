import type { ServiceStep as ServiceStepContent } from "../../model/types";
import styles from "./style.module.scss";

/** Описание шага и видимость дополнительного пояснения в блоке преимуществ. */
interface ServiceStepProps {
  step: ServiceStepContent;
  showDetails: boolean;
}

/** Показывает иллюстрацию шага и его описание для выбранной роли. */
export function ServiceStep({ step, showDetails }: ServiceStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.iconWrapper}>
        {/* Исходные SVG шагов сохраняют свой размер без обработки Next Image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={step.icon}
          alt={step.title}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.description}>
        <h3>{step.title}</h3>
        <p>{step.description}</p>
        {showDetails && step.sub_description && (
          <span>{step.sub_description}</span>
        )}
      </div>
    </div>
  );
}
