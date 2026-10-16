import { escapeHtml } from "@/shared/lib/escape-html";
import type { ExpertMapItem } from "./types";

/** Оформляет строку карточки; значение уже подготовлено как безопасный HTML. */
function createBalloonRow(label: string, value: string): string {
  return `<div style="margin-top:4px"><b>${label}:</b> ${value}</div>`;
}

/** Показывает тариф исполнителя и ссылку покупки его контактных данных. */
function getPaidContactsNotice(
  expert: ExpertMapItem,
  contactsHref: string,
): string {
  const price = expert.contact_price_rubles?.toLocaleString("ru-RU");
  const priceText = price
    ? ` по тарифу исполнителя: ${price} ₽`
    : "";
  const href = escapeHtml(
    `${contactsHref}?expert=${encodeURIComponent(expert.public_id)}`,
  );

  return (
    '<div style="margin-top:8px;padding:8px;border-radius:6px;' +
    'background:var(--color-orange-bg-soft);' +
    'color:var(--color-orange-notice-text);font-weight:600">' +
    `Контактные данные доступны только после оплаты${priceText}.` +
    `<a href="${href}" ` +
    'style="display:block;margin-top:8px;color:var(--color-orange-notice-text);' +
    'text-decoration:underline;font-weight:700">' +
    "Купить контакты</a></div>"
  );
}

/** Собирает карточку метки, экранируя сведения исполнителя для SDK карты. */
export function getExpertMapBalloon(
  expert: ExpertMapItem,
  contactsHref: string,
): string {
  const city = expert.city ? escapeHtml(expert.city) : "";
  const rating = expert.rating === null ? "" : `Рейтинг ${expert.rating.toFixed(1)}`;
  const travels = expert.travels_to_other_regions ? "Выезжает в другие регионы" : "";
  const details = [city, rating, travels].filter(Boolean).join("<br>");
  const certificates = expert.certificates?.length
    ? createBalloonRow("Удостоверения", expert.certificates.map(escapeHtml).join("<br>"))
    : "";
  const phone = expert.phone ? createBalloonRow("Телефон", escapeHtml(expert.phone)) : "";
  const email = expert.email ? createBalloonRow("Email", escapeHtml(expert.email)) : "";
  const paidContacts = expert.contacts_paid
    ? getPaidContactsNotice(expert, contactsHref)
    : "";

  return [details, certificates, phone, email, paidContacts].join("");
}
