import type { ReactNode } from "react";
import {
  LandingHero,
  LandingHowItWorks,
  LandingKeyAdvantages,
  LandingServiceHero,
  LandingDirectionNews,
  LandingSearchBlock,
  LandingServiceFaq,
  LandingServiceRoles,
  StartWorkingButton,
} from "@/source/widgets/landing";
import { EcologySeoText } from "./SeoText";
import {
  ECOLOGY_BULLETS,
  ECOLOGY_CLAIM,
  ECOLOGY_COVER_VIDEO,
  ECOLOGY_FAQ,
  ECOLOGY_HOW_IT_WORKS,
  ECOLOGY_KEY_ADVANTAGES,
  ECOLOGY_KEY_ADVANTAGES_SUBTITLE,
  ECOLOGY_KEY_ADVANTAGES_TITLE,
  ECOLOGY_ROLES,
  ECOLOGY_SUBTITLE,
  ECOLOGY_TITLE,
} from "../model/content";
import s from "./ecology-landing-content.module.scss";

interface Props {
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function EcologyLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/ekologiya" />
        <LandingServiceHero
          title={ECOLOGY_TITLE}
          subtitle={ECOLOGY_SUBTITLE}
          bullets={ECOLOGY_BULLETS}
        >
          <div className={s.cover}>
            <div className={s.coverImage}>
              <video
                className={s.coverVideo}
                src={ECOLOGY_COVER_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            <p className={s.coverClaim}>{ECOLOGY_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <LandingHowItWorks
          clientSteps={ECOLOGY_HOW_IT_WORKS.client}
          expertSteps={ECOLOGY_HOW_IT_WORKS.expert}
          licenseHolderSteps={ECOLOGY_HOW_IT_WORKS.licenseHolder}
          title="Как это работает"
          subtitle="Путь от размещения задачи до готовой экологической документации — для заказчика и исполнителя."
        />
        <LandingKeyAdvantages
          clientSteps={ECOLOGY_KEY_ADVANTAGES.client}
          expertSteps={ECOLOGY_KEY_ADVANTAGES.expert}
          licenseHolderSteps={ECOLOGY_KEY_ADVANTAGES.licenseHolder}
          title={ECOLOGY_KEY_ADVANTAGES_TITLE}
          subtitle={ECOLOGY_KEY_ADVANTAGES_SUBTITLE}
        />
        <LandingDirectionNews
          direction="ECOLOGY"
          basePath={basePath}
          subtitle="КЭР и экосбор, требования Росприроднадзора, НДТ и практика экологического сопровождения"
        />
        <LandingServiceRoles roles={ECOLOGY_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={ECOLOGY_FAQ}
          subtitle="Кому нужно экологическое сопровождение, какие требования к экологу и какие работы можно заказать."
        />
        <EcologySeoText />
      </main>
      {footer}
    </div>
  );
}
