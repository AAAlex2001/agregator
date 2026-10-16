import {
  formatLaborDate,
  getLaborEmploymentText,
  getLaborKindLabel,
  getLaborRequirementText,
} from "@/entities/labor";
import type { LaborListing } from "@/entities/labor";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import styles from "./style.module.scss";

/** Объявление по публичной ссылке и вход для отклика. */
interface PublicLaborListingProps {
  item: LaborListing;
  onOpenLogin: () => void;
}

/** Показывает объявление гостю и предлагает войти, чтобы откликнуться. */
export function PublicLaborListing({ item, onOpenLogin }: PublicLaborListingProps) {
  const requirement = getLaborRequirementText(item);
  const requirementLabel = item.other_profession ? "Иная профессия" : "Требуемая аттестация";

  return (
    <section className={styles.wrap}>
      <Breadcrumbs
        className={styles.breadcrumbs}
        items={[
          { label: "Главная", href: "/" },
          { label: "Трудовые ресурсы" },
          { label: item.owner_name },
        ]}
      />

      <article className={styles.card}>
        <span className={styles.kind}>{getLaborKindLabel(item)}</span>
        <h1 className={styles.title}>{item.owner_name}</h1>

        {requirement && (
          <div className={styles.block}>
            <span className={styles.label}>{requirementLabel}</span>
            <p className={styles.value}>{requirement}</p>
          </div>
        )}

        <dl className={styles.meta}>
          <div>
            <dt>Регион</dt>
            <dd>{item.region}</dd>
          </div>
          <div>
            <dt>Формат</dt>
            <dd>{getLaborEmploymentText(item)}</dd>
          </div>
          {item.start_date && (
            <div>
              <dt>Приступить</dt>
              <dd>{formatLaborDate(item.start_date)}</dd>
            </div>
          )}
        </dl>

        <div className={styles.cta}>
          <p className={styles.ctaHint}>
            Чтобы связаться и обсудить сотрудничество, войдите в личный кабинет Ресурс-Плюс.
          </p>
          <button
            type="button"
            className={styles.ctaButton}
            onClick={onOpenLogin}
          >
            Войти и откликнуться
          </button>
        </div>
      </article>
    </section>
  );
}
