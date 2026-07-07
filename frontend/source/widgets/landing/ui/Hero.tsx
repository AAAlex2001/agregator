import s from "./hero.module.scss";
import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { CheckIcon, TelegramIcon } from "@/source/shared/ui/icons";
import { HeroExpertsMap } from "./HeroExpertsMap";

const BOT_URL = "https://t.me/resursplus_robot";

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
          <div className={s.heroActions}>
            <Button href="/register" variant="primary" fullWidth showArrow className={s.heroButton}>
              {buttonText}
            </Button>
            <Button
              href={BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="telegram"
              fullWidth
              className={s.heroButton}
            >
              <span>Начать работать в Telegram</span>
              <TelegramIcon />
            </Button>
          </div>
        </div>
        <div className={s.visual}>
          <HeroExpertsMap />
        </div>
      </div>
    </section>
  );
};

export default Hero;
