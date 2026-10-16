import type { ReactNode } from "react";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Заголовок, пояснение и публикации личного раздела. */
interface PostsSectionProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Личный раздел публикаций: «Сохранённое» или «Репосты». */
export function PostsSection({ title, subtitle, children }: PostsSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.heading}>
        <Title
          as="h1"
          text={title}
        />
        <Subtitle
          text={subtitle}
          className={styles.subtitle}
        />
      </div>
      {children}
    </div>
  );
}
