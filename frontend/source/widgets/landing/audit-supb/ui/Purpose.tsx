import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { AUDIT_PURPOSE } from "../model/content";
import s from "./purpose.module.scss";

export function AuditPurpose() {
  return (
    <section className={s.section} id="chto-eto">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Что это такое" as="h2" />
          <Subtitle text="Независимая оценка того, как система управления промышленной безопасностью работает на самом деле." />
        </header>

        <div className={s.panel}>
          {AUDIT_PURPOSE.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={s.text}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
