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
import { NirPurpose } from "./Purpose";
import { NirSeoText } from "./SeoText";
import {
  NIR_BULLETS,
  NIR_CLAIM,
  NIR_COVER_VIDEO,
  NIR_FAQ,
  NIR_ROLES,
  NIR_SUBTITLE,
  NIR_TITLE,
} from "../model/content";
import s from "./nir-landing-content.module.scss";

interface Props {
  /** Префикс ссылок для авторизованного лендинга ("/landing"). */
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function NirLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/nir" />
        <LandingServiceHero title={NIR_TITLE} subtitle={NIR_SUBTITLE} bullets={NIR_BULLETS}>
          <div className={s.cover}>
            <div className={s.coverImage}>
              <video
                className={s.coverVideo}
                src={NIR_COVER_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            <p className={s.coverClaim}>{NIR_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>
        <NirPurpose />
        <LandingDirectionNews
          direction="RESEARCH"
          basePath={basePath}
          subtitle="Господдержка НИОКР, аккредитация лабораторий и практика испытаний для промышленности"
        />
        <LandingServiceRoles roles={NIR_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={NIR_FAQ}
          subtitle="Какая лаборатория вправе выполнять неразрушающий контроль, как проверить дефектоскописта и что входит в НИР."
        />
        <NirSeoText />
      </main>
      {footer}
    </div>
  );
}
