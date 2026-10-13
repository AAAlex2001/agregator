import type { ReferralOverview } from "@/source/entities/referral";
import { ReferralPool } from "./ReferralPool";
import s from "./ReferralConditions.module.scss";

interface ReferralConditionsProps {
  overview: ReferralOverview;
}

/** Условия программы, остаток призового фонда и приглашения, по которым бонус не начислен. */
export function ReferralConditions({ overview }: ReferralConditionsProps) {
  return (
    <section className={s.details} aria-label="Как работает программа">
      <h3 className={s.title}>Как работает программа</h3>
      <ol className={s.conditions}>
        <li>
          Коллега должен <strong>зарегистрироваться по вашей ссылке как исполнитель</strong>, подтвердить почту,
          указать имя и заполнить хотя бы одно направление. Бонус начисляется автоматически.
        </li>
        <li>
          Приглашение <strong>уже зарегистрированных пользователей и самого себя не учитывается</strong>.
        </li>
        <li>
          Бонус начисляется, пока <strong>программа действует и в фонде хватает на полное вознаграждение</strong>.
        </li>
      </ol>

      <ReferralPool totalPoints={overview.pool_total_points} remainingPoints={overview.pool_remaining_points} />

      <dl className={s.results}>
        <div className={s.result}>
          <dt>Ожидают выполнения условий</dt>
          <dd className={s.count}>{overview.pending_count}</dd>
        </div>
        <div className={s.result}>
          <dt>Без бонуса: фонд закончился</dt>
          <dd className={s.count}>{overview.pool_exhausted_count}</dd>
        </div>
        <div className={s.result}>
          <dt>Не соответствуют условиям</dt>
          <dd className={s.count}>{overview.rejected_count}</dd>
        </div>
      </dl>
    </section>
  );
}
