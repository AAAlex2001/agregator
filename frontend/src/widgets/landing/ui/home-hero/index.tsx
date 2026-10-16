"use client";

import type { SyntheticEvent } from "react";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Заголовок и описание главной страницы из её SEO-конфигурации. */
interface HomeHeroProps {
  title: string;
  description: string;
}

/** Показывает назначение платформы и видео на первом экране главной. */
export function HomeHero({ title, description }: HomeHeroProps) {
  /** Возобновляет фоновое видео после окончания воспроизведения. */
  function replayVideo(event: SyntheticEvent<HTMLVideoElement>) {
    event.currentTarget.currentTime = 0;
    void event.currentTarget.play();
  }

  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <Title
          as="h1"
          className={styles.title}
          text={title}
        />
        <Subtitle
          className={styles.subtitle}
          text={description}
        />
      </div>

      <div className={styles.visual}>
        <div className={styles.visualCard}>
          <video
            className={styles.visualVideo}
            src="/landing/main/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onEnded={replayVideo}
          />
        </div>
      </div>
    </section>
  );
}
