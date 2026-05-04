import type {
  ChatMessageNotificationPayload,
  NotificationCardModel,
  NotificationItem,
  QuestionAnsweredNotificationPayload,
  QuestionAskedNotificationPayload,
  ResponseStatusChangedNotificationPayload,
  ResponseUpdatedNotificationPayload,
} from "@/source/entities/notification";

function getOrderTitle(orderTitle: string | undefined): string {
  return orderTitle || "без названия";
}

function mapResponseUpdated(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as ResponseUpdatedNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const kind = payload.kind ?? "UPDATED";

  if (kind === "CREATED") {
    return {
      id: item.id,
      title: "Новый отклик на заказ",
      message: `Эксперт откликнулся на заказ «${orderTitle}».`,
      actionLabel: item.action_url ? "Открыть отклики" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  if (kind === "WITHDRAWN") {
    return {
      id: item.id,
      title: "Эксперт отозвал отклик",
      message: `Эксперт отозвал отклик по заказу «${orderTitle}».`,
      actionLabel: item.action_url ? "Открыть отклики" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  return {
    id: item.id,
    title: "Эксперт обновил предложение",
    message: `Эксперт обновил отклик по заказу «${orderTitle}». Проверьте новые условия, сроки и файлы.`,
    actionLabel: item.action_url ? "Открыть отклики" : null,
    actionUrl: item.action_url,
    isRead: item.is_read,
    createdAt: item.created_at,
  };
}

function mapResponseStatusChanged(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as ResponseStatusChangedNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const actorRole = payload.actor_role;
  const statusTo = payload.status_to;
  const reason = payload.reason;

  if (actorRole === "CUSTOMER" && statusTo === "REVIEW" && reason === "SELECTED_ANOTHER_REVERTED") {
    return {
      id: item.id,
      title: "Ваш отклик снова на рассмотрении",
      message: `Заказчик отклонил ранее выбранного исполнителя по заказу «${orderTitle}». Ваш отклик снова участвует в рассмотрении.`,
      actionLabel: item.action_url ? "Открыть отклики" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  if (actorRole === "CUSTOMER" && statusTo === "ACCEPTED") {
    return {
      id: item.id,
      title: "Заказчик пригласил вас в чат",
      message: `По заказу «${orderTitle}» заказчик открыл чат для обсуждения условий.`,
      actionLabel: item.action_url ? "Открыть чат" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  if (actorRole === "CUSTOMER" && statusTo === "IN_PROGRESS") {
    return {
      id: item.id,
      title: "Вас выбрали исполнителем",
      message: `Заказчик выбрал вас исполнителем по заказу «${orderTitle}».`,
      actionLabel: item.action_url ? "Открыть чат" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  if (actorRole === "CUSTOMER" && statusTo === "REJECTED" && reason === "SELECTED_ANOTHER") {
    return {
      id: item.id,
      title: "Отклик отклонён",
      message: `По заказу «${orderTitle}» выбран другой исполнитель.`,
      actionLabel: item.action_url ? "Открыть отклики" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  if (actorRole === "CUSTOMER" && statusTo === "REJECTED") {
    return {
      id: item.id,
      title: "Отклик отклонён",
      message: `Заказчик отклонил ваш отклик по заказу «${orderTitle}».`,
      actionLabel: item.action_url ? "Открыть отклики" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  if (actorRole === "CUSTOMER" && statusTo === "COMPLETED") {
    return {
      id: item.id,
      title: "Заказчик завершил проект",
      message: `Заказчик отметил проект по заказу «${orderTitle}» как завершённый.`,
      actionLabel: item.action_url ? "Открыть отклики" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  if (actorRole === "EXPERT" && statusTo === "IN_PROGRESS") {
    return {
      id: item.id,
      title: "Эксперт принял проект",
      message: `Эксперт подтвердил начало работ по заказу «${orderTitle}».`,
      actionLabel: item.action_url ? "Открыть чат" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  if (actorRole === "EXPERT" && statusTo === "COMPLETED") {
    return {
      id: item.id,
      title: "Эксперт завершил проект",
      message: `Эксперт отметил проект по заказу «${orderTitle}» как завершённый.`,
      actionLabel: item.action_url ? "Открыть отклики" : null,
      actionUrl: item.action_url,
      isRead: item.is_read,
      createdAt: item.created_at,
    };
  }

  return {
    id: item.id,
    title: "Изменился статус отклика",
    message: `По заказу «${orderTitle}» обновился статус отклика.`,
    actionLabel: item.action_url ? "Открыть отклики" : null,
    actionUrl: item.action_url,
    isRead: item.is_read,
    createdAt: item.created_at,
  };
}

function mapChatMessage(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as ChatMessageNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const senderTitle = payload.sender_role === "CUSTOMER" ? "заказчика" : "эксперта";
  const preview = payload.preview || "Новое сообщение";

  return {
    id: item.id,
    title: `Новое сообщение от ${senderTitle}`,
    message: `По заказу «${orderTitle}»: ${preview}`,
    actionLabel: item.action_url ? "Открыть чат" : null,
    actionUrl: item.action_url,
    isRead: item.is_read,
    createdAt: item.created_at,
  };
}

function mapQuestionAsked(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as QuestionAskedNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const expertName = payload.expert_name || "Эксперт";
  const preview = payload.preview || "Новый вопрос";

  return {
    id: item.id,
    title: "Новый вопрос по заказу",
    message: `${expertName} спрашивает по «${orderTitle}»: ${preview}`,
    actionLabel: item.action_url ? "Перейти к заказу" : null,
    actionUrl: item.action_url,
    isRead: item.is_read,
    createdAt: item.created_at,
  };
}

function mapQuestionAnswered(item: NotificationItem): NotificationCardModel {
  const payload = item.payload as QuestionAnsweredNotificationPayload;
  const orderTitle = getOrderTitle(payload.order_title);
  const preview = payload.preview || "Ответ заказчика";

  return {
    id: item.id,
    title: "Заказчик ответил на ваш вопрос",
    message: `По заказу «${orderTitle}»: ${preview}`,
    actionLabel: item.action_url ? "Перейти к заказу" : null,
    actionUrl: item.action_url,
    isRead: item.is_read,
    createdAt: item.created_at,
  };
}

export function mapNotificationCard(item: NotificationItem): NotificationCardModel {
  if (item.type === "RESPONSE_UPDATED") {
    return mapResponseUpdated(item);
  }

  if (item.type === "RESPONSE_STATUS_CHANGED") {
    return mapResponseStatusChanged(item);
  }

  if (item.type === "CHAT_MESSAGE") {
    return mapChatMessage(item);
  }

  if (item.type === "QUESTION_ASKED") {
    return mapQuestionAsked(item);
  }

  if (item.type === "QUESTION_ANSWERED") {
    return mapQuestionAnswered(item);
  }

  return {
    id: item.id,
    title: "Новое уведомление",
    message: "Откройте уведомление, чтобы посмотреть детали.",
    actionLabel: item.action_url ? "Открыть" : null,
    actionUrl: item.action_url,
    isRead: item.is_read,
    createdAt: item.created_at,
  };
}