import s from "./hero.module.scss";
import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { CheckIcon } from "@/source/shared/ui/icons";
import { HeroExpertsMap } from "./HeroExpertsMap";

type HeroProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  bullets: string[];
  compact?: boolean;
};

const Hero = ({ title, subtitle, buttonText, bullets, compact = false }: HeroProps) => {
  const hasBullets = bullets.length > 0;
  const sectionClass = compact ? `${s.hero} ${s.heroCompact}` : s.hero;

  return (
    <section className={sectionClass} id="about">
      <header className={s.heroTitle}>
        <Title text={title} as="h1" className={s.heroTitleText} />
      </header>
      <div className={s.heroBody}>
        <div className={s.leftSection}>
          <div className={s.heroHeader}>
            {hasBullets && (
              <ul className={s.bullets}>
                {bullets.map((bullet) => (
                  <li key={bullet} className={s.bulletItem}>
                    <CheckIcon className={s.bulletIcon} />
                    <span className={s.bulletText}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
            <Subtitle text={subtitle} className={s.heroSubtitle} />
          </div>
          <Button href="/register" variant="primary" fullWidth showArrow className={s.heroButton}>
            {buttonText}
          </Button>
        </div>
        <div className={s.visual}>
          <HeroExpertsMap />
        </div>
      </div>
    </section>
  );
};

export default Hero;
