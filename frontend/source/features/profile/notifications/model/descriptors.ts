import type { NotificationPreferenceDescriptor } from "./types";

// Описатели всех типов уведомлений. Фильтруются по роли пользователя в UI.
export const NOTIFICATION_DESCRIPTORS: ReadonlyArray<NotificationPreferenceDescriptor> = [
  {
    key: "email_on_response_created",
    label: "Новый отклик на заявку",
    description: "Когда эксперт откликается на вашу заявку.",
    roles: ["CUSTOMER"],
  },
  {
    key: "email_on_response_updated",
    label: "Изменения отклика",
    description: "Эксперт обновил стоимость, комментарий или файлы своего отклика.",
    roles: ["CUSTOMER"],
  },
  {
    key: "email_on_expert_rejected",
    label: "Эксперт отказался",
    description: "Ранее выбранный исполнитель отказался от выполнения.",
    roles: ["CUSTOMER"],
  },
  {
    key: "email_on_new_order",
    label: "Новые заявки",
    description: "Письмо о каждой новой заявке на платформе.",
    roles: ["EXPERT"],
  },
  {
    key: "email_on_order_updated",
    label: "Изменения заявок",
    description: "Заказчик меняет условия заявки, на которую вы откликнулись.",
    roles: ["EXPERT"],
  },
  {
    key: "email_on_bidding_finished",
    label: "Итоги торгов",
    description: "Вас выбрали исполнителем — или заказчик выбрал другого.",
    roles: ["EXPERT"],
  },
  {
    key: "email_on_chat_message",
    label: "Сообщения в чате",
    description: "Приходит только если вы оффлайн и не видите сообщение в реалтайме.",
    roles: ["CUSTOMER", "EXPERT"],
  },
];
