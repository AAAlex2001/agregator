import type { ReactNode } from "react";
import {
  LandingHero,
  LandingServiceHero,
  LandingDirectionNews,
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
  TECH_DIAG_COVER_VIDEO,
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
              <video
                className={s.coverVideo}
                src={TECH_DIAG_COVER_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            <p className={s.coverClaim}>{TECH_DIAG_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <TechDiagDefinitions />
        <LandingDirectionNews
          direction="TECH_DIAG"
          basePath={basePath}
          subtitle="Методы неразрушающего контроля, диагностирование оборудования и аттестация лабораторий"
        />
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
