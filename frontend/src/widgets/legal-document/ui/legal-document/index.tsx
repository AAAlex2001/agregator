import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { DocumentContent } from "@/shared/ui/document-content";
import type { DocumentSection } from "@/shared/ui/document-content";
import { DocumentToc } from "@/shared/ui/document-toc";
import type { DocumentTocItem } from "@/shared/ui/document-toc";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Заголовки, текст и оглавление юридического документа. */
export interface LegalDocumentContent {
  title: string;
  breadcrumbLabel?: string;
  intro: string;
  sections: DocumentSection[];
  tableOfContents?: DocumentTocItem[];
}

/** Документ и путь к главной в текущем разделе сайта. */
interface LegalDocumentProps extends LegalDocumentContent {
  homeHref: string;
}

/** Собирает заголовок, текст и оглавление юридического документа. */
export function LegalDocument({
  title,
  breadcrumbLabel = title,
  intro,
  sections,
  tableOfContents,
  homeHref,
}: LegalDocumentProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { label: "Главная", href: homeHref },
            { label: breadcrumbLabel },
          ]}
        />
        <header className={styles.header}>
          <Title
            as="h1"
            text={title}
            className={styles.title}
          />
          <p className={styles.intro}>{intro}</p>
        </header>

        {tableOfContents ? (
          <div className={styles.grid}>
            <DocumentContent
              sections={sections}
              className={styles.content}
            />
            <DocumentToc
              items={tableOfContents}
              className={styles.toc}
            />
          </div>
        ) : (
          <DocumentContent
            sections={sections}
            className={styles.fullWidthContent}
          />
        )}
      </div>
    </main>
  );
}
