import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { ServicesAccordion } from "../../shared/ui/ServicesAccordion";
import { KADASTR_SERVICES } from "../model/content";
import s from "./services.module.scss";

export function KadastrServices() {
  return (
    <section className={s.section} id="vidy-rabot">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Виды кадастровых работ" as="h2" />
          <Subtitle text="Разместите заявку на любую из работ — кадастровые инженеры из СРО откликнутся с ценой и сроками." />
        </header>

        <ServicesAccordion items={KADASTR_SERVICES} />
      </div>
    </section>
  );
}
