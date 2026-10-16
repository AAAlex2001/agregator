"use client";

import { useEffect, useState } from "react";
import { countLaborTabUnread, useChatList } from "@/entities/chat";
import { useLaborListings } from "@/entities/labor";
import type { LaborListingKind } from "@/entities/labor";
import { LaborListingForm } from "@/features/create-labor-listing";
import { Accordion } from "@/shared/ui/accordion";
import { Subtitle } from "@/shared/ui/subtitle";
import { Tabs } from "@/shared/ui/tabs";
import { Title } from "@/shared/ui/title";
import { EMPLOYMENT_COPY, EXPERT_SEARCH_COPY } from "../../config/pages";
import { LaborListings } from "../labor-listings";
import styles from "./style.module.scss";

/** Вид объявлений раздела и вкладка из адреса страницы. */
interface LaborResourcesProps {
  kind: LaborListingKind;
  initialTab: string;
}

/** Собирает раздел трудовых ресурсов: вкладки объявлений и форму публикации. */
export function LaborResources({ kind, initialTab }: LaborResourcesProps) {
  const [tab, setTab] = useState(initialTab);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { chats } = useChatList();
  const listings = useLaborListings(kind, tab === "mine");
  const copy = kind === "EXPERT_WANTED" ? EXPERT_SEARCH_COPY : EMPLOYMENT_COPY;
  const openFormId = isFormOpen ? "labor-form" : null;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1440px)");

    /** Переносит форму из раскрывающегося блока в боковую колонку на широком экране. */
    function updateLayout() {
      setIsDesktop(media.matches);
    }

    updateLayout();
    media.addEventListener("change", updateLayout);

    return () => media.removeEventListener("change", updateLayout);
  }, []);

  /** Сворачивает форму и показывает свои объявления с новой заявкой. */
  function showCreatedListing() {
    setIsFormOpen(false);

    if (tab === "mine") {
      listings.reload();
      return;
    }

    setTab("mine");
  }

  /** Раскрывает или сворачивает форму на узком экране. */
  function toggleForm() {
    setIsFormOpen(!isFormOpen);
  }

  const form = (
    <LaborListingForm
      kind={kind}
      title={copy.formTitle}
      onCreated={showCreatedListing}
    />
  );

  return (
    <main className={styles.wrapper}>
      <header className={styles.head}>
        <Title
          text={copy.title}
          as="h1"
          className={styles.title}
        />
        <Subtitle
          text={copy.subtitle}
          className={styles.subtitle}
        />
      </header>

      {!isDesktop && (
        <div className={styles.mobileForm}>
          <Accordion
            activeId={openFormId}
            onToggle={toggleForm}
            items={[
              {
                id: "labor-form",
                question: copy.formTitle,
                answer: form,
              },
            ]}
          />
        </div>
      )}

      <div className={styles.layout}>
        <section className={styles.content}>
          <Tabs
            variant="pill"
            activeTab={tab}
            onTabChange={setTab}
            tabs={[
              {
                id: "browse",
                label: copy.browseTab,
                count: countLaborTabUnread(chats, kind, false),
              },
              {
                id: "mine",
                label: "Мои заявки",
                count: countLaborTabUnread(chats, kind, true),
              },
            ]}
          />

          <LaborListings
            items={listings.items}
            isMine={tab === "mine"}
            isLoading={listings.isLoading}
            error={listings.error}
            onClosed={listings.reload}
          />
        </section>

        {isDesktop && <aside>{form}</aside>}
      </div>
    </main>
  );
}
