"use client";

import { useState } from "react";
import { DocumentCard, useTechExpertDocument, useTechExpertSearch } from "@/entities/tech-expert";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { SearchResults } from "../search-results";
import { TechExpertBanner } from "../tech-expert-banner";
import { TechExpertCategories } from "../tech-expert-categories";
import styles from "./style.module.scss";

/** Пояснение под заголовком страницы. */
const SUBTITLE = "Доступ к электронному фонду Консорциума «КОДЕКС» — более 100 000 000 "
  + "актуальных правовых и нормативно-технических документов";

/** Поиск по фонду «Кодекс»: разделы, найденные документы и карточка открытого документа. */
export function TechExpert() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const search = useTechExpertSearch(searchQuery);
  const openedDocument = useTechExpertDocument(documentId);
  const error = search.error ?? openedDocument.error;

  /** Сбрасывает найденные документы и открытый документ. */
  function clear() {
    setSearchQuery(null);
    setDocumentId(null);
  }

  /** Возвращает к списку найденных документов. */
  function closeDocument() {
    setDocumentId(null);
  }

  if (openedDocument.card) {
    return (
      <div className={styles.wrapper}>
        <section className={styles.documentView}>
          <Button
            variant="outline"
            size="sm"
            className={styles.backButton}
            onClick={closeDocument}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Назад к результатам
          </Button>
          <DocumentCard
            card={openedDocument.card}
            onOpenDocument={setDocumentId}
          />
        </section>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.head}>
        <Title
          as="h1"
          text="Поиск нормативных документов"
        />
        <Subtitle text={SUBTITLE} />
      </header>

      <TechExpertBanner
        isSearching={search.isLoading}
        onSearch={setSearchQuery}
        onClear={clear}
      />

      {error && <p className={styles.error}>{error}</p>}

      {search.result ? (
        <SearchResults
          result={search.result}
          onOpenDocument={setDocumentId}
        />
      ) : (
        <TechExpertCategories />
      )}

      {openedDocument.isLoading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
}
