import type {
  ChatMessageNotificationPayload,
  ContactAccessNotificationPayload,
  LaborResponseNotificationPayload,
  NewBlogPostNotificationPayload,
  NewOrderNotificationPayload,
  NotificationCardModel,
  NotificationItem,
  QuestionAnsweredNotificationPayload,
  QuestionAskedNotificationPayload,
  ResponseStatusChangedNotificationPayload,
  ResponseUpdatedNotificationPayload,
  SupportReplyNotificationPayload,
} from "@/source/entities/notification";

function card(
  item: NotificationItem,
  title: string,
  message: string,
  actionLabel: string,
): NotificationCardModel {
  return {
    id: item.id,
    title,
    message,
    actionLabel: item.action_url ? actionLabel : null,
    actionUrl: item.action_url,
    isRead: item.is_read,
    createdAt: item.created_at,
  };
}

function getOrderTitle(orderTitle: string | undefined): string {
  return orderTitle || "без названия";
}

function mapResponseUpdated(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as ResponseUpdatedNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const kind = payload.kind ?? "UPDATED";

  if (kind === "CREATED") {
    return card(item, "Новый отклик на заказ", `Исполнитель откликнулся на заказ «${orderTitle}».`, "Открыть отклики");
  }
  if (kind === "WITHDRAWN") {
    return card(item, "Исполнитель отозвал отклик", `Исполнитель отозвал отклик по заказу «${orderTitle}».`, "Открыть отклики");
  }
  return card(
    item,
    "Исполнитель обновил предложение",
    `Исполнитель обновил отклик по заказу «${orderTitle}». Проверьте новые условия, сроки и файлы.`,
    "Открыть отклики",
  );
}

function mapResponseStatusChanged(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as ResponseStatusChangedNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const actorRole = payload.actor_role;
  const statusTo = payload.status_to;
  const reason = payload.reason;

  if (actorRole === "CUSTOMER" && statusTo === "REVIEW" && reason === "SELECTED_ANOTHER_REVERTED") {
    return card(
      item,
      "Ваш отклик снова на рассмотрении",
      `Заказчик отклонил ранее выбранного исполнителя по заказу «${orderTitle}». Ваш отклик снова участвует в рассмотрении.`,
      "Открыть отклики",
    );
  }
  if (actorRole === "CUSTOMER" && statusTo === "ACCEPTED") {
    return card(item, "Заказчик пригласил вас в чат", `По заказу «${orderTitle}» заказчик открыл чат для обсуждения условий.`, "Открыть чат");
  }
  if (actorRole === "CUSTOMER" && statusTo === "IN_PROGRESS") {
    return card(item, "Вас выбрали исполнителем", `Заказчик выбрал вас исполнителем по заказу «${orderTitle}».`, "Открыть чат");
  }
  if (actorRole === "CUSTOMER" && statusTo === "REJECTED" && reason === "SELECTED_ANOTHER") {
    return card(item, "Отклик отклонён", `По заказу «${orderTitle}» выбран другой исполнитель.`, "Открыть отклики");
  }
  if (actorRole === "CUSTOMER" && statusTo === "REJECTED") {
    const rejectionReason = payload.rejection_reason?.trim();
    const baseMessage = `Заказчик отклонил ваш отклик по заказу «${orderTitle}».`;
    return card(
      item,
      "Отклик отклонён",
      rejectionReason ? `${baseMessage} Причина: ${rejectionReason}` : baseMessage,
      "Открыть отклики",
    );
  }
  if (actorRole === "CUSTOMER" && statusTo === "COMPLETED") {
    return card(item, "Заказчик завершил проект", `Заказчик отметил проект по заказу «${orderTitle}» как завершённый.`, "Открыть отклики");
  }
  if (actorRole === "EXPERT" && statusTo === "IN_PROGRESS") {
    return card(item, "Исполнитель принял проект", `Исполнитель подтвердил начало работ по заказу «${orderTitle}».`, "Открыть чат");
  }
  if (actorRole === "EXPERT" && statusTo === "COMPLETED") {
    return card(item, "Исполнитель завершил проект", `Исполнитель отметил проект по заказу «${orderTitle}» как завершённый.`, "Открыть отклики");
  }
  return card(item, "Изменился статус отклика", `По заказу «${orderTitle}» обновился статус отклика.`, "Открыть отклики");
}

function mapChatMessage(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as ChatMessageNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const senderTitle = {
    CUSTOMER: "заказчика",
    EXPERT: "исполнителя",
    LICENSE_HOLDER: "держателя разрешительных документов",
  }[payload.sender_role];
  const preview = payload.preview || "Новое сообщение";

  return card(item, `Новое сообщение от ${senderTitle}`, `По заказу «${orderTitle}»: ${preview}`, "Открыть чат");
}

function mapQuestionAsked(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as QuestionAskedNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const expertName = payload.expert_name || "Исполнитель";
  const preview = payload.preview || "Новый вопрос";

  return card(item, "Новый вопрос по заказу", `${expertName} спрашивает по «${orderTitle}»: ${preview}`, "Перейти к заказу");
}

function mapQuestionAnswered(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as QuestionAnsweredNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const preview = payload.preview || "Ответ заказчика";

  return card(item, "Заказчик ответил на ваш вопрос", `По заказу «${orderTitle}»: ${preview}`, "Перейти к заказу");
}

function mapNewBlogPost(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as NewBlogPostNotificationPayload;
  const title = payload.blog_title || "Новая статья";
  const preview = payload.preview || "На платформе появилась новая публикация.";

  return card(item, "Новая статья в блоге", `«${title}»: ${preview}`, "Читать статью");
}

function mapNewOrder(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as NewOrderNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const badges = (payload.badges ?? []).join(" · ");
  const message = payload.message || (badges
    ? `Опубликована заявка «${orderTitle}» по вашим типам: ${badges}.`
    : `Опубликована заявка «${orderTitle}» по вашим типам.`);
  const title = payload.message
    ? `Вам может быть интересен этот заказ: ${orderTitle}`
    : "Новая заявка по вашим типам";

  return card(item, title, message, "Открыть заказы");
}

function mapContactAccess(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as ContactAccessNotificationPayload;
  return card(item, payload.title, payload.message, "Открыть сделку");
}

function mapLaborResponse(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as LaborResponseNotificationPayload;
  return card(
    item,
    "Новый отклик на вашу заявку",
    `${payload.responder_name} откликнулся на объявление «${payload.listing_title}». Откройте вкладку «Мои заявки», чтобы перейти в чат.`,
    "Открыть мои заявки",
  );
}

function mapSupportReply(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as SupportReplyNotificationPayload;
  const subject = payload.subject || "Обращение";
  const preview = payload.preview || "Новое сообщение от поддержки";
  const ticketNumber = payload.ticket_number ? `${payload.ticket_number} ` : "";

  return card(item, "Поддержка ответила на ваше обращение", `${ticketNumber}«${subject}»: ${preview}`, "Открыть обращение");
}

const MAPPERS: Record<string, (item: NotificationItem) => NotificationCardModel> = {
  RESPONSE_UPDATED: mapResponseUpdated,
  RESPONSE_STATUS_CHANGED: mapResponseStatusChanged,
  CHAT_MESSAGE: mapChatMessage,
  QUESTION_ASKED: mapQuestionAsked,
  QUESTION_ANSWERED: mapQuestionAnswered,
  SUPPORT_REPLY: mapSupportReply,
  NEW_BLOG_POST: mapNewBlogPost,
  NEW_ORDER: mapNewOrder,
  CONTACT_ACCESS: mapContactAccess,
  LABOR_RESPONSE: mapLaborResponse,
};

export function mapNotificationCard(item: NotificationItem): NotificationCardModel {
  const mapper = MAPPERS[item.type];
  if (mapper) return mapper(item);
  return card(item, "Новое уведомление", "Откройте уведомление, чтобы посмотреть детали.", "Открыть");
}
