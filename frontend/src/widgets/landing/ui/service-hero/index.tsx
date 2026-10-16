import type { ReactNode } from "react";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import type { ServiceBullet } from "../../model/types";
import styles from "./style.module.scss";

/** Заголовок направления, краткие шаги и обложка первого экрана. */
interface ServiceHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: ServiceBullet[];
  children: ReactNode;
}

/** Представляет направление работ с нумерованными шагами и обложкой. */
export function ServiceHero({
  eyebrow,
  title,
  subtitle,
  bullets = [],
  children,
}: ServiceHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.left}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            <Title
              text={title}
              as="h1"
            />
            {subtitle && <Subtitle text={subtitle} />}
            {bullets.length > 0 && (
              <ul className={styles.bullets}>
                {bullets.map((bullet, index) => (
                  <li
                    key={bullet.title}
                    className={styles.bullet}
                  >
                    <span className={styles.num}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.bulletBody}>
                      <span className={styles.bulletTitle}>{bullet.title}</span>
                      <span className={styles.bulletText}>{bullet.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.right}>{children}</div>
        </div>
      </div>
    </section>
  );
}
