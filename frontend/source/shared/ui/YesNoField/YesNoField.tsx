"use client";

import Tabs from "@/source/shared/ui/Tabs";

const YES_NO_TABS = [
  { id: "yes", label: "Да" },
  { id: "no", label: "Нет" },
];

interface Props {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export function YesNoField({ value, onChange }: Props) {
  const activeTab = value === null ? "" : value ? "yes" : "no";
  return (
    <Tabs
      tabs={YES_NO_TABS}
      activeTab={activeTab}
      onTabChange={(id) => onChange(id === "yes")}
      variant="squared"
    />
  );
}
