"use client";

import { useState, type ReactNode } from "react";
import { TypeBadge, type ExpertiseType } from "@/source/entities/expertise";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import {
  getFileDisplayName,
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
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

function KlTpSlot({ types }: { types: ExpertiseType[] }) {
  if (types.includes("КЛ/ТП")) {
    return (
      <div className={s.badgeSlot}>
        <TypeBadge type="КЛ/ТП" active />
      </div>
    );
  }
  const hasKl = types.includes("КЛ");
  const hasTp = types.includes("ТП");
  if (!hasKl && !hasTp) {
    return (
      <div className={s.badgeSlot}>
        <span className={s.badgeMissing}>—/—</span>
      </div>
    );
  }
  return (
    <div className={s.badgeSlot}>
      <span className={s.badgeCombo}>
        {hasKl ? "КЛ" : "—"}
        {"/"}
        {hasTp ? "ТП" : "—"}
      </span>
    </div>
  );
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
  const [open, setOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const types = (item.license_areas ?? [])
    .map(asExpertiseType)
    .filter((v): v is ExpertiseType => v !== null);

  const fileItems = buildFileItems(item.license_file_url, "license-file", "Лицензия");
  const cardItems = buildFileItems(item.company_card_url, "company-card", "Карточка предприятия");
  const miningItems = buildFileItems(item.mining_license_file_url, "mining-license", "Лицензия маркшейдера");
  const sroItems = buildFileItems(item.sro_design_file_url, "sro-design", "Выписка СРО");
  const labItems = buildFileItems(item.lab_accreditation_file_url, "lab-accreditation", "Аккредитация лаборатории");
  const hasAnyExtras = Boolean(
    item.mining_license_number ||
      item.sro_design_number ||
      item.lab_accreditation_number ||
      item.mining_license_file_url ||
      item.sro_design_file_url ||
      item.lab_accreditation_file_url,
  );
  const companyName = getCompanyName(item);

  function toggle() {
    setOpen((value) => !value);
  }

  function handleCardClick(event: React.MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a, button")) return;
    toggle();
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    if ((event.target as HTMLElement).closest("a, button")) return;
    event.preventDefault();
    toggle();
  }

  return (
    <article
      className={s.card}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className={s.header}>
        <h3 className={s.company} title={companyName}>
          {companyName}
        </h3>
        <ChatChevronDownIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`.trim()} />
      </div>

      <div className={s.badges}>
        <KlTpSlot types={types} />
        {(["ЗС", "ТУ", "Д", "ОБ"] as const).map((t) => (
          <div key={t} className={s.badgeSlot}>
            {types.includes(t) ? (
              <TypeBadge type={t} active />
            ) : (
              <span className={s.badgeMissing}>—</span>
            )}
          </div>
        ))}
      </div>

      {open && (
        <div className={s.details}>
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

          {hasAnyExtras && (
            <div className={s.fileBlock}>
              <button
                type="button"
                className={s.extrasToggle}
                onClick={(event) => {
                  event.stopPropagation();
                  setExtrasOpen((v) => !v);
                }}
                aria-expanded={extrasOpen}
              >
                <span>Дополнительные разрешительные документы</span>
                <ChatChevronDownIcon className={`${s.chevron} ${extrasOpen ? s.chevronOpen : ""}`.trim()} />
              </button>

              {extrasOpen && (
                <div className={s.extrasBody}>
                  {(item.mining_license_number || miningItems.length > 0) && (
                    <div className={s.extrasItem}>
                      {item.mining_license_number && (
                        <Field label="Лицензия на маркшейдерские работы №:">
                          <span className={s.value}>{item.mining_license_number}</span>
                        </Field>
                      )}
                      {miningItems.length > 0 && (
                        <FileGallery
                          items={miningItems}
                          label="Файл лицензии:"
                          labelClassName={s.label}
                          blockClassName={s.fileBlock}
                          gridProps={{ className: s.fileGrid }}
                          hideWhenEmpty
                        />
                      )}
                    </div>
                  )}

                  {(item.sro_design_number || sroItems.length > 0) && (
                    <div className={s.extrasItem}>
                      {item.sro_design_number && (
                        <Field label="Выписка СРО проектирования, ОГРН:">
                          <span className={s.value}>{item.sro_design_number}</span>
                        </Field>
                      )}
                      {sroItems.length > 0 && (
                        <FileGallery
                          items={sroItems}
                          label="Файл выписки:"
                          labelClassName={s.label}
                          blockClassName={s.fileBlock}
                          gridProps={{ className: s.fileGrid }}
                          hideWhenEmpty
                        />
                      )}
                    </div>
                  )}

                  {(item.lab_accreditation_number || labItems.length > 0) && (
                    <div className={s.extrasItem}>
                      {item.lab_accreditation_number && (
                        <Field label="Свидетельство об аккредитации лаборатории №:">
                          <span className={s.value}>{item.lab_accreditation_number}</span>
                        </Field>
                      )}
                      {labItems.length > 0 && (
                        <FileGallery
                          items={labItems}
                          label="Файл свидетельства:"
                          labelClassName={s.label}
                          blockClassName={s.fileBlock}
                          gridProps={{ className: s.fileGrid }}
                          hideWhenEmpty
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
