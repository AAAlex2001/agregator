import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { TECH_DIAG_DEFINITIONS } from "../model/content";
import s from "./definitions.module.scss";

export function TechDiagDefinitions() {
  return (
    <section className={s.section} id="chto-eto">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Что это такое" as="h2" />
          <Subtitle text="Полная картина технического состояния объекта: от оценки возможности эксплуатации до контроля отдельных элементов." />
        </header>

        <div className={s.panel}>
          {TECH_DIAG_DEFINITIONS.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={s.text}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
