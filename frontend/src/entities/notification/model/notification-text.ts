import type {
  ChatMessagePayload,
  NewOrderPayload,
  NotificationItem,
  NotificationText,
  PostActivityPayload,
  ResponseStatusChangedPayload,
  ResponseUpdatedPayload,
  SupportReplyPayload,
} from "./types";

/** Отправитель сообщения в родительном падеже. */
const SENDERS = {
  CUSTOMER: "заказчика",
  EXPERT: "исполнителя",
  LICENSE_HOLDER: "держателя разрешительных документов",
};

/** Действия участника с публикацией для текста уведомления. */
const POST_ACTIONS = {
  like: "понравилась ваша публикация",
  comment: "прокомментировал(а) вашу публикацию",
  reply: "ответил(а) на ваш комментарий",
  repost: "поделился(-ась) вашей публикацией",
  follow: "подписался(-ась) на ваши публикации",
};

/** Подпись кнопки, ведущей к откликам. */
const OPEN_RESPONSES = "Открыть отклики";

/** Подпись кнопки, ведущей в чат. */
const OPEN_CHAT = "Открыть чат";

/** Объясняет новый, изменённый или отозванный отклик. */
function getResponseUpdatedText(payload: ResponseUpdatedPayload): NotificationText {
  const order = payload.order_title || "без названия";

  if (payload.kind === "CREATED") {
    return {
      title: "Новый отклик на заказ",
      message: `Исполнитель откликнулся на заказ «${order}».`,
      actionLabel: OPEN_RESPONSES,
    };
  }

  if (payload.kind === "WITHDRAWN") {
    return {
      title: "Исполнитель отозвал отклик",
      message: `Исполнитель отозвал отклик по заказу «${order}».`,
      actionLabel: OPEN_RESPONSES,
    };
  }

  return {
    title: "Исполнитель обновил предложение",
    message: `Исполнитель обновил отклик по заказу «${order}». `
      + "Проверьте новые условия, сроки и файлы.",
    actionLabel: OPEN_RESPONSES,
  };
}

/** Объясняет смену статуса отклика заказчиком. */
function getCustomerStatusText(payload: ResponseStatusChangedPayload): NotificationText {
  const order = payload.order_title || "без названия";
  const status = payload.status_to;

  if (status === "REVIEW" && payload.reason === "SELECTED_ANOTHER_REVERTED") {
    return {
      title: "Ваш отклик снова на рассмотрении",
      message: `Заказчик отклонил ранее выбранного исполнителя по заказу «${order}». `
        + "Ваш отклик снова участвует в рассмотрении.",
      actionLabel: OPEN_RESPONSES,
    };
  }

  if (status === "ACCEPTED") {
    return {
      title: "Заказчик пригласил вас в чат",
      message: `По заказу «${order}» заказчик открыл чат для обсуждения условий.`,
      actionLabel: OPEN_CHAT,
    };
  }

  if (status === "IN_PROGRESS") {
    return {
      title: "Вас выбрали исполнителем",
      message: `Заказчик выбрал вас исполнителем по заказу «${order}».`,
      actionLabel: OPEN_CHAT,
    };
  }

  if (status === "REJECTED" && payload.reason === "SELECTED_ANOTHER") {
    return {
      title: "Отклик отклонён",
      message: `По заказу «${order}» выбран другой исполнитель.`,
      actionLabel: OPEN_RESPONSES,
    };
  }

  if (status === "REJECTED") {
    const reason = payload.rejection_reason?.trim();
    const message = `Заказчик отклонил ваш отклик по заказу «${order}».`;

    return {
      title: "Отклик отклонён",
      message: reason ? `${message} Причина: ${reason}` : message,
      actionLabel: OPEN_RESPONSES,
    };
  }

  if (status === "COMPLETED") {
    return {
      title: "Заказчик завершил проект",
      message: `Заказчик отметил проект по заказу «${order}» как завершённый.`,
      actionLabel: OPEN_RESPONSES,
    };
  }

  return {
    title: "Изменился статус отклика",
    message: `По заказу «${order}» обновился статус отклика.`,
    actionLabel: OPEN_RESPONSES,
  };
}

/** Объясняет смену статуса отклика: решение заказчика или исполнителя. */
function getStatusChangedText(payload: ResponseStatusChangedPayload): NotificationText {
  const order = payload.order_title || "без названия";

  if (payload.actor_role === "CUSTOMER") {
    return getCustomerStatusText(payload);
  }

  if (payload.actor_role === "EXPERT" && payload.status_to === "IN_PROGRESS") {
    return {
      title: "Исполнитель принял проект",
      message: `Исполнитель подтвердил начало работ по заказу «${order}».`,
      actionLabel: OPEN_CHAT,
    };
  }

  if (payload.actor_role === "EXPERT" && payload.status_to === "COMPLETED") {
    return {
      title: "Исполнитель завершил проект",
      message: `Исполнитель отметил проект по заказу «${order}» как завершённый.`,
      actionLabel: OPEN_RESPONSES,
    };
  }

  return {
    title: "Изменился статус отклика",
    message: `По заказу «${order}» обновился статус отклика.`,
    actionLabel: OPEN_RESPONSES,
  };
}

/** Объясняет новое сообщение в чате заказа. */
function getChatMessageText(payload: ChatMessagePayload): NotificationText {
  const order = payload.order_title || "без названия";

  return {
    title: `Новое сообщение от ${SENDERS[payload.sender_role]}`,
    message: `По заказу «${order}»: ${payload.preview || "Новое сообщение"}`,
    actionLabel: OPEN_CHAT,
  };
}

/** Объясняет ответ поддержки с номером и темой обращения. */
function getSupportReplyText(payload: SupportReplyPayload): NotificationText {
  const ticket = payload.ticket_number ? `${payload.ticket_number} ` : "";
  const subject = payload.subject || "Обращение";
  const preview = payload.preview || "Новое сообщение от поддержки";

  return {
    title: "Поддержка ответила на ваше обращение",
    message: `${ticket}«${subject}»: ${preview}`,
    actionLabel: "Открыть обращение",
  };
}

/** Объясняет новую заявку: подборку для исполнителя или заявку по его типам. */
function getNewOrderText(payload: NewOrderPayload): NotificationText {
  const order = payload.order_title || "без названия";
  const badges = payload.badges.join(" · ");
  const badgesText = badges ? `: ${badges}` : "";

  if (payload.message) {
    return {
      title: `Вам может быть интересен этот заказ: ${order}`,
      message: payload.message,
      actionLabel: "Открыть заказы",
    };
  }

  return {
    title: "Новая заявка по вашим типам",
    message: `Опубликована заявка «${order}» по вашим типам${badgesText}.`,
    actionLabel: "Открыть заказы",
  };
}

/** Объясняет реакцию на публикацию или новую подписку. */
function getPostActivityText(payload: PostActivityPayload): NotificationText {
  const name = payload.actor_name || "Участник";
  const action = POST_ACTIONS[payload.kind];

  if (payload.kind === "follow") {
    return {
      title: "Новый подписчик",
      message: `${name} ${action}.`,
      actionLabel: "Публикации автора",
    };
  }

  return {
    title: "Активность в публикациях",
    message: payload.kind === "like" ? `${name}: ${action}.` : `${name} ${action}.`,
    actionLabel: "Открыть публикацию",
  };
}

/** Заголовок, текст и подпись кнопки карточки по типу уведомления. */
export function getNotificationText(item: NotificationItem): NotificationText {
  switch (item.type) {
    case "RESPONSE_UPDATED":
      return getResponseUpdatedText(item.payload);
    case "RESPONSE_STATUS_CHANGED":
      return getStatusChangedText(item.payload);
    case "CHAT_MESSAGE":
      return getChatMessageText(item.payload);
    case "QUESTION_ASKED":
      return {
        title: "Новый вопрос по заказу",
        message: `${item.payload.expert_name || "Исполнитель"} спрашивает по `
          + `«${item.payload.order_title || "без названия"}»: `
          + `${item.payload.preview || "Новый вопрос"}`,
        actionLabel: "Перейти к заказу",
      };
    case "QUESTION_ANSWERED":
      return {
        title: "Заказчик ответил на ваш вопрос",
        message: `По заказу «${item.payload.order_title || "без названия"}»: `
          + `${item.payload.preview || "Ответ заказчика"}`,
        actionLabel: "Перейти к заказу",
      };
    case "SUPPORT_REPLY":
      return getSupportReplyText(item.payload);
    case "NEW_BLOG_POST":
      return {
        title: "Новая статья в блоге",
        message: `«${item.payload.blog_title || "Новая статья"}»: `
          + `${item.payload.preview || "На платформе появилась новая публикация."}`,
        actionLabel: "Читать статью",
      };
    case "NEW_ORDER":
      return getNewOrderText(item.payload);
    case "CONTACT_ACCESS":
      return {
        title: item.payload.title,
        message: item.payload.message,
        actionLabel: "Открыть сделку",
      };
    case "LABOR_RESPONSE":
      return {
        title: "Новый отклик на вашу заявку",
        message: `${item.payload.responder_name} откликнулся на объявление `
          + `«${item.payload.listing_title}». `
          + "Откройте вкладку «Мои заявки», чтобы перейти в чат.",
        actionLabel: "Открыть мои заявки",
      };
    case "POST_ACTIVITY":
      return getPostActivityText(item.payload);
  }
}
