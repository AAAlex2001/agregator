import { LogoIcon } from "@/shared/ui/icons";
import { Title } from "@/shared/ui/title";
import type { LandingNavigationProps } from "../../model/types";
import { NavigationPanel } from "../navigation-panel";
import styles from "./style.module.scss";

/** Представляет платформу и выбор направления с картой специалистов. */
export function LandingNavigation({
  activeHref = "/",
  onNavigate,
  renderMap,
}: LandingNavigationProps) {
  return (
    <section
      className={styles.hero}
      id="about"
    >
      <header className={styles.heroHead}>
        <div className={styles.brand}>
          <LogoIcon className={styles.brandLogo} />
          <p className={styles.tagline}>
            Какая бы перед Вами не стояла проблема, наши специалисты превратят её в
            задачу, у которой есть решение!
          </p>
        </div>
        <Title
          text="Первая единая площадка для специалистов и промышленников России"
          as={activeHref === "/" ? "h1" : "h2"}
          className={styles.heroTitleText}
        />
      </header>
      <NavigationPanel
        activeHref={activeHref}
        onNavigate={onNavigate}
        renderMap={renderMap}
      />
    </section>
  );
}
