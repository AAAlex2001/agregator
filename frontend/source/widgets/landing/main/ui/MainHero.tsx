"use client";

import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./main-hero.module.scss";

export function MainHero() {
  return (
    <section className={s.hero}>
      <div className={s.copy}>
        <Title
          as="h1"
          className={s.title}
          text={"Первая единая площадка промышленных и инженерных услуг России"}
        />
        <Subtitle
          className={s.subtitle}
          text="Экспертиза промышленной безопасности, аудит СУПБ, техническое освидетельствование и диагностирование, НИР и лабораторные исследования, кадастровые работы, судебная экспертиза, проектирование, инженерные изыскания, строительный контроль и экологическое сопровождение предприятий. Разместите заказ бесплатно — проверенные исполнители откликнутся с ценой и сроками."
        />
      </div>

      <div className={s.visual}>
        <div className={s.visualCard}>
          <video
            className={s.visualVideo}
            src="/landing/main/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onEnded={(event) => {
              event.currentTarget.currentTime = 0;
              void event.currentTarget.play();
            }}
          />
        </div>
      </div>
    </section>
  );
}
