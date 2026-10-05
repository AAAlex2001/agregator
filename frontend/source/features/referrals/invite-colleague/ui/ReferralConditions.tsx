import type { ReferralOverview } from "@/source/entities/referral";
import { FormSection } from "@/source/shared/ui/FormSection";
import s from "./ReferralPanel.module.scss";

interface ReferralConditionsProps {
  overview: ReferralOverview;
}

/** Показывает условия и результаты приглашений в общем раскрывающемся блоке. */
export function ReferralConditions({ overview }: ReferralConditionsProps) {
  return (
    <FormSection
      title="Условия и результаты приглашений"
      collapsible
      className={s.details}
      titleClassName={s.detailsTitle}
    >
      <div className={s.conditions}>
        <p>
          Коллега должен зарегистрироваться по вашей ссылке как исполнитель, подтвердить почту,
          указать имя и заполнить хотя бы одно направление. Бонус начисляется автоматически.
        </p>
        <p>Приглашение уже зарегистрированных пользователей и самого себя не учитывается.</p>
        <p>
          Бонус начисляется, пока программа действует и в фонде хватает на полное вознаграждение.
        </p>
        <dl className={s.results}>
          <div><dt>Ожидают выполнения условий</dt><dd>{overview.pending_count}</dd></div>
          <div><dt>Без бонуса: фонд закончился</dt><dd>{overview.pool_exhausted_count}</dd></div>
          <div><dt>Не соответствуют условиям</dt><dd>{overview.rejected_count}</dd></div>
        </dl>
      </div>
    </FormSection>
  );
}
