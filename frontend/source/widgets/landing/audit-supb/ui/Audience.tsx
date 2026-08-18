"use client";

import Image from "next/image";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { LandingTabsShowcase } from "../../shared/ui/LandingTabsShowcase";
import { AUDIT_AUDIENCE } from "../model/content";
import s from "./audience.module.scss";

export function AuditAudience() {
  return (
    <section className={s.section} id="dlya-kogo">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Для кого это нужно" as="h2" />
          <Subtitle text="Кому аудит СУПБ обязателен по закону, а кому даёт снижение категории риска и меньше проверок." />
        </header>

        <LandingTabsShowcase
          items={AUDIT_AUDIENCE}
          renderPanel={(item) => (
            <>
              <h3 className={s.panelTitle}>{item.title}</h3>
              <div className={s.visual}>
                <Image
                  key={item.image}
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className={s.visualImg}
                />
              </div>
              <p className={s.desc}>{item.text}</p>
            </>
          )}
        />
      </div>
    </section>
  );
}
