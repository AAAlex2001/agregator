import type { ReferralOverview } from "../../model/types";
import { ReferralPool } from "../referral-pool";
import styles from "./style.module.scss";

/** Остаток фонда и приглашения без начисленного вознаграждения. */
interface ReferralConditionsProps {
  overview: ReferralOverview;
}

/** Показывает условия начисления баллов и результаты проверки приглашений. */
export function ReferralConditions({ overview }: ReferralConditionsProps) {
  return (
    <section
      className={styles.details}
      aria-label="Как работает программа"
    >
      <h3 className={styles.title}>Как работает программа</h3>
      <ol className={styles.conditions}>
        <li>
          Коллега должен <strong>зарегистрироваться по вашей ссылке
          как исполнитель</strong>, подтвердить почту,
          указать имя и заполнить хотя бы одно направление. Бонус начисляется автоматически.
        </li>
        <li>
          Приглашение <strong>уже зарегистрированных пользователей
          и самого себя не учитывается</strong>.
        </li>
        <li>
          Бонус начисляется, пока <strong>программа действует
          и в фонде хватает на полное вознаграждение</strong>.
        </li>
      </ol>
      <ReferralPool
        totalPoints={overview.pool_total_points}
        remainingPoints={overview.pool_remaining_points}
      />
      <dl className={styles.results}>
        <div className={styles.result}>
          <dt>Ожидают выполнения условий</dt>
          <dd className={styles.count}>{overview.pending_count}</dd>
        </div>
        <div className={styles.result}>
          <dt>Без бонуса: фонд закончился</dt>
          <dd className={styles.count}>{overview.pool_exhausted_count}</dd>
        </div>
        <div className={styles.result}>
          <dt>Не соответствуют условиям</dt>
          <dd className={styles.count}>{overview.rejected_count}</dd>
        </div>
      </dl>
    </section>
  );
}
