import type { ReferralOverview } from "@/source/entities/referral";
import { ReferralPool } from "./ReferralPool";
import s from "./ReferralPanel.module.scss";

interface ReferralConditionsProps {
  overview: ReferralOverview;
}

/** Показывает условия программы и результаты приглашений без скрытых разделов. */
export function ReferralConditions({ overview }: ReferralConditionsProps) {
  return (
    <section className={s.details} aria-label="Как работает программа">
      <h3 className={s.resultsTitle}>Как работает программа</h3>
      <ol className={s.conditions}>
        <li>
          Коллега должен <strong>зарегистрироваться по вашей ссылке как исполнитель</strong>,
          подтвердить почту, указать имя и заполнить хотя бы одно направление.
          Бонус начисляется автоматически.
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
        <div><dt>Ожидают выполнения условий</dt><dd>{overview.pending_count}</dd></div>
        <div><dt>Без бонуса: фонд закончился</dt><dd>{overview.pool_exhausted_count}</dd></div>
        <div><dt>Не соответствуют условиям</dt><dd>{overview.rejected_count}</dd></div>
      </dl>
    </section>
  );
}
