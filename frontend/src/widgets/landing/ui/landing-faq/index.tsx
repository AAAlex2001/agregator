"use client";

import { useState } from "react";
import type { LandingFaqItem } from "@/entities/landing-content";
import { Accordion } from "@/shared/ui/accordion";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { DecorativeImage } from "../decorative-image";
import styles from "./style.module.scss";

/** Вопросы и оформление блока FAQ главной или страницы направления. */
interface LandingFaqProps {
  items: LandingFaqItem[];
  subtitle: string;
  title?: string;
  decoration?: boolean;
}

/** Показывает ответы на частые вопросы с одним раскрытым пунктом. */
export function LandingFaq({
  items,
  subtitle,
  title = "Частые вопросы",
  decoration = false,
}: LandingFaqProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  /** Открывает выбранный ответ или закрывает его при повторном нажатии. */
  function toggleAnswer(id: string) {
    setActiveId((currentId) => currentId === id ? null : id);
  }

  return (
    <section
      className={styles.section}
      id="faq"
    >
      <div className={styles.content}>
        <header className={styles.header}>
          {decoration && (
            <>
              <DecorativeImage
                src="/coal.webp"
                sizes="246px"
                className={styles.decoration}
              />
              <DecorativeImage
                src="/gold.webp"
                sizes="486px"
                className={styles.decoration}
              />
              <DecorativeImage
                src="/copper.webp"
                sizes="390px"
                className={styles.decoration}
              />
            </>
          )}
          <Title
            text={title}
            as="h2"
          />
          <Subtitle text={subtitle} />
        </header>

        <div className={styles.accordion}>
          <Accordion
            items={items}
            activeId={activeId}
            onToggle={toggleAnswer}
          />
        </div>
      </div>
    </section>
  );
}
