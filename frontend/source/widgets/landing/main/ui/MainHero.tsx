"use client";

import { MAIN_PAGE_TITLE, MAIN_PAGE_DESCRIPTION } from "@/source/shared/config/mainPageContent";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./main-hero.module.scss";

export function MainHero() {
  return (
    <section className={s.hero}>
      <div className={s.copy}>
        <Title
          as="h1"
          className={s.title}
          text={MAIN_PAGE_TITLE}
        />
        <Subtitle
          className={s.subtitle}
          text={MAIN_PAGE_DESCRIPTION}
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
