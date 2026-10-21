import { CommissionForm } from "@/features/apply-to-commission";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { COMMISSION_OFFERS } from "../../config/offers";
import styles from "./style.module.scss";

/** Что даёт отбор кандидату. */
const SUBTITLE = "Конкурсная комиссия отбирает аттестованных экспертов промышленной безопасности "
  + "для работы над заявками платформы: заключения, договоры и оплата — через нас.";

/** Оффер конкурсного отбора и заявка кандидата: одинаковы на сайте и в кабинете. */
export function CommissionContent() {
  return (
    <div className={styles.content}>
      <section className={styles.hero}>
        <Title
          as="h1"
          text="Примем эксперта в команду"
        />
        <Subtitle text={SUBTITLE} />
        <ul className={styles.offers}>
          {COMMISSION_OFFERS.map((offer) => (
            <li
              key={offer.title}
              className={styles.offer}
            >
              <span className={styles.offerTitle}>{offer.title}</span>
              <span className={styles.offerText}>{offer.text}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Заявка в конкурсную комиссию</h2>
        <CommissionForm />
      </section>
    </div>
  );
}