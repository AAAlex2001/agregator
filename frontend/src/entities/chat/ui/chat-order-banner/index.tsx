"use client";

import cn from "classnames";
import Link from "next/link";
import { useState } from "react";
import { ChatChevronDownIcon } from "@/shared/ui/icons";
import type { ChatDetailData } from "../../model/types";
import styles from "./style.module.scss";

/** Переписка, о заказе которой рассказывает плашка. */
interface ChatOrderBannerProps {
  chat: ChatDetailData;
}

/** Название заказа над перепиской; по нажатию раскрывает заказчика, сумму и требования. */
export function ChatOrderBanner({ chat }: ChatOrderBannerProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Раскрывает или сворачивает подробности заказа. */
  function toggleDetails() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.banner}>
      <button
        type="button"
        className={styles.titleRow}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Свернуть" : "Развернуть"}
        onClick={toggleDetails}
      >
        <p className={styles.title}>{chat.order_title}</p>
        <ChatChevronDownIcon className={cn(styles.chevron, { [styles.chevronOpen]: isOpen })} />
      </button>

      {isOpen && (
        <div className={styles.details}>
          <p className={styles.customer}>{chat.order_company}</p>
          <div className={styles.meta}>
            <span className={styles.date}>{chat.order_date}</span>
            <span className={styles.sum}>{chat.order_sum}</span>
          </div>
          {chat.order_badges.length > 0 && (
            <div className={styles.requirements}>
              <span className={styles.requirementsLabel}>Требования к исполнителю:</span>
              <div className={styles.badges}>
                {chat.order_badges.map((badge) => (
                  <span
                    key={badge.text}
                    className={styles.badge}
                    data-variant={badge.variant}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>
          )}
          {chat.response_status && (
            <p className={styles.orderLinkRow}>
              Ссылка на заказ:{" "}
              <Link
                href={`/responses?tab=${chat.response_status.toLowerCase()}`}
                className={styles.orderLink}
              >
                открыть
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
