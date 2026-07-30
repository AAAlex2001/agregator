import type { NotificationPreferenceDescriptor } from "./types";

// Описатели всех типов уведомлений. Фильтруются по роли пользователя в UI.
export const NOTIFICATION_DESCRIPTORS: ReadonlyArray<NotificationPreferenceDescriptor> = [
  {
    key: "email_on_labor_listing",
    label: "Новые заявки в трудовых ресурсах",
    description:
      "Новые объявления о поиске исполнителей и готовности к трудоустройству.",
    roles: ["CUSTOMER", "EXPERT"],
  },
  {
    key: "email_on_response_created",
    label: "Новый отклик на заявку",
    description: "Когда исполнитель откликается на вашу заявку.",
    roles: ["CUSTOMER"],
  },
  {
    key: "email_on_response_updated",
    label: "Изменения отклика",
    description: "Исполнитель обновил стоимость, комментарий или файлы своего отклика.",
    roles: ["CUSTOMER"],
  },
  {
    key: "email_on_expert_rejected",
    label: "Исполнитель отказался",
    description: "Ранее выбранный исполнитель отказался от выполнения.",
    roles: ["CUSTOMER"],
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
  {
    key: "email_on_question_asked",
    label: "Новый вопрос по заказу",
    description: "Исполнитель задал публичный вопрос по вашей заявке — ответ увидят все исполнители.",
    roles: ["CUSTOMER"],
  },
  {
    key: "email_on_question_answered",
    label: "Ответ на ваш вопрос",
    description: "Заказчик ответил на ваш публичный вопрос по заявке.",
    roles: ["EXPERT"],
  },
  {
    key: "email_on_new_blog_post",
    label: "Новые статьи блога",
    description: "Письмо с превью при публикации новой статьи на платформе.",
    roles: ["CUSTOMER", "EXPERT"],
  },
];
