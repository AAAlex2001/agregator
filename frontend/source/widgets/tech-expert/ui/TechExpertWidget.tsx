"use client";

import Image from "next/image";
import { Button, Loader, Subtitle, Title } from "@/source/shared/ui";
import { SearchIcon } from "@/source/shared/ui/icons";
import { useTechExpertSearch } from "@/source/features/tech-expert";
import type { TechExpertAccess, TechExpertDocumentCard } from "@/source/entities/tech-expert";
import { LawIcon, NormsIcon, PracticeIcon, SafetyIcon } from "./CategoryIcons";
import { DocumentContent } from "./DocumentContent";
import s from "./TechExpertWidget.module.scss";

const CATEGORIES = [
  {
    Icon: NormsIcon,
    title: "Нормы и стандарты",
    desc: "ГОСТы, СНиПы, СП, СанПиН и другие нормативные документы",
  },
  {
    Icon: LawIcon,
    title: "Законодательство РФ",
    desc: "Федеральные законы, кодексы, постановления и приказы",
  },
  {
    Icon: SafetyIcon,
    title: "Промышленная безопасность",
    desc: "Правила, нормы и требования промышленной безопасности",
  },
  {
    Icon: PracticeIcon,
    title: "Судебная и экспертная практика",
    desc: "Судебные решения, экспертизы и разъяснения",
  },
];

const ACCESS_LABEL: Record<string, string> = {
  full: "Полный доступ",
  card: "Карточка",
  restricted: "Ограничен",
};

function formatDate(value: string | null): string {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}.${month}.${year}`;
}

function accessClass(access: TechExpertAccess): string {
  if (access === "full") return s.accessFull;
  if (access === "card") return s.accessCard;
  return s.accessRestricted;
}

export function TechExpertWidget() {
  const h = useTechExpertSearch();
  const { query, tips, tipsOpen, results, searching, error, detail, detailLoading } = h.state;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void h.search();
  };

  if (detail) {
    return (
      <div className={s.wrapper}>
        <section className={s.docView}>
          <button type="button" className={s.backBtn} onClick={h.closeDetail}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Назад к результатам
          </button>
          {detailLoading ? (
            <div className={s.detailLoading}>
              <Loader />
            </div>
          ) : (
            <DocumentDetail card={detail} formatDate={formatDate} onOpenDocument={h.openDocument} />
          )}
        </section>
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <header className={s.head}>
        <Title as="h1" text="Поиск нормативных документов" />
        <Subtitle text="Доступ к электронному фонду Консорциума «КОДЕКС» — более 100 000 000 актуальных правовых и нормативно-технических документов" />
      </header>

      <section className={s.banner}>
        <div className={s.bannerArt} aria-hidden="true">
          <Image
            className={s.bannerArtImg}
            src="/tech-expert-people.webp"
            alt=""
            fill
            sizes="(max-width: 1023px) 0px, 640px"
          />
        </div>
        <div className={s.bannerTop}>
          <Image className={s.bannerLogo} src="/codex.png" alt="Консорциум КОДЕКС" width={364} height={182} />
          <span className={s.bannerDivider} aria-hidden="true" />
          <div className={s.bannerText}>
            <span className={s.bannerTitle}>Электронный фонд</span>
            <span className={s.bannerSub}>
              более <span className={s.bannerAccent}>100 000 000</span> актуальных правовых и
              нормативно-технических документов
            </span>
          </div>
        </div>

        <form className={s.searchWrap} onSubmit={submit}>
          <div className={s.searchBar}>
            <SearchIcon className={s.searchIcon} />
            <input
              className={s.searchInput}
              placeholder="Введите наименование или номер документа для поиска"
              value={query}
              onChange={(e) => h.setQuery(e.target.value)}
              onFocus={() => tips.length > 0 && h.setTipsOpen(true)}
            />
            {query && (
              <button type="button" className={s.clearBtn} onClick={h.clear} aria-label="Очистить">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <Button type="submit" variant="primary" size="md" isLoading={searching}>
              Найти
            </Button>
          </div>

          {tipsOpen && tips.length > 0 && (
            <ul className={s.dropdown}>
              {tips.map((tip, i) => (
                <li key={`${tip.type}-${i}`}>
                  <button type="button" className={s.dropdownItem} onClick={() => h.pickTip(tip)}>
                    <SearchIcon className={s.dropdownIcon} />
                    <span>{tip.value}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      </section>

      {error && <p className={s.error}>{error}</p>}

      {results ? (
        <section className={s.results}>
          <p className={s.resultsCount}>Найдено документов: {results.total}</p>
          {results.items.length === 0 ? (
            <p className={s.empty}>По запросу ничего не найдено. Попробуйте изменить формулировку.</p>
          ) : (
            <div className={s.resultsList}>
              {results.items.map((doc) => (
                <button key={doc.id} type="button" className={s.docRow} onClick={() => void h.openDocument(doc.id)}>
                  <span className={s.docName}>{doc.name}</span>
                  <span className={s.docMeta}>
                    {[doc.doctype, doc.number, formatDate(doc.date), doc.department].filter(Boolean).join(" · ")}
                  </span>
                  <span className={s.docBadges}>
                    {doc.status && <span className={s.badge}>{doc.status}</span>}
                    <span className={`${s.badge} ${accessClass(doc.access)}`}>
                      {ACCESS_LABEL[doc.access] ?? doc.access}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className={s.cards}>
          {CATEGORIES.map((c) => (
            <div key={c.title} className={s.card}>
              <span className={s.cardIcon}>
                <c.Icon />
              </span>
              <span className={s.cardText}>
                <span className={s.cardTitle}>{c.title}</span>
                <span className={s.cardDesc}>{c.desc}</span>
              </span>
            </div>
          ))}
        </section>
      )}

      {detailLoading && (
        <div className={s.detailLoading}>
          <Loader />
        </div>
      )}
    </div>
  );
}

function DocumentDetail({
  card,
  formatDate,
  onOpenDocument,
}: {
  card: TechExpertDocumentCard;
  formatDate: (value: string | null) => string;
  onOpenDocument: (id: number) => void;
}) {
  const flags = [
    card.is_important && "Важный документ",
    card.has_text && "Полный текст",
    card.has_pdf && "PDF",
    card.has_scan && "Скан",
    card.has_attachments && "Приложения",
  ].filter(Boolean) as string[];

  const rows: { label: string; value: string }[] = [
    { label: "Тип документа", value: card.doctype || "—" },
    { label: "Номер", value: card.number || "—" },
    { label: "Дата регистрации", value: formatDate(card.date) || "—" },
    { label: "Ведомство", value: card.department || "—" },
    { label: "Статус", value: card.status || "—" },
    { label: "Редакция", value: formatDate(card.edition_date) || "—" },
    { label: "Изменение", value: formatDate(card.change_date) || "—" },
  ];

  return (
    <div className={s.detail}>
      <h2 className={s.detailTitle}>{card.name}</h2>

      {flags.length > 0 && (
        <div className={s.detailFlags}>
          {flags.map((flag) => (
            <span key={flag} className={s.flag}>
              {flag}
            </span>
          ))}
        </div>
      )}

      <div className={s.detailRows}>
        {rows.map((row) => (
          <div key={row.label} className={s.detailRow}>
            <span className={s.detailLab}>{row.label}</span>
            <span className={s.detailVal}>{row.value}</span>
          </div>
        ))}
      </div>

      {card.publications.length > 0 && (
        <div className={s.detailSection}>
          <span className={s.detailSectionTitle}>Публикации</span>
          {card.publications.map((pub, i) => (
            <p key={i} className={s.detailText}>
              {pub}
            </p>
          ))}
        </div>
      )}

      {card.has_text && (
        <div className={s.detailSection}>
          <span className={s.detailSectionTitle}>Текст документа</span>
          <DocumentContent
            key={card.id}
            documentId={card.id}
            blocks={card.blocks}
            onOpenDocument={onOpenDocument}
          />
        </div>
      )}
    </div>
  );
}
