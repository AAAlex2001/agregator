import type { ReactNode } from "react";
import {
  LandingHero,
  LandingServiceHero,
  LandingDirectionNews,
  LandingSearchBlock,
  LandingAudience,
  LandingServiceFaq,
  LandingServiceRoles,
  StartWorkingButton,
} from "@/source/widgets/landing";
import { KadastrServices } from "./Services";
import { KadastrSeoText } from "./SeoText";
import {
  KADASTR_AUDIENCE,
  KADASTR_BULLETS,
  KADASTR_COVER_VIDEO,
  KADASTR_FAQ,
  KADASTR_ROLES,
  KADASTR_SUBTITLE,
  KADASTR_TITLE,
} from "../model/content";
import s from "./kadastr-landing-content.module.scss";

interface Props {
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function KadastrLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/kadastrovye-raboty" />
        <LandingServiceHero
          title={KADASTR_TITLE}
          subtitle={KADASTR_SUBTITLE}
          bullets={KADASTR_BULLETS}
        >
          <div className={s.cover}>
            <div className={s.coverImage}>
              <video
                className={s.coverVideo}
                src={KADASTR_COVER_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            <p className={s.coverClaim}>Кадастровые инженеры из СРО — по всей России</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <KadastrServices />
        <LandingAudience blocks={KADASTR_AUDIENCE} />
        <LandingDirectionNews
          direction="CADASTRAL"
          basePath={basePath}
          subtitle="Изменения в законах о недвижимости, кадастровая оценка и практика земельных споров"
        />
        <LandingServiceRoles roles={KADASTR_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={KADASTR_FAQ}
          subtitle="Кто выполняет кадастровые работы, сколько они занимают и что делать с ошибками в ЕГРН."
        />
        <KadastrSeoText />
      </main>
      {footer}
    </div>
  );
}
