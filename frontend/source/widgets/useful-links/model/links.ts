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

  if (role === "EXPERT") {
    links.push({
      href: "https://all-pribors.ru/grsilist",
      label: "Реестр средств измерений",
      description: "Госреестр СИ — проверка типа средства измерения",
      Icon: CheckIcon,
    });
    links.push({
      href: "https://grmetr.ru/arshin",
      label: "Результаты поверок средств измерений",
      description: "ФГИС «Аршин» — статус поверки приборов",
      Icon: CheckIcon,
    });
    links.push({
      href: "https://proverki.gov.ru/portal",
      label: "Доступ к проверкам прокуратуры",
      description: "Единый реестр контрольных (надзорных) мероприятий",
      Icon: CheckIcon,
    });
  }

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
    links.push({
      href: "https://pb.nalog.ru/search.html#search-ul",
      label: "Проверка численности штата организации",
      description: "Прозрачный бизнес ФНС — сведения о компании",
      Icon: CheckIcon,
    });
  }

  return links;
}
