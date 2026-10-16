"use client";

import cn from "classnames";
import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { ChatChevronDownIcon } from "@/shared/ui/icons";
import { getLicenseHolderName } from "../../model/card-content";
import type { LicenseHolderListItem } from "../../model/types";
import { AdditionalLicenseDocuments } from "../additional-license-documents";
import { LicenseAreas } from "../license-areas";
import { LicenseHolderDetails } from "../license-holder-details";
import styles from "./style.module.scss";

/** Компания из каталога держателей разрешительных документов. */
interface LicenseHolderCardProps {
  item: LicenseHolderListItem;
}

/** Показывает компанию и раскрывает её контакты, условия и документы. */
export function LicenseHolderCard({ item }: LicenseHolderCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [areDocumentsOpen, setAreDocumentsOpen] = useState(false);
  const companyName = getLicenseHolderName(item);

  /** Меняет раскрытие карточки при нажатии вне её ссылок и кнопок. */
  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a, button")) {
      return;
    }

    setIsOpen((value) => !value);
  }

  /** Поддерживает раскрытие карточки клавишами Enter и пробел. */
  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    if ((event.target as HTMLElement).closest("a, button")) {
      return;
    }

    event.preventDefault();
    setIsOpen((value) => !value);
  }

  /** Сохраняет состояние дополнительных документов при сворачивании карточки. */
  function toggleDocuments() {
    setAreDocumentsOpen((value) => !value);
  }

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className={styles.header}>
        <h3
          className={styles.company}
          title={companyName}
        >
          {companyName}
        </h3>
        <ChatChevronDownIcon
          className={cn(styles.chevron, {
            [styles.chevronOpen]: isOpen,
          })}
        />
      </div>
      <LicenseAreas areas={item.license_areas} />
      {isOpen && (
        <div className={styles.details}>
          <LicenseHolderDetails item={item} />
          <AdditionalLicenseDocuments
            item={item}
            isOpen={areDocumentsOpen}
            onToggle={toggleDocuments}
          />
        </div>
      )}
    </article>
  );
}
