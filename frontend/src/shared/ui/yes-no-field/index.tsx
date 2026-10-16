"use client";

import { Tabs } from "@/shared/ui/tabs";

/** Ответ на вопрос; null означает, что пользователь ещё не сделал выбор. */
interface YesNoFieldProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

/** Варианты ответа в порядке показа. */
const YES_NO_OPTIONS = [
  { id: "yes", label: "Да" },
  { id: "no", label: "Нет" },
];

/** Выбор «Да» или «Нет» с возможностью оставить ответ невыбранным. */
export function YesNoField({ value, onChange }: YesNoFieldProps) {
  const selectedValue = value === null ? "" : value ? "yes" : "no";

  return (
    <Tabs
      tabs={YES_NO_OPTIONS}
      activeTab={selectedValue}
      onTabChange={(selected) => {
        onChange(selected === "yes");
      }}
    />
  );
}
