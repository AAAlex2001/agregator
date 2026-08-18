"use client";

import Image from "next/image";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { LandingTabsShowcase } from "../../shared/ui/LandingTabsShowcase";
import { KADASTR_SERVICES } from "../model/content";
import s from "./services.module.scss";

export function KadastrServices() {
  return (
    <section className={s.section} id="vidy-rabot">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Виды кадастровых работ" as="h2" />
          <Subtitle text="Разместите заявку на любую из работ — кадастровые инженеры из СРО откликнутся с ценой и сроками." />
        </header>

        <LandingTabsShowcase
          items={KADASTR_SERVICES}
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
