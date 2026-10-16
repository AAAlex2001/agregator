import { DocumentRow } from "@/entities/tech-expert";
import type { TechExpertSearchResult } from "@/entities/tech-expert";
import styles from "./style.module.scss";

/** Найденные документы и их открытие. */
interface SearchResultsProps {
  result: TechExpertSearchResult;
  onOpenDocument: (documentId: number) => void;
}

/** Число найденных документов и их список; без совпадений — подсказка. */
export function SearchResults({ result, onOpenDocument }: SearchResultsProps) {
  return (
    <section className={styles.results}>
      <p className={styles.count}>Найдено документов: {result.total}</p>
      {result.items.length === 0 ? (
        <p className={styles.empty}>
          По запросу ничего не найдено. Попробуйте изменить формулировку.
        </p>
      ) : (
        <div className={styles.list}>
          {result.items.map((document) => (
            <DocumentRow
              key={document.id}
              document={document}
              onOpen={onOpenDocument}
            />
          ))}
        </div>
      )}
    </section>
  );
}
