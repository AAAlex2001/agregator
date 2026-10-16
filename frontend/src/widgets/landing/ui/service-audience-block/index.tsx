import cn from "classnames";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Title } from "@/shared/ui/title";
import type { ServiceAudienceBlock as AudienceBlock } from "../../model/types";
import styles from "./style.module.scss";

/** Описание аудитории и положение иллюстрации в чередующихся блоках. */
interface ServiceAudienceBlockProps {
  block: AudienceBlock;
  isReversed: boolean;
}

/** Показывает пользу направления для одной аудитории рядом с иллюстрацией. */
export function ServiceAudienceBlock({
  block,
  isReversed,
}: ServiceAudienceBlockProps) {
  return (
    <article
      className={cn(styles.row, {
        [styles.rowReversed]: isReversed,
      })}
    >
      <div className={styles.text}>
        <span className={styles.badge}>{block.audience}</span>
        <Title
          as="h2"
          className={styles.title}
          text={block.title}
        />
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li
              key={item}
              className={styles.item}
            >
              {item}
            </li>
          ))}
        </ul>

        {block.link && (
          <Button
            href={block.link.href}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
            showArrow
            className={styles.link}
          >
            {block.link.label}
          </Button>
        )}
      </div>

      <div className={styles.media}>
        <Image
          src={block.image}
          alt={block.imageAlt}
          width={640}
          height={480}
          className={styles.image}
        />
      </div>
    </article>
  );
}
