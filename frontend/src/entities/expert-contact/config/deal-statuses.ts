/** Цвет этапа сделки и подписи для покупателя, исполнителя и без стороны. */
export const CONTACT_DEAL_STATUSES = {
  AWAITING_BUYER_SIGNATURE: {
    tone: "blue",
    BUYER: "Подпишите договор",
    SELLER: "Ожидайте подписи покупателя",
    DEFAULT: "Ожидается подпись покупателя",
  },
  AWAITING_SELLER_SIGNATURE: {
    tone: "blue",
    BUYER: "Ожидайте подписи исполнителя",
    SELLER: "Подпишите договор",
    DEFAULT: "Ожидается подпись исполнителя",
  },
  AWAITING_PAYMENT: {
    tone: "orange",
    BUYER: "Оплатите и приложите чек",
    SELLER: "Ожидайте оплаты от покупателя",
    DEFAULT: "Ожидается оплата",
  },
  PAYMENT_REPORTED: {
    tone: "brown",
    BUYER: "Ожидайте подтверждения оплаты",
    SELLER: "Проверьте оплату покупателя",
    DEFAULT: "Оплата ожидает проверки",
  },
  PAYMENT_REJECTED: {
    tone: "red",
    BUYER: "Загрузите новый чек",
    SELLER: "Ожидайте новый чек от покупателя",
    DEFAULT: "Чек отклонён",
  },
  CONTACTS_RELEASED: {
    tone: "green",
    BUYER: "Контакты исполнителя доступны",
    SELLER: "Контакты переданы покупателю",
    DEFAULT: "Контакты открыты",
  },
  CANCELED: {
    tone: "gray",
    BUYER: "Сделка отменена",
    SELLER: "Сделка отменена",
    DEFAULT: "Сделка отменена",
  },
};

/** Подписи результата проверки чека исполнителем. */
export const CONTACT_RECEIPT_STATUSES = {
  PENDING: "На проверке",
  APPROVED: "Подтверждён",
  REJECTED: "Отклонён",
  SUPERSEDED: "Заменён",
};
