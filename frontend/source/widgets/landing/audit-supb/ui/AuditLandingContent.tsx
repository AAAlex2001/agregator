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
import { AuditAudience } from "./Audience";
import { AuditPurpose } from "./Purpose";
import { AuditSeoText } from "./SeoText";
import {
  AUDIT_BULLETS,
  AUDIT_CLAIM,
  AUDIT_COVER,
  AUDIT_FAQ,
  AUDIT_ROLES,
  AUDIT_SUBTITLE,
  AUDIT_TITLE,
} from "../model/content";
import s from "./audit-landing-content.module.scss";

interface Props {
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function AuditLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/audit-supb" />
        <LandingServiceHero title={AUDIT_TITLE} subtitle={AUDIT_SUBTITLE} bullets={AUDIT_BULLETS}>
          <div className={s.cover}>
            <div className={s.coverImage}>
              <Image
                src={AUDIT_COVER}
                alt="Аудит СУПБ"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className={s.coverImg}
                priority
              />
            </div>
            <p className={s.coverClaim}>{AUDIT_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <AuditPurpose />
        <AuditAudience />
        <LandingServiceRoles roles={AUDIT_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={AUDIT_FAQ}
          subtitle="Кому аудит обязателен, как он влияет на категорию риска и кто вправе его проводить."
        />
        <AuditSeoText />
      </main>
      {footer}
    </div>
  );
}
