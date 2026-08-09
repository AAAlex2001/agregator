import type { ReactNode } from "react";
import Image from "next/image";
import {
  LandingHero,
  LandingServiceHero,
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
  FORENSIC_COVER,
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
              <Image
                src={FORENSIC_COVER}
                alt="Судебная экспертиза"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className={s.coverImg}
                priority
              />
            </div>
            <p className={s.coverClaim}>{FORENSIC_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <ForensicCatalog />
        <LandingAudience blocks={FORENSIC_AUDIENCE} />
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
