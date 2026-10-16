import type { LicenseHolderListItem } from "./types";

/** Выбирает название компании из сохранённых реквизитов. */
export function getLicenseHolderName(item: LicenseHolderListItem): string {
  return (
    item.company_data?.value ??
    item.company_data?.unrestricted_value ??
    item.company_data?.data?.name?.short_with_opf ??
    "Держатель разрешительных документов"
  );
}

/** Показывает согласованный способ оплаты за предоставление лицензии. */
export function formatLicenseRental(item: LicenseHolderListItem): string {
  if (
    item.license_rental_kind === "PERCENT" &&
    item.license_rental_percent !== null
  ) {
    return `${item.license_rental_percent}% от суммы`;
  }

  if (
    item.license_rental_kind === "FIXED" &&
    item.license_rental_fixed_amount !== null
  ) {
    return `от ${item.license_rental_fixed_amount.toLocaleString("ru-RU")} ₽`;
  }

  if (item.license_rental_kind === "NEGOTIABLE") {
    return "Договорная";
  }

  return "—";
}
