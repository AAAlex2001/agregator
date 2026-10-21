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

/** Вкладки исполнителя. */
export const EXPERT_TABS: BoardTabItem[] = [
  { id: "incoming", label: "Новые заявки" },
  { id: "assigned", label: "Мои заявки" },
];

/** Статусы, после которых заявка уходит в «Завершённые». */
export const FINISHED_STATUSES: BlitzStatus[] = ["accepted", "canceled"];

/** Заголовок, кнопка новой заявки и тексты пустых вкладок каждого сервиса. */
export const BOARD_TEXTS = {
  expertise: {
    title: "Блиц-эксперт",
    subtitle: "Экспертиза промышленной безопасности: договор, оплата и заключение в одном окне",
    createHref: "/blitz/new",
    createLabel: "Новая заявка",
    empty: {
      active: {
        title: "Активных заявок нет",
        subtitle: "Подайте заявку: эксперты с подходящими удостоверениями получат её сразу",
      },
      finished: {
        title: "Завершённых заявок пока нет",
        subtitle: "Здесь будут принятые и отменённые заявки",
      },
      incoming: {
        title: "Новых заявок под ваши удостоверения нет",
        subtitle: "Проверьте удостоверения в настройках: по ним подбираются заявки",
      },
      assigned: {
        title: "Вы ещё не взяли ни одной заявки",
        subtitle: "Новые заявки — во вкладке «Новые заявки»",
      },
    },
  },
  audit: {
    title: "Блиц-аудит",
    subtitle: "Аудит системы управления промышленной безопасностью: торг, План, проверка "
      + "документов и отчёт в одном окне",
    createHref: "/blitz-audit/new",
    createLabel: "Новый аудит",
    empty: {
      active: {
        title: "Активных заявок на аудит нет",
        subtitle: "Подайте заявку: руководители аудиторских групп получат её сразу",
      },
      finished: {
        title: "Завершённых аудитов пока нет",
        subtitle: "Здесь будут принятые и отменённые заявки",
      },
      incoming: {
        title: "Новых заявок на аудит нет",
        subtitle: "Заявки получают руководители аудиторских групп — их назначает администратор",
      },
      assigned: {
        title: "У вас пока нет аудитов",
        subtitle: "Здесь будут аудиты, которые вы ведёте, и те, где вы в группе",
      },
    },
  },
};
