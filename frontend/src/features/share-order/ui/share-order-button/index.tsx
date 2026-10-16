"use client";

import type { MouseEvent } from "react";
import { Button } from "@/shared/ui/button";
import { useShareOrder } from "../../model/use-share-order";
import styles from "./style.module.scss";

/** Публичный идентификатор заказа для отправки ссылки. */
interface ShareOrderButtonProps {
  publicId: string;
}

/** Копирует ссылку, не открывая карточку под кнопкой. */
export function ShareOrderButton({ publicId }: ShareOrderButtonProps) {
  const shareOrder = useShareOrder();

  /** Останавливает нажатие карточки перед копированием ссылки. */
  function share(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    void shareOrder(publicId);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={styles.button}
      onClick={share}
    >
      Поделиться
    </Button>
  );
}
