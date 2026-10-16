import type { LeadDirection } from "@/entities/lead";
import styles from "./style.module.scss";

/** Направление, определяющее видеопример и его обложку. */
interface LeadMediaProps {
  direction: LeadDirection;
}

/** Пояснения посетителю о сроке ответа и бесплатном подборе исполнителя. */
const BENEFITS = [
  "Ответим и уточним детали в течение рабочего дня",
  "Подберём исполнителей с подтверждённой квалификацией",
  "Заявка и подбор — бесплатно, без комиссии с работ",
];

/** Показывает видеопример направления и условия обработки заявки. */
export function LeadMedia({ direction }: LeadMediaProps) {
  return (
    <aside className={styles.media}>
      <video
        key={direction.video}
        className={styles.video}
        src={direction.video}
        poster={direction.image}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />
      <ul className={styles.benefits}>
        {BENEFITS.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </aside>
  );
}
