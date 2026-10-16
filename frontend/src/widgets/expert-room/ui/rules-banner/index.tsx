"use client";

import cn from "classnames";
import { useState } from "react";
import { ChatChevronDownIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Ключ, под которым браузер помнит свёрнутые правила. */
const STORAGE_KEY = "expert-room:rules-collapsed";

/** Правила общения в чате исполнителей. */
const RULES = [
  "Без оскорблений и нецензурной лексики — за это бан без предупреждения.",
  "Не флудить и не спамить (в том числе рекламой и обходом сделки мимо платформы).",
  "Не публиковать персональные данные третьих лиц.",
  "Уважать собеседников и держать профессиональный тон.",
  "За нарушение администратор может заблокировать вас в чате.",
];

/** Читает сохранённый выбор; без доступа к хранилищу правила остаются раскрытыми. */
function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Правила чата; свёрнутое состояние сохраняется в браузере между визитами. */
export function RulesBanner() {
  const [isCollapsed, setCollapsed] = useState(readCollapsed);

  /** Сворачивает или раскрывает правила и запоминает выбор. */
  function toggle() {
    const nextCollapsed = !isCollapsed;

    setCollapsed(nextCollapsed);
    window.localStorage.setItem(STORAGE_KEY, nextCollapsed ? "1" : "0");
  }

  return (
    <div className={styles.banner}>
      <button
        type="button"
        className={styles.titleRow}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Развернуть правила" : "Свернуть правила"}
        onClick={toggle}
      >
        <p className={styles.title}>Чат исполнителей · правила</p>
        <ChatChevronDownIcon
          className={cn(styles.chevron, {
            [styles.chevronOpen]: !isCollapsed,
          })}
        />
      </button>

      {!isCollapsed && (
        <ul className={styles.list}>
          {RULES.map((rule) => (
            <li
              key={rule}
              className={styles.item}
            >
              {rule}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
