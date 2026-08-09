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
import { NirSeoText } from "./SeoText";
import {
  NIR_BULLETS,
  NIR_CLAIM,
  NIR_COVER,
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
              <Image
                src={NIR_COVER}
                alt="Проведение НИР и лабораторных исследований"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className={s.coverImg}
                priority
              />
            </div>
            <p className={s.coverClaim}>{NIR_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>
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
