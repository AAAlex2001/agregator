import { ServiceSection } from "../service-section";
import styles from "./style.module.scss";

/** Заголовок и абзацы с назначением работ выбранного направления. */
interface ServiceDescriptionProps {
  id: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
}

/** Объясняет назначение работ в отдельной текстовой панели. */
export function ServiceDescription({
  id,
  title,
  subtitle,
  paragraphs,
}: ServiceDescriptionProps) {
  return (
    <ServiceSection
      id={id}
      title={title}
      subtitle={subtitle}
    >
      <div className={styles.panel}>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className={styles.text}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </ServiceSection>
  );
}
