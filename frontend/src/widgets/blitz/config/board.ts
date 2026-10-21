import type { BlitzStatus } from "@/entities/blitz-order";

/** Вкладка списка заявок. */
export type BoardTab = "active" | "finished" | "incoming" | "assigned";

/** Вкладка и её подпись. */
export interface BoardTabItem {
  id: BoardTab;
  label: string;
}

/** Вкладки заказчика. */
export const CUSTOMER_TABS: BoardTabItem[] = [
  { id: "active", label: "В работе" },
  { id: "finished", label: "Завершённые" },
];

/** Вкладки эксперта. */
export const EXPERT_TABS: BoardTabItem[] = [
  { id: "incoming", label: "Новые заявки" },
  { id: "assigned", label: "Мои заявки" },
];

/** Статусы, после которых заявка уходит в «Завершённые». */
export const FINISHED_STATUSES: BlitzStatus[] = ["accepted", "canceled"];

/** Тексты пустых вкладок. */
export const EMPTY_TEXTS = {
  active: {
    title: "Активных заявок нет",
    subtitle: "Подайте заявку на экспертизу или аудит СУПБ: исполнители получат её сразу",
  },
  finished: {
    title: "Завершённых заявок пока нет",
    subtitle: "Здесь будут принятые и отменённые заявки",
  },
  incoming: {
    title: "Новых заявок для вас нет",
    subtitle: "Экспертизы подбираются по удостоверениям в настройках, аудиты получают "
      + "руководители аудиторских групп",
  },
  assigned: {
    title: "Вы ещё не взяли ни одной заявки",
    subtitle: "Новые заявки — во вкладке «Новые заявки»",
  },
};
