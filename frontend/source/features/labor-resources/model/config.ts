import type { LaborPageCopy, LaborPageMode } from "./types";

export const LABOR_PAGE_COPY: Record<LaborPageMode, LaborPageCopy> = {
  license: {
    title: "Поиск исполнителя в штат",
    subtitle:
      "Найдите исполнителя для постоянной работы, получения лицензии или проверки лицензионных требований",
    browseTab: "Организации ищут исполнителей",
    ownKind: "EXPERT_WANTED",
    browseKind: "EXPERT_WANTED",
    formTitle: "Создать заявку на поиск исполнителя",
  },
  expert: {
    title: "Готов к трудовому договору",
    subtitle:
      "Сообщите экспертным организациям, что готовы рассмотреть трудоустройство",
    browseTab: "Исполнители готовы к трудоустройству",
    ownKind: "EXPERT_AVAILABLE",
    browseKind: "EXPERT_AVAILABLE",
    formTitle: "Опубликовать готовность к трудоустройству",
  },
};
