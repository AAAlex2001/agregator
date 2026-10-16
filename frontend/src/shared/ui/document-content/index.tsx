import { Title } from "@/shared/ui/title";
import type { DocumentSection } from "./model/types";
import { DocumentBlockContent } from "./ui/document-block";
import styles from "./style.module.scss";

/** Разделы документа и оформление их общего контейнера. */
interface DocumentContentProps {
  sections: DocumentSection[];
  className?: string;
}

/** Показывает разделы документа с заголовками и якорями оглавления. */
export function DocumentContent({ sections, className }: DocumentContentProps) {
  return (
    <div className={className}>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={styles.section}
        >
          {section.title && (
            <Title
              as="h2"
              text={section.title}
              className={styles.sectionTitle}
            />
          )}
          <div className={styles.blocks}>
            {section.blocks.map((block, index) => (
              <DocumentBlockContent
                key={`${block.kind}-${index}`}
                block={block}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export type { DocumentSection } from "./model/types";
