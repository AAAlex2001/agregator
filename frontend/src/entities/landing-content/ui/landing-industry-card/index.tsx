import classNames from "classnames";
import Image from "next/image";
import type { LandingIndustry } from "../../model/types";
import styles from "./style.module.scss";

/** Отрасль и состояние показа её фотографии в общей витрине. */
interface LandingIndustryCardProps {
  industry: LandingIndustry;
  isHovered: boolean;
  onHover: (industryId: number | null) => void;
}

/** Показывает отрасль применения платформы и её фотографию при наведении. */
export function LandingIndustryCard({
  industry,
  isHovered,
  onHover,
}: LandingIndustryCardProps) {
  /** Выделяет отрасль, на которую наведён указатель. */
  function showPhoto() {
    onHover(industry.id);
  }

  /** Скрывает фотографию после ухода указателя. */
  function hidePhoto() {
    onHover(null);
  }

  return (
    <article
      className={classNames(styles.card, styles.industry)}
      onMouseEnter={showPhoto}
      onMouseLeave={hidePhoto}
    >
      {industry.photo && (
        <div
          className={classNames(styles.image, {
            [styles.visible]: isHovered,
          })}
        >
          <Image
            src={industry.photo}
            alt={industry.title || ""}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{industry.title}</h3>
        </div>
        {Array.isArray(industry.description) && (
          <ul>
            {industry.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
