"use client";

import { ExpertCardSkeleton } from "@/source/entities/expert";
import { TextInput, Title, Subtitle, Tabs } from "@/source/shared/ui";
import { SearchIcon } from "@/source/shared/ui/icons";
import { SortPills, type SortPillSpec } from "@/source/shared/ui/SortPills";
import type { ContactAccessFilter } from "../model/types";
import { useExpertContacts } from "../model/useExpertContacts";
import { ContactDealModal } from "./ContactDealModal";
import { ContactDealsList } from "./ContactDealsList";
import { ContactOfferSettings } from "./ContactOfferSettings";
import { ExpertContactCard } from "./ExpertContactCard";
import s from "./ExpertContactsMarketplace.module.scss";

const RATING_SORT_OPTIONS: SortPillSpec<"rating">[] = [
  {
    key: "rating",
    label: "Рейтинг",
    descLabel: "Сначала с высоким рейтингом",
    ascLabel: "Сначала с низким рейтингом",
  },
];

export function ExpertContactsMarketplace() {
  const contacts = useExpertContacts();

  return (
    <main className={s.page}>
      <header className={s.pageHead}>
        <Title text="Контакты экспертов" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Выберите специалиста и получите контакты после подписания договора и подтверждения прямой оплаты"
          className={s.pageSubtitle}
        />
      </header>

      {contacts.role === "EXPERT" && contacts.offer && (
        <ContactOfferSettings
          offer={contacts.offer}
          busy={contacts.busy}
          onSave={contacts.saveOffer}
        />
      )}

      <ContactDealsList
        deals={contacts.deals}
        busy={contacts.busy}
        onOpen={(id) => void contacts.openDeal(id)}
      />

      {contacts.error && <p className={s.error}>{contacts.error}</p>}

      <section className={s.catalog} aria-label="Эксперты платформы">
        <div className={s.catalogHead}>
          <div className={s.catalogTitleRow}>
            <Title text="Эксперты платформы" as="h2" className={s.sectionTitle} />
            <span>{contacts.experts.length}</span>
          </div>
          <div className={s.search}>
            <TextInput
              value={contacts.search}
              onChange={(event) => contacts.setSearch(event.target.value)}
              placeholder="ФИО эксперта"
              aria-label="Фильтр экспертов по ФИО"
              suffix={<SearchIcon />}
            />
          </div>
        </div>
        <div className={s.catalogFilters}>
          <Tabs
            variant="pill"
            activeTab={contacts.accessFilter}
            onTabChange={(value) => contacts.setAccessFilter(value as ContactAccessFilter)}
            className={s.accessTabs}
            tabs={[
              { id: "ALL", label: "Все", count: contacts.accessCounts.ALL },
              { id: "OPEN", label: "Доступ открыт", count: contacts.accessCounts.OPEN },
              { id: "CLOSED", label: "Доступ закрыт", count: contacts.accessCounts.CLOSED },
            ]}
          />
          <SortPills
            options={RATING_SORT_OPTIONS}
            sortBy={contacts.ratingSort ? "rating" : null}
            sortDir={contacts.ratingSort}
            title="Сортировка:"
            compact
            onChange={(_, direction) => contacts.setRatingSort(direction)}
          />
        </div>
        {contacts.loading ? (
          <div className={s.expertList} aria-label="Загружаем экспертов">
            {Array.from({ length: 3 }, (_, index) => <ExpertCardSkeleton key={index} />)}
          </div>
        ) : contacts.experts.length === 0 ? (
          <div className={s.empty}>По вашему запросу эксперты не найдены</div>
        ) : (
          <div className={s.expertList}>
            {contacts.experts.map((expert) => (
              <ExpertContactCard
                key={expert.id}
                expert={expert}
                busy={contacts.busy}
                onOpen={() => void contacts.openExpert(expert)}
              />
            ))}
          </div>
        )}
      </section>

      <ContactDealModal
        deal={contacts.selectedDeal}
        busy={contacts.busy}
        onClose={contacts.closeDeal}
        onSign={contacts.sign}
        onUploadReceipt={contacts.uploadReceipt}
        onConfirmPayment={contacts.confirmPayment}
        onRejectPayment={contacts.rejectPayment}
      />
    </main>
  );
}
