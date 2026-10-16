import type {
  ContactDeal,
  ExpertContact,
  ExpertContactOffer,
  ExpertContactsFilter,
} from "./types";

/** Отбирает исполнителей по ФИО и доступу; без оценки исполнители идут последними. */
export function filterExpertContacts(
  experts: ExpertContact[],
  filter: ExpertContactsFilter,
): ExpertContact[] {
  const search = filter.search.trim().toLocaleLowerCase("ru-RU");
  const matched = experts.filter((expert) => {
    const matchesName = expert.name.toLocaleLowerCase("ru-RU").includes(search);
    const matchesAccess = filter.access === "ALL"
      || expert.sales_enabled === (filter.access === "OPEN");

    return matchesName && matchesAccess;
  });

  if (!filter.ratingSort) {
    return matched;
  }

  return matched.toSorted((left, right) => {
    if (left.rating === null || right.rating === null) {
      return Number(left.rating === null) - Number(right.rating === null);
    }

    return filter.ratingSort === "desc"
      ? right.rating - left.rating
      : left.rating - right.rating;
  });
}

/** Переносит этап сделки и открытые контакты в карточку её исполнителя. */
export function applyDealToExperts(
  experts: ExpertContact[],
  deal: ContactDeal,
): ExpertContact[] {
  return experts.map((expert) => {
    if (expert.id !== deal.seller_id) {
      return expert;
    }

    return {
      ...expert,
      deal_id: deal.id,
      deal_status: deal.status,
      phone: deal.seller_contacts?.phone ?? expert.phone,
      email: deal.seller_contacts?.email ?? expert.email,
    };
  });
}

/** Переносит сохранённые условия доступа в собственную карточку исполнителя. */
export function applyOfferToExperts(
  experts: ExpertContact[],
  offer: ExpertContactOffer,
): ExpertContact[] {
  return experts.map((expert) => {
    if (!expert.is_mine) {
      return expert;
    }

    return {
      ...expert,
      sales_enabled: offer.enabled,
      price_rubles: offer.price_rubles,
    };
  });
}
