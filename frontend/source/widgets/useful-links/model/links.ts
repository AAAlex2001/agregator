import type { ComponentType } from "react";
import { CheckIcon } from "@/source/shared/ui/icons";

export interface UsefulLink {
  href: string;
  label: string;
  description: string;
  Icon: ComponentType<{ className?: string; color?: string }>;
}

export function getUsefulLinks(role: string | null): UsefulLink[] {
  const links: UsefulLink[] = [];

  if (role === "CUSTOMER") {
    links.push({
      href: "https://www.gosnadzor.ru/service/list/certification%20experts/index.php",
      label: "Проверка подлинности аттестаций эксперта",
      description: "Реестр аттестованных экспертов Ростехнадзора",
      Icon: CheckIcon,
    });
    links.push({
      href: "https://экг-рейтинг.рф",
      label: "Проверка рейтинга экспертной организации",
      description: "Национальный ЭКГ-рейтинг организаций",
      Icon: CheckIcon,
    });
  }

  return links;
}
