import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { NIR_PURPOSE } from "../model/content";
import s from "./purpose.module.scss";

export function NirPurpose() {
  return (
    <section className={s.section} id="zachem-nir">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Зачем нужны НИР" as="h2" />
          <Subtitle text="От проверки идеи расчётами до доказательной базы для экспертизы и сертификации." />
        </header>

        <div className={s.panel}>
          {NIR_PURPOSE.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={s.text}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
