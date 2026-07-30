"use client";

import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import { useRulesCollapse } from "../model/useRulesCollapse";
import s from "./RulesBanner.module.scss";

const TITLE = "Чат исполнителей · правила";

const RULES = [
  "Без оскорблений и нецензурной лексики — за это бан без предупреждения.",
  "Не флудить и не спамить (в том числе рекламой и обходом сделки мимо платформы).",
  "Не публиковать персональные данные третьих лиц.",
  "Уважать собеседников и держать профессиональный тон.",
  "За нарушение администратор может заблокировать вас в чате.",
];

export function RulesBanner() {
  const { collapsed, hydrated, toggle } = useRulesCollapse();

  if (!hydrated) {
    return null;
  }

  const open = !collapsed;

  return (
    <div className={s.banner}>
      <button
        type="button"
        className={s.titleRow}
        aria-expanded={open}
        aria-label={open ? "Свернуть правила" : "Развернуть правила"}
        onClick={toggle}
      >
        <p className={s.title}>{TITLE}</p>
        <ChatChevronDownIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`.trim()} />
      </button>

      {open ? (
        <ul className={s.list}>
          {RULES.map((rule) => (
            <li key={rule} className={s.item}>{rule}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
