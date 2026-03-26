import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Реквизиты компании — Ресурс Плюс",
  description: "Официальные реквизиты ООО «НПИ «Недра»: ИНН, ОГРН, банковские реквизиты, лицензии.",
};

type Row = { label: string; value: string; href?: string };
type Section = { title: string; rows: Row[] };

const sections: Section[] = [
  {
    title: "Общие сведения",
    rows: [
      {
        label: "Полное наименование",
        value: "Общество с ограниченной ответственностью «Научный проектно-экспертный институт «Недра»",
      },
      {
        label: "Сокращённое наименование",
        value: "ООО «НПИ «Недра»",
      },
      {
        label: "Руководитель",
        value: "Директор Самохин Сергей Владимирович, действует на основании Устава",
      },
      {
        label: "Дата регистрации",
        value: "25.03.2016 г.",
      },
    ],
  },
  {
    title: "Адреса",
    rows: [
      {
        label: "Юридический адрес",
        value:
          "630008, Новосибирская область, г.о. город Новосибирск, г. Новосибирск, ул. Кирова, зд. 113/2, помещ. 2409",
      },
      {
        label: "Почтовый адрес",
        value: "630008, г. Новосибирск, ул. Кирова, зд. 113/2, а/я 93",
      },
    ],
  },
  {
    title: "Идентификационные номера",
    rows: [
      { label: "ИНН / КПП", value: "4205325060 / 540501001" },
      { label: "ОГРН", value: "1164205057136" },
    ],
  },
  {
    title: "Банковские реквизиты",
    rows: [
      { label: "Расчётный счёт", value: "40702810823060001828" },
      { label: "Банк", value: "Филиал «Новосибирский» АО «Альфа-Банк»" },
      { label: "Корр. счёт", value: "30101810600000000774" },
      { label: "БИК", value: "045004774" },
    ],
  },
  {
    title: "Контакты",
    rows: [
      { label: "Телефон", value: "+7 (905) 995-94-11", href: "tel:+79059959411" },
      { label: "E-mail", value: "nedra-npi@mail.ru", href: "mailto:nedra-npi@mail.ru" },
      { label: "Сайт", value: "nedra-npi.ru", href: "https://nedra-npi.ru" },
    ],
  },
  {
    title: "Лицензии",
    rows: [
      {
        label: "Экспертиза промышленной безопасности",
        value: "№ ДЭ-00-017384 от 06.05.2019 г.",
      },
      {
        label: "Деятельность по сохранению объектов культурного наследия",
        value: "№ Л040-00103-00/00643366",
      },
      {
        label: "Образовательная деятельность",
        value: "№ Л035-01199-54/01139236 от 22.04.2024 г.",
      },
    ],
  },
  {
    title: "Членство в СРО",
    rows: [
      {
        label: "Ассоциация СРО НП Объединение Проектировщиков «ОсноваПроект»",
        value: "№ ВРОП-4205325060",
      },
      {
        label:
          "Ассоциация «Национальное объединение организаций по инженерным изысканиям, геологии и геотехнике»",
        value: "№ ИГТ 05/23-757-5366",
      },
    ],
  },
];

export default function RequisitesPage() {
  return (
    <main className={styles.page}>
      {/* Background */}
      <div className={styles.bgWrap}>
        <Image
          src="/carier.png"
          alt="Промышленный карьер"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.container}>
        {/* Back link */}
        <Link href="/landing" className={styles.back}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          На главную
        </Link>

        {/* Hero */}
        <div className={styles.hero}>
          <h1 className={styles.title}>Реквизиты компании</h1>
          <p className={styles.subtitle}>ООО «НПИ «Недра»</p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <div className={styles.table}>
              {section.rows.map((row) => (
                <div key={row.label} className={styles.row}>
                  <dt className={styles.label}>{row.label}</dt>
                  <dd className={styles.value}>
                    {row.href ? (
                      <a href={row.href} className={styles.link} target={row.href.startsWith("https") ? "_blank" : undefined} rel={row.href.startsWith("https") ? "noopener noreferrer" : undefined}>
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Footer note */}
        <p className={styles.note}>
          Сведения актуальны на 26.03.2026. По вопросам сотрудничества обращайтесь на{" "}
          <a href="mailto:nedra-npi@mail.ru" className={styles.link}>
            nedra-npi@mail.ru
          </a>
          .
        </p>
      </div>
    </main>
  );
}
