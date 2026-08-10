import type { ReactNode } from "react";
import Image from "next/image";
import type { LandingSnapshot } from "@/source/entities/landing";
import {
  LandingHero,
  LandingHowItWorks,
  LandingIndustryDirections,
  LandingKeyAdvantages,
  LandingServiceHero,
  LandingSearchBlock,
  LandingServiceFaq,
  LandingServiceRoles,
  StartWorkingButton,
} from "@/source/widgets/landing";
import { ExpertiseSeoText } from "./SeoText";
import {
  EXPERTISE_BULLETS,
  EXPERTISE_CLAIM,
  EXPERTISE_COVER,
  EXPERTISE_FAQ,
  EXPERTISE_ROLES,
  EXPERTISE_SUBTITLE,
  EXPERTISE_TITLE,
} from "../model/content";
import s from "./expertise-landing-content.module.scss";

interface Props {
  snapshot: LandingSnapshot;
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function ExpertiseLandingContent({ snapshot, basePath = "", header, footer }: Props) {
  const { sectionHeaders, howItWorks, keyAdvantages, industries } = snapshot;

  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/ekspertiza-promyshlennoy-bezopasnosti" />
        <LandingServiceHero
          title={EXPERTISE_TITLE}
          subtitle={EXPERTISE_SUBTITLE}
          bullets={EXPERTISE_BULLETS}
        >
          <div className={s.cover}>
            <div className={s.coverImage}>
              <Image
                src={EXPERTISE_COVER}
                alt="Экспертиза промышленной безопасности"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className={s.coverImg}
                priority
              />
            </div>
            <p className={s.coverClaim}>{EXPERTISE_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <LandingHowItWorks
          clientSteps={howItWorks.client}
          expertSteps={howItWorks.expert}
          licenseHolderSteps={howItWorks.licenseHolder}
          title={sectionHeaders.howItWorks.title}
          subtitle={sectionHeaders.howItWorks.subtitle}
        />
        <LandingKeyAdvantages
          clientSteps={keyAdvantages.client}
          expertSteps={keyAdvantages.expert}
          licenseHolderSteps={keyAdvantages.licenseHolder}
          title={sectionHeaders.keyAdvantages.title}
          subtitle={sectionHeaders.keyAdvantages.subtitle}
        />
        <LandingIndustryDirections
          industries={industries}
          title={sectionHeaders.industries.title}
          subtitle={sectionHeaders.industries.subtitle}
        />
        <LandingServiceRoles roles={EXPERTISE_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={EXPERTISE_FAQ}
          subtitle="Когда ЭПБ обязательна, кто вправе её проводить и что происходит с заключением."
        />
        <ExpertiseSeoText />
      </main>
      {footer}
    </div>
  );
}
