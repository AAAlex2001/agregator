import { HeroExpertsMap } from "./HeroExpertsMap";
import s from "./experts-map-section.module.scss";

export function ExpertsMapSection() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        <HeroExpertsMap />
      </div>
    </section>
  );
}
