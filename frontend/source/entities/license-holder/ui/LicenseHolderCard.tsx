"use client";

import type { ReactNode } from "react";
import { TypeBadge, type ExpertiseType } from "@/source/entities/expertise";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import {
  getFileDisplayName,
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import type { LicenseHolderListItem } from "../model/types";
import s from "./LicenseHolderCard.module.scss";

interface Props {
  item: LicenseHolderListItem;
}

const KNOWN_TYPES = new Set<string>(["КЛ", "ТП", "КЛ/ТП", "ТУ", "ЗС", "Д", "ОБ"]);

function asExpertiseType(area: string): ExpertiseType | null {
  return KNOWN_TYPES.has(area) ? (area as ExpertiseType) : null;
}

function formatRental(item: LicenseHolderListItem): string {
  if (item.license_rental_kind === "PERCENT" && item.license_rental_percent !== null) {
    return `${item.license_rental_percent}% от суммы`;
  }
  if (item.license_rental_kind === "FIXED" && item.license_rental_fixed_amount !== null) {
    return `от ${item.license_rental_fixed_amount.toLocaleString("ru-RU")} ₽`;
  }
  if (item.license_rental_kind === "NEGOTIABLE") {
    return "Договорная";
  }
  return "—";
}

function getCompanyName(item: LicenseHolderListItem): string {
  return (
    item.company_data?.value ??
    item.company_data?.unrestricted_value ??
    item.company_data?.data?.name?.short_with_opf ??
    "Лицензиат"
  );
}

function buildFileItems(
  url: string | null,
  id: string,
  fallbackName: string,
): FileGalleryItem[] {
  if (!url) return [];
  const resolved = resolveFileUrl(url);
  const name = getFileDisplayName(url, fallbackName);
  const isImage = isImageFileName(name);
  return [
    {
      id,
      name,
      url: resolved,
      previewUrl: isImage ? resolved : getFileGalleryPreviewUrl(resolved, name),
      thumbnailUrl: getFileGalleryThumbUrl(resolved, name),
      isImage,
    },
  ];
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
    </div>
  );
}

export function LicenseHolderCard({ item }: Props) {
  const types = (item.license_areas ?? [])
    .map(asExpertiseType)
    .filter((v): v is ExpertiseType => v !== null);

  const fileItems = buildFileItems(item.license_file_url, "license-file", "Лицензия");
  const cardItems = buildFileItems(item.company_card_url, "company-card", "Карточка предприятия");

  return (
    <article className={s.card}>
      <h3 className={s.company} title={getCompanyName(item)}>
        {getCompanyName(item)}
      </h3>

      {item.inn && (
        <Field label="ИНН:">
          <span className={s.value}>{item.inn}</span>
        </Field>
      )}

      {item.license_number && (
        <Field label="Лицензия №:">
          <span className={s.value}>{item.license_number}</span>
        </Field>
      )}

      {item.phone && (
        <Field label="Телефон:">
          <a href={`tel:${item.phone}`} className={s.contact}>
            {item.phone}
          </a>
        </Field>
      )}

      {item.email && (
        <Field label="Почта:">
          <a href={`mailto:${item.email}`} className={s.contact}>
            {item.email}
          </a>
        </Field>
      )}

      {types.length > 0 && (
        <Field label="Области экспертизы:">
          <div className={s.badges}>
            {types.map((t) => (
              <TypeBadge key={t} type={t} active />
            ))}
          </div>
        </Field>
      )}

      <Field label="Стоимость предоставления лицензии:">
        <span className={s.rental}>{formatRental(item)}</span>
      </Field>

      {fileItems.length > 0 && (
        <FileGallery
          items={fileItems}
          label="Файл лицензии:"
          labelClassName={s.label}
          blockClassName={s.fileBlock}
          gridProps={{ className: s.fileGrid }}
          hideWhenEmpty
        />
      )}

      {cardItems.length > 0 && (
        <FileGallery
          items={cardItems}
          label="Карточка предприятия:"
          labelClassName={s.label}
          blockClassName={s.fileBlock}
          gridProps={{ className: s.fileGrid }}
          hideWhenEmpty
        />
      )}
    </article>
  );
}
