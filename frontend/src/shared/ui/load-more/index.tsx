"use client";

import type { MouseEvent } from "react";
import { Loader } from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Адрес следующей страницы для поисковиков, состояние загрузки и догрузка для людей. */
interface LoadMoreProps {
  href?: string;
  isLoading: boolean;
  onLoadMore: () => void;
}

/**
 * «Загрузить ещё» на всю ширину. С адресом — настоящая ссылка на следующую страницу,
 * по которой обходят поисковики; клик догружает список без перехода.
 */
export function LoadMore({ href, isLoading, onLoadMore }: LoadMoreProps) {
  const content = isLoading ? (
    <Loader
      size="sm"
      label=""
    />
  ) : "Загрузить ещё";

  /** Догружает список на месте вместо перехода по ссылке. */
  function loadInPlace(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (!isLoading) {
      onLoadMore();
    }
  }

  if (href) {
    return (
      <a
        className={styles.button}
        href={href}
        aria-busy={isLoading}
        onClick={loadInPlace}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={styles.button}
      disabled={isLoading}
      aria-busy={isLoading}
      onClick={onLoadMore}
    >
      {content}
    </button>
  );
}