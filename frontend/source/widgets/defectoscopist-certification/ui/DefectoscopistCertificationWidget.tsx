import Image from "next/image";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { Button, DocToc, Subtitle, Title } from "@/source/shared/ui";
import {
  ACCREDITATIONS,
  CONTENT_ITEMS,
  DIRECTIONS,
  FORMATS,
  LICENSES,
  PROGRAM_LINKS,
} from "../model/content";
import s from "./DefectoscopistCertificationWidget.module.scss";

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className={s.list}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

interface DefectoscopistCertificationWidgetProps {
  homeHref?: string;
}

export function DefectoscopistCertificationWidget({
  homeHref = "/",
}: DefectoscopistCertificationWidgetProps) {
  return (
    <main className={s.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: homeHref },
          { label: "Учебный центр" },
          { label: "Аттестация на дефектоскописта" },
        ]}
      />

      <header className={s.head}>
        <Image
          src="/ARC.png"
          alt="ООО «АРЦ НК»"
          width={160}
          height={105}
          className={s.partnerLogo}
          priority
        />
        <Title as="h1" text="Аттестация и обучение дефектоскопистов" className={s.title} />
        <Subtitle
          text="Подготовка, аттестация и сертификация специалистов неразрушающего контроля на базе ООО «АРЦ НК»"
          className={s.subtitle}
        />
      </header>

      <div className={s.layout}>
        <div className={s.content}>
          <section id="about" className={s.section}>
            <h2>Об аттестационном центре</h2>
            <p>
              Общество с ограниченной ответственностью «Аттестационный региональный центр
              специалистов неразрушающего контроля» создано в Томске в ноябре 2007 года
              ведущими специалистами в области неразрушающего контроля и экспертизы
              промышленной безопасности.
            </p>
            <p>
              ООО «АРЦ НК» готовит и аттестует специалистов, оценивает лаборатории,
              проводит испытания и разрабатывает методики контроля. Центр имеет необходимые
              лицензии и разрешения для образовательной и испытательной деятельности.
            </p>
          </section>

          <section id="directions" className={s.section}>
            <h2>Направления деятельности</h2>
            <BulletList items={DIRECTIONS} />
          </section>

          <section id="credentials" className={s.section}>
            <h2>Аккредитации и лицензии</h2>
            <p>
              Организация аккредитована в Единой системе оценки соответствия в области
              промышленной, экологической безопасности, безопасности в энергетике и
              строительстве.
            </p>
            <h3>Аккредитации</h3>
            <BulletList items={ACCREDITATIONS} />
            <h3>Лицензии и разрешения</h3>
            <BulletList items={LICENSES} />
          </section>

          <section id="formats" className={s.section}>
            <h2>Форматы обучения</h2>
            <div className={s.formats}>
              {FORMATS.map((format) => (
                <article key={format.title} className={s.format}>
                  <h3>{format.title}</h3>
                  <p>{format.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="programs" className={s.section}>
            <h2>Программы и услуги</h2>
            <p>Подробные требования, программы подготовки и порядок подачи документов:</p>
            <div className={s.programs}>
              {PROGRAM_LINKS.map((link) => (
                <Button
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlineOrange"
                  showArrow
                  className={s.programButton}
                >
                  <span className={s.programButtonLabel}>{link.label}</span>
                </Button>
              ))}
            </div>
          </section>

          <section id="contacts" className={`${s.section} ${s.contacts}`}>
            <div>
              <span className={s.contactLabel}>ООО «АРЦ НК»</span>
              <h2>Связаться с учебным центром</h2>
              <p>Специалисты центра помогут выбрать программу и формат подготовки.</p>
            </div>
            <div className={s.contactLinks}>
              <a href="tel:+73822601698">+7 (3822) 60-16-98</a>
              <a href="tel:+79138138496">+7 913 813-84-96</a>
              <a href="mailto:info@arcnk.ru">info@arcnk.ru</a>
              <a href="https://arcnk.ru/" target="_blank" rel="noopener noreferrer">
                arcnk.ru
              </a>
            </div>
          </section>
        </div>

        <DocToc items={CONTENT_ITEMS} className={s.toc} />
      </div>
    </main>
  );
}
