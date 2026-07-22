import Link from "next/link";
import type { LaborListingData } from "@/source/entities/labor";
import {
  laborEmploymentText,
  laborKindLabel,
  laborRequirementText,
  formatLaborDate,
} from "../lib/formatters";
import s from "./PublicLaborListingView.module.scss";

interface PublicLaborListingViewProps {
  item: LaborListingData;
}

export function PublicLaborListingView({ item }: PublicLaborListingViewProps) {
  const requirement = laborRequirementText(item);

  return (
    <section className={s.wrap}>
      <article className={s.card}>
        <span className={s.kind}>{laborKindLabel(item.kind)}</span>
        <h1 className={s.title}>{item.owner_name}</h1>

        {requirement && (
          <div className={s.block}>
            <span className={s.label}>
              {item.other_profession ? "Иная профессия" : "Требуемая аттестация"}
            </span>
            <p className={s.value}>{requirement}</p>
          </div>
        )}

        <dl className={s.meta}>
          <div>
            <dt>Регион</dt>
            <dd>{item.region}</dd>
          </div>
          <div>
            <dt>Формат</dt>
            <dd>{laborEmploymentText(item)}</dd>
          </div>
          {item.start_date && (
            <div>
              <dt>Приступить</dt>
              <dd>{formatLaborDate(item.start_date)}</dd>
            </div>
          )}
        </dl>

        <div className={s.cta}>
          <p className={s.ctaHint}>
            Чтобы связаться и обсудить сотрудничество, войдите в личный кабинет Ресурс-Плюс.
          </p>
          <Link href="/login" className={s.ctaButton}>
            Войти и откликнуться
          </Link>
        </div>
      </article>
    </section>
  );
}
