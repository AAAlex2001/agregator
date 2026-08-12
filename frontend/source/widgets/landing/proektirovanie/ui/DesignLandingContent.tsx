import type { ReactNode } from "react";
import Image from "next/image";
import {
  LandingHero,
  LandingHowItWorks,
  LandingKeyAdvantages,
  LandingServiceHero,
  LandingSearchBlock,
  LandingServiceFaq,
  LandingServiceRoles,
  StartWorkingButton,
} from "@/source/widgets/landing";
import { DesignSeoText } from "./SeoText";
import {
  DESIGN_BULLETS,
  DESIGN_CLAIM,
  DESIGN_COVER,
  DESIGN_FAQ,
  DESIGN_HOW_IT_WORKS,
  DESIGN_KEY_ADVANTAGES,
  DESIGN_KEY_ADVANTAGES_SUBTITLE,
  DESIGN_KEY_ADVANTAGES_TITLE,
  DESIGN_ROLES,
  DESIGN_SUBTITLE,
  DESIGN_TITLE,
} from "../model/content";
import s from "./design-landing-content.module.scss";

interface Props {
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function DesignLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/proektirovanie" />
        <LandingServiceHero title={DESIGN_TITLE} subtitle={DESIGN_SUBTITLE} bullets={DESIGN_BULLETS}>
          <div className={s.cover}>
            <div className={s.coverImage}>
              <Image
                src={DESIGN_COVER}
                alt="Проектирование промышленных и гражданских объектов"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className={s.coverImg}
                priority
              />
            </div>
            <p className={s.coverClaim}>{DESIGN_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <LandingHowItWorks
          clientSteps={DESIGN_HOW_IT_WORKS.client}
          expertSteps={DESIGN_HOW_IT_WORKS.expert}
          licenseHolderSteps={DESIGN_HOW_IT_WORKS.licenseHolder}
          title="Как это работает"
          subtitle="Путь от размещения задачи до подписанного акта — для заказчика, исполнителя и держателя разрешительных документов."
        />
        <LandingKeyAdvantages
          clientSteps={DESIGN_KEY_ADVANTAGES.client}
          expertSteps={DESIGN_KEY_ADVANTAGES.expert}
          licenseHolderSteps={DESIGN_KEY_ADVANTAGES.licenseHolder}
          title={DESIGN_KEY_ADVANTAGES_TITLE}
          subtitle={DESIGN_KEY_ADVANTAGES_SUBTITLE}
        />
        <LandingServiceRoles roles={DESIGN_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={DESIGN_FAQ}
          subtitle="Кто вправе проектировать, как проверить специалиста и как устроена работа с разрешительными документами."
        />
        <DesignSeoText />
      </main>
      {footer}
    </div>
  );
}
