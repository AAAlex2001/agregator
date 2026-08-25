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
import { ForensicCatalog } from "./Catalog";
import { ForensicSeoText } from "./SeoText";
import {
  FORENSIC_AUDIENCE,
  FORENSIC_BULLETS,
  FORENSIC_CLAIM,
  FORENSIC_COVER_VIDEO,
  FORENSIC_FAQ,
  FORENSIC_ROLES,
  FORENSIC_SUBTITLE,
  FORENSIC_TITLE,
} from "../model/content";
import s from "./forensic-landing-content.module.scss";

interface Props {
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function ForensicLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/sudebnaya-ekspertiza" />
        <LandingServiceHero
          title={FORENSIC_TITLE}
          subtitle={FORENSIC_SUBTITLE}
          bullets={FORENSIC_BULLETS}
        >
          <div className={s.cover}>
            <div className={s.coverImage}>
              <video
                className={s.coverVideo}
                src={FORENSIC_COVER_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            <p className={s.coverClaim}>{FORENSIC_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <ForensicCatalog />
        <LandingAudience blocks={FORENSIC_AUDIENCE} />
        <LandingDirectionNews
          direction="FORENSIC"
          basePath={basePath}
          subtitle="Реформа судебно-экспертной деятельности, позиции судов и практика по видам экспертиз"
        />
        <LandingServiceRoles roles={FORENSIC_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={FORENSIC_FAQ}
          subtitle="Кто вправе давать заключение для суда, кто оплачивает экспертизу и как оспорить её выводы."
        />
        <ForensicSeoText />
      </main>
      {footer}
    </div>
  );
}
