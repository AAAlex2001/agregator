import s from "./hero.module.scss";
import { Title } from "@/source/shared/ui/Typography";
import { LogoIcon } from "@/source/shared/ui/icons";
import ServicesShowcase from "./ServicesShowcase";

const TAGLINE =
  "Какая бы перед Вами не стояла проблема, наши специалисты превратят её в задачу, у которой есть решение!";
const HEADLINE = "Первая единая площадка для специалистов и промышленников России";

type HeroProps = {
  basePath?: string;
  activeHref?: string;
};

const Hero = ({ basePath, activeHref = "/" }: HeroProps) => {
  return (
    <section className={s.hero} id="about">
      <header className={s.heroHead}>
        <div className={s.brand}>
          <LogoIcon className={s.brandLogo} />
          <p className={s.tagline}>{TAGLINE}</p>
        </div>
        <Title text={HEADLINE} as={activeHref === "/" ? "h1" : "h2"} className={s.heroTitleText} />
      </header>
      <ServicesShowcase basePath={basePath} activeHref={activeHref} />
    </section>
  );
};

export default Hero;
