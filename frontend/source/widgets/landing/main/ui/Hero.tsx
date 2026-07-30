import s from "./hero.module.scss";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { HeroExpertsMap } from "../../shared/ui/HeroExpertsMap";
import ServicesShowcase from "./ServicesShowcase";

type HeroProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  bullets: string[];
  compact?: boolean;
};

const Hero = ({ title, subtitle, buttonText }: HeroProps) => {
  return (
    <section className={s.hero} id="about">
      <header className={s.heroTitle}>
        <Title text={title} as="h1" className={s.heroTitleText} />
      </header>
      {subtitle && (
        <div className={s.heroLead}>
          <Subtitle text={subtitle} />
        </div>
      )}
      <ServicesShowcase buttonText={buttonText} />
      <div className={s.mapSection}>
        <HeroExpertsMap />
      </div>
    </section>
  );
};

export default Hero;
