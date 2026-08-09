"use client";

import { useEffect } from "react";
import { ExpertCardSkeleton } from "@/source/entities/expert";
import { AddReviewModalContainer } from "@/source/features/reviews";
import { TextInput, Title, Subtitle, Tabs } from "@/source/shared/ui";
import { SearchIcon } from "@/source/shared/ui/icons";
import { SortPills, type SortPillSpec } from "@/source/shared/ui/SortPills";
import { ChatModal } from "@/source/widgets/chat";
import type { ContactAccessFilter } from "../model/types";
import { ExpertContactsProvider } from "../model/provider";
import { useMarketplace } from "../model/use-marketplace";
import { useDeals } from "../model/use-deals";
import { useOffer } from "../model/use-offer";
import { ContactDealModal } from "./ContactDealModal";
import { ContactDealsList } from "./ContactDealsList";
import { DeleteContactDealModal } from "./DeleteContactDealModal";
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

interface ExpertContactsMarketplaceProps {
  targetExpertId?: string;
}

export function ExpertContactsMarketplace({ targetExpertId }: ExpertContactsMarketplaceProps) {
  return (
    <ExpertContactsProvider>
      <Marketplace targetExpertId={targetExpertId} />
    </ExpertContactsProvider>
  );
}

function Marketplace({ targetExpertId }: ExpertContactsMarketplaceProps) {
  const market = useMarketplace();
  const deals = useDeals();
  const { offer, saveOffer } = useOffer();

  useEffect(() => {
    if (market.loading || !targetExpertId) return;
    document
      .getElementById(`expert-contact-${targetExpertId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [market.loading, targetExpertId]);

  return (
    <main className={s.page}>
      <header className={s.pageHead}>
        <Title text="Контакты исполнителей" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Выберите специалиста и получите контакты после подписания договора и подтверждения прямой оплаты"
          className={s.pageSubtitle}
        />
      </header>

      {market.role === "EXPERT" && offer && (
        <ContactOfferSettings offer={offer} busy={market.busy} onSave={saveOffer} />
      )}

      <ContactDealsList
        deals={market.deals}
        busy={market.busy}
        onOpen={(id) => void deals.openDeal(id)}
        onOpenChat={(id) => void deals.openDealChat(id)}
        onDelete={deals.requestDeleteDeal}
      />

      <section className={s.catalog} aria-label="Исполнители платформы">
        <div className={s.catalogHead}>
          <div className={s.catalogTitleRow}>
            <Title text="Исполнители платформы" as="h2" className={s.sectionTitle} />
            <span>{market.experts.length}</span>
          </div>
          <div className={s.search}>
            <TextInput
              value={market.search}
              onChange={(event) => market.setSearch(event.target.value)}
              placeholder="ФИО исполнителя"
              aria-label="Фильтр исполнителей по ФИО"
              suffix={<SearchIcon />}
            />
          </div>
        </div>
        <div className={s.catalogFilters}>
          <Tabs
            variant="pill"
            activeTab={market.accessFilter}
            onTabChange={(value) => market.setAccessFilter(value as ContactAccessFilter)}
            className={s.accessTabs}
            tabs={[
              { id: "ALL", label: "Все", count: market.accessCounts.ALL },
              { id: "OPEN", label: "Доступ открыт", count: market.accessCounts.OPEN },
              { id: "CLOSED", label: "Доступ закрыт", count: market.accessCounts.CLOSED },
            ]}
          />
          <div className={s.ratingSort}>
            <SortPills
              options={RATING_SORT_OPTIONS}
              sortBy={market.ratingSort ? "rating" : null}
              sortDir={market.ratingSort}
              title="Сортировка:"
              compact
              onChange={(_, direction) => market.setRatingSort(direction)}
            />
          </div>
        </div>
        {market.loading ? (
          <div className={s.expertList} aria-label="Загружаем исполнителей">
            {Array.from({ length: 3 }, (_, index) => <ExpertCardSkeleton key={index} />)}
          </div>
        ) : market.experts.length === 0 ? (
          <div className={s.empty}>По вашему запросу исполнители не найдены</div>
        ) : (
          <div className={s.expertList}>
            {market.experts.map((expert) => (
              <div
                id={`expert-contact-${expert.public_id}`}
                key={expert.id}
                className={`${s.expertAnchor} ${
                  targetExpertId === expert.public_id ? s.expertAnchorTarget : ""
                }`}
              >
                <ExpertContactCard
                  expert={expert}
                  busy={market.busy}
                  onOpen={() => void deals.openExpert(expert)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <ContactDealModal
        deal={deals.selectedDeal}
        busy={deals.busy}
        onClose={deals.closeDeal}
        onSign={deals.sign}
        onUploadReceipt={deals.uploadReceipt}
        onConfirmPayment={deals.confirmPayment}
        onRejectPayment={deals.rejectPayment}
        onReview={deals.startReview}
      />

      <DeleteContactDealModal
        deal={deals.deleteDeal}
        busy={deals.busy}
        onClose={deals.cancelDeleteDeal}
        onConfirm={() => void deals.confirmDeleteDeal()}
      />

      <AddReviewModalContainer
        isOpen={deals.reviewDeal !== null}
        customerName={deals.reviewDeal?.buyer_name ?? ""}
        orderTitle="Покупка контактов исполнителя"
        expertName={deals.reviewDeal?.seller_name ?? ""}
        title="Оставьте отзыв об исполнителе"
        ratingLabel="Оцените взаимодействие с исполнителем"
        commentPlaceholder="Расскажите о взаимодействии и получении контактных данных"
        onClose={deals.closeReview}
        onSubmit={deals.submitReview}
      />

      <ChatModal
        chatUuid={deals.dealChatUuid}
        open={deals.dealChatUuid !== null}
        onClose={deals.closeDealChat}
      />
    </main>
  );
}
