import type { ReactNode } from "react";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Заголовок и содержимое информационной секции направления. */
interface ServiceSectionProps {
  id: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Задаёт общую ширину и заголовок пояснений о направлении. */
export function ServiceSection({
  id,
  title,
  subtitle,
  children,
}: ServiceSectionProps) {
  return (
    <section
      className={styles.section}
      id={id}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <Title
            text={title}
            as="h2"
          />
          <Subtitle text={subtitle} />
        </header>

        {children}
      </div>
    </section>
  );
}
