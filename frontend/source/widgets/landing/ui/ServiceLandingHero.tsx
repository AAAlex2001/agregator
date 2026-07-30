import type { ReactNode } from "react";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./service-landing-hero.module.scss";

export interface ServiceLandingBullet {
  title: string;
  text: string;
}

interface ServiceLandingHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: ServiceLandingBullet[];
  children: ReactNode;
}

const ServiceLandingHero = ({
  eyebrow,
  title,
  subtitle,
  bullets = [],
  children,
}: ServiceLandingHeroProps) => {
  return (
    <section className={s.hero}>
      <div className={s.inner}>
        <div className={s.left}>
          {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
          <Title text={title} as="h1" />
          {subtitle && <Subtitle text={subtitle} />}
          {bullets.length > 0 && (
            <ul className={s.bullets}>
              {bullets.map((bullet, index) => (
                <li key={bullet.title} className={s.bullet}>
                  <span className={s.num}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={s.bulletBody}>
                    <span className={s.bulletTitle}>{bullet.title}</span>
                    <span className={s.bulletText}>{bullet.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={s.right}>{children}</div>
      </div>
    </section>
  );
};

export default ServiceLandingHero;
