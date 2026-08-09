import type { ReactNode } from "react";
import Image from "next/image";
import {
  LandingHero,
  LandingServiceHero,
  LandingSearchBlock,
  LandingServiceFaq,
  LandingServiceRoles,
  StartWorkingButton,
} from "@/source/widgets/landing";
import { TechDiagDefinitions } from "./Definitions";
import { TechDiagSeoText } from "./SeoText";
import {
  TECH_DIAG_BULLETS,
  TECH_DIAG_CLAIM,
  TECH_DIAG_COVER,
  TECH_DIAG_FAQ,
  TECH_DIAG_ROLES,
  TECH_DIAG_SUBTITLE,
  TECH_DIAG_TITLE,
} from "../model/content";
import s from "./tech-diag-landing-content.module.scss";

interface Props {
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function TechDiagLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/tehnicheskoe-diagnostirovanie" />
        <LandingServiceHero
          title={TECH_DIAG_TITLE}
          subtitle={TECH_DIAG_SUBTITLE}
          bullets={TECH_DIAG_BULLETS}
        >
          <div className={s.cover}>
            <div className={s.coverImage}>
              <Image
                src={TECH_DIAG_COVER}
                alt="Техническое освидетельствование и диагностирование"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className={s.coverImg}
                priority
              />
            </div>
            <p className={s.coverClaim}>{TECH_DIAG_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <TechDiagDefinitions />
        <LandingServiceRoles roles={TECH_DIAG_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={TECH_DIAG_FAQ}
          subtitle="Кто вправе выполнять неразрушающий контроль, как проверить дефектоскописта и какие методы бывают."
        />
        <TechDiagSeoText />
      </main>
      {footer}
    </div>
  );
}
