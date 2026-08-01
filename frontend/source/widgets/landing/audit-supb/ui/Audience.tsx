import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { ServicesAccordion } from "../../shared/ui/ServicesAccordion";
import { AUDIT_AUDIENCE } from "../model/content";
import s from "./audience.module.scss";

export function AuditAudience() {
  return (
    <section className={s.section} id="dlya-kogo">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Для кого это нужно" as="h2" />
          <Subtitle text="Кому аудит СУПБ обязателен по закону, а кому даёт снижение категории риска и меньше проверок." />
        </header>

        <ServicesAccordion items={AUDIT_AUDIENCE} />
      </div>
    </section>
  );
}
