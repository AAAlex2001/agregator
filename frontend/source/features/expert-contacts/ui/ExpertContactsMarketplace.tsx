"use client";

import { Button, TextInput } from "@/source/shared/ui";
import { SearchIcon } from "@/source/shared/ui/icons";
import { useExpertContacts } from "../model/useExpertContacts";
import { ContactDealModal } from "./ContactDealModal";
import { ContactDealsList } from "./ContactDealsList";
import { ContactOfferSettings } from "./ContactOfferSettings";
import { ExpertContactCard } from "./ExpertContactCard";
import s from "./ExpertContacts.module.scss";

export function ExpertContactsMarketplace() {
  const contacts = useExpertContacts();

  return (
    <main className={s.page}>
      <header className={s.pageHead}>
        <div>
          <h1>Контакты экспертов</h1>
          <p>
            Подберите специалиста по областям аттестации. Контактные данные открываются
            после электронного договора и подтверждения прямой оплаты эксперту.
          </p>
        </div>
        <form
          className={s.search}
          onSubmit={(event) => {
            event.preventDefault();
            void contacts.searchNow();
          }}
        >
          <TextInput
            value={contacts.search}
            onChange={(event) => contacts.setSearch(event.target.value)}
            placeholder="ФИО, город"
          />
          <Button type="submit" variant="outlineOrange" size="sm" disabled={contacts.loading}>
            <SearchIcon /> Найти
          </Button>
        </form>
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

      <section className={s.catalog} aria-labelledby="expert-catalog-title">
        <div className={s.catalogHead}>
          <h2 id="expert-catalog-title">Эксперты платформы</h2>
          <span>{contacts.experts.length}</span>
        </div>
        {contacts.loading ? (
          <div className={s.loading}>Загружаем экспертов…</div>
        ) : contacts.experts.length === 0 ? (
          <div className={s.empty}>По вашему запросу эксперты не найдены</div>
        ) : (
          <div className={s.grid}>
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
