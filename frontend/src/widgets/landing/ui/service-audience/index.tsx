import type { ServiceAudienceBlock as AudienceBlock } from "../../model/types";
import { ServiceAudienceBlock } from "../service-audience-block";
import styles from "./style.module.scss";

/** Последовательность описаний для участников выбранного направления. */
interface ServiceAudienceProps {
  blocks: AudienceBlock[];
}

/** Располагает описания аудиторий с чередованием текста и иллюстраций. */
export function ServiceAudience({ blocks }: ServiceAudienceProps) {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        {blocks.map((block, index) => (
          <ServiceAudienceBlock
            key={block.audience}
            block={block}
            isReversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
