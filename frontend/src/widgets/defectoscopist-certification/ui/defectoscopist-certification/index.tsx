import cn from "classnames";
import Image from "next/image";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { Button } from "@/shared/ui/button";
import { DocumentToc } from "@/shared/ui/document-toc";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import {
  ACCREDITATIONS,
  CONTENT_ITEMS,
  DIRECTIONS,
  FORMATS,
  LICENSES,
  PROGRAM_LINKS,
} from "../../config/content";
import styles from "./style.module.scss";

/** Путь к главной в текущем разделе сайта. */
interface DefectoscopistCertificationProps {
  homeHref: string;
}

/** Страница учебного центра ООО «АРЦ НК»: направления, лицензии, форматы и контакты. */
export function DefectoscopistCertification({ homeHref }: DefectoscopistCertificationProps) {
  return (
    <main className={styles.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: homeHref },
          { label: "Учебный центр" },
          { label: "Аттестация на дефектоскописта" },
        ]}
      />

      <header className={styles.head}>
        <Image
          src="/ARC.png"
          alt="ООО «АРЦ НК»"
          width={160}
          height={105}
          className={styles.partnerLogo}
          priority
        />
        <Title
          as="h1"
          text="Аттестация и обучение дефектоскопистов"
          className={styles.title}
        />
        <Subtitle
          text="Подготовка, аттестация и сертификация специалистов неразрушающего контроля на базе ООО «АРЦ НК»"
          className={styles.subtitle}
        />
      </header>

      <div className={styles.layout}>
        <div className={styles.content}>
          <section
            id="about"
            className={styles.section}
          >
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

          <section
            id="directions"
            className={styles.section}
          >
            <h2>Направления деятельности</h2>
            <ul className={styles.list}>
              {DIRECTIONS.map((direction) => (
                <li key={direction}>{direction}</li>
              ))}
            </ul>
          </section>

          <section
            id="credentials"
            className={styles.section}
          >
            <h2>Аккредитации и лицензии</h2>
            <p>
              Организация аккредитована в Единой системе оценки соответствия в области
              промышленной, экологической безопасности, безопасности в энергетике и
              строительстве.
            </p>
            <h3>Аккредитации</h3>
            <ul className={styles.list}>
              {ACCREDITATIONS.map((accreditation) => (
                <li key={accreditation}>{accreditation}</li>
              ))}
            </ul>
            <h3>Лицензии и разрешения</h3>
            <ul className={styles.list}>
              {LICENSES.map((license) => (
                <li key={license}>{license}</li>
              ))}
            </ul>
          </section>

          <section
            id="formats"
            className={styles.section}
          >
            <h2>Форматы обучения</h2>
            <div className={styles.formats}>
              {FORMATS.map((format) => (
                <article
                  key={format.title}
                  className={styles.format}
                >
                  <h3>{format.title}</h3>
                  <p>{format.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="programs"
            className={styles.section}
          >
            <h2>Программы и услуги</h2>
            <p>Подробные требования, программы подготовки и порядок подачи документов:</p>
            <div className={styles.programs}>
              {PROGRAM_LINKS.map((link) => (
                <Button
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlineOrange"
                  showArrow
                  className={styles.programButton}
                >
                  <span className={styles.programButtonLabel}>{link.label}</span>
                </Button>
              ))}
            </div>
          </section>

          <section
            id="contacts"
            className={cn(styles.section, styles.contacts)}
          >
            <div>
              <span className={styles.contactLabel}>ООО «АРЦ НК»</span>
              <h2>Связаться с учебным центром</h2>
              <p>Специалисты центра помогут выбрать программу и формат подготовки.</p>
            </div>
            <div className={styles.contactLinks}>
              <a href="tel:+73822601698">+7 (3822) 60-16-98</a>
              <a href="tel:+79138138496">+7 913 813-84-96</a>
              <a href="mailto:info@arcnk.ru">info@arcnk.ru</a>
              <a
                href="https://arcnk.ru/"
                target="_blank"
                rel="noopener noreferrer"
              >
                arcnk.ru
              </a>
            </div>
          </section>
        </div>

        <DocumentToc
          items={CONTENT_ITEMS}
          className={styles.toc}
        />
      </div>
    </main>
  );
}
