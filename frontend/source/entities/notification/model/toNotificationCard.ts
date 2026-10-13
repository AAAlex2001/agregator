import type {
  ChatMessagePayload,
  ContactAccessPayload,
  LaborResponsePayload,
  NewBlogPostPayload,
  NewOrderPayload,
  NotificationItem,
  PostActivityPayload,
  QuestionAnsweredPayload,
  QuestionAskedPayload,
  ResponseStatusChangedPayload,
  ResponseUpdatedPayload,
  SupportReplyPayload,
} from "./types";

export interface NotificationCardText {
  title: string;
  message: string;
  actionLabel: string;
}

const SENDER: Record<ChatMessagePayload["sender_role"], string> = {
  CUSTOMER: "заказчика",
  EXPERT: "исполнителя",
  LICENSE_HOLDER: "держателя разрешительных документов",
};

const orderTitle = (title: string | undefined) => title || "без названия";

function responseUpdated(payload: ResponseUpdatedPayload): NotificationCardText {
  const order = orderTitle(payload.order_title);
  if (payload.kind === "CREATED") {
    return { title: "Новый отклик на заказ", message: `Исполнитель откликнулся на заказ «${order}».`, actionLabel: "Открыть отклики" };
  }
  if (payload.kind === "WITHDRAWN") {
    return { title: "Исполнитель отозвал отклик", message: `Исполнитель отозвал отклик по заказу «${order}».`, actionLabel: "Открыть отклики" };
  }
  return {
    title: "Исполнитель обновил предложение",
    message: `Исполнитель обновил отклик по заказу «${order}». Проверьте новые условия, сроки и файлы.`,
    actionLabel: "Открыть отклики",
  };
}

function responseStatusChanged(payload: ResponseStatusChangedPayload): NotificationCardText {
  const order = orderTitle(payload.order_title);
  const { actor_role: actor, status_to: status, reason } = payload;

  if (actor === "CUSTOMER" && status === "REVIEW" && reason === "SELECTED_ANOTHER_REVERTED") {
    return {
      title: "Ваш отклик снова на рассмотрении",
      message: `Заказчик отклонил ранее выбранного исполнителя по заказу «${order}». Ваш отклик снова участвует в рассмотрении.`,
      actionLabel: "Открыть отклики",
    };
  }
  if (actor === "CUSTOMER" && status === "ACCEPTED") {
    return { title: "Заказчик пригласил вас в чат", message: `По заказу «${order}» заказчик открыл чат для обсуждения условий.`, actionLabel: "Открыть чат" };
  }
  if (actor === "CUSTOMER" && status === "IN_PROGRESS") {
    return { title: "Вас выбрали исполнителем", message: `Заказчик выбрал вас исполнителем по заказу «${order}».`, actionLabel: "Открыть чат" };
  }
  if (actor === "CUSTOMER" && status === "REJECTED" && reason === "SELECTED_ANOTHER") {
    return { title: "Отклик отклонён", message: `По заказу «${order}» выбран другой исполнитель.`, actionLabel: "Открыть отклики" };
  }
  if (actor === "CUSTOMER" && status === "REJECTED") {
    const why = payload.rejection_reason?.trim();
    const base = `Заказчик отклонил ваш отклик по заказу «${order}».`;
    return { title: "Отклик отклонён", message: why ? `${base} Причина: ${why}` : base, actionLabel: "Открыть отклики" };
  }
  if (actor === "CUSTOMER" && status === "COMPLETED") {
    return { title: "Заказчик завершил проект", message: `Заказчик отметил проект по заказу «${order}» как завершённый.`, actionLabel: "Открыть отклики" };
  }
  if (actor === "EXPERT" && status === "IN_PROGRESS") {
    return { title: "Исполнитель принял проект", message: `Исполнитель подтвердил начало работ по заказу «${order}».`, actionLabel: "Открыть чат" };
  }
  if (actor === "EXPERT" && status === "COMPLETED") {
    return { title: "Исполнитель завершил проект", message: `Исполнитель отметил проект по заказу «${order}» как завершённый.`, actionLabel: "Открыть отклики" };
  }
  return { title: "Изменился статус отклика", message: `По заказу «${order}» обновился статус отклика.`, actionLabel: "Открыть отклики" };
}

function chatMessage(payload: ChatMessagePayload): NotificationCardText {
  return {
    title: `Новое сообщение от ${SENDER[payload.sender_role]}`,
    message: `По заказу «${orderTitle(payload.order_title)}»: ${payload.preview || "Новое сообщение"}`,
    actionLabel: "Открыть чат",
  };
}

function questionAsked(payload: QuestionAskedPayload): NotificationCardText {
  return {
    title: "Новый вопрос по заказу",
    message: `${payload.expert_name || "Исполнитель"} спрашивает по «${orderTitle(payload.order_title)}»: ${payload.preview || "Новый вопрос"}`,
    actionLabel: "Перейти к заказу",
  };
}

function questionAnswered(payload: QuestionAnsweredPayload): NotificationCardText {
  return {
    title: "Заказчик ответил на ваш вопрос",
    message: `По заказу «${orderTitle(payload.order_title)}»: ${payload.preview || "Ответ заказчика"}`,
    actionLabel: "Перейти к заказу",
  };
}

function supportReply(payload: SupportReplyPayload): NotificationCardText {
  const number = payload.ticket_number ? `${payload.ticket_number} ` : "";
  return {
    title: "Поддержка ответила на ваше обращение",
    message: `${number}«${payload.subject || "Обращение"}»: ${payload.preview || "Новое сообщение от поддержки"}`,
    actionLabel: "Открыть обращение",
  };
}

function newBlogPost(payload: NewBlogPostPayload): NotificationCardText {
  return {
    title: "Новая статья в блоге",
    message: `«${payload.blog_title || "Новая статья"}»: ${payload.preview || "На платформе появилась новая публикация."}`,
    actionLabel: "Читать статью",
  };
}

function newOrder(payload: NewOrderPayload): NotificationCardText {
  const order = orderTitle(payload.order_title);
  const badges = (payload.badges ?? []).join(" · ");
  return {
    title: payload.message ? `Вам может быть интересен этот заказ: ${order}` : "Новая заявка по вашим типам",
    message: payload.message || `Опубликована заявка «${order}» по вашим типам${badges ? `: ${badges}` : ""}.`,
    actionLabel: "Открыть заказы",
  };
}

function laborResponse(payload: LaborResponsePayload): NotificationCardText {
  return {
    title: "Новый отклик на вашу заявку",
    message: `${payload.responder_name} откликнулся на объявление «${payload.listing_title}». Откройте вкладку «Мои заявки», чтобы перейти в чат.`,
    actionLabel: "Открыть мои заявки",
  };
}

/** Объясняет действие участника с вашей публикацией. */
function postActivity(payload: PostActivityPayload): NotificationCardText {
  const actions = {
    like: "понравилась ваша публикация",
    comment: "прокомментировал(а) вашу публикацию",
    reply: "ответил(а) на ваш комментарий",
    repost: "поделился(-ась) вашей публикацией",
    follow: "подписался(-ась) на ваши публикации",
  };
  const name = payload.actor_name || "Участник";
  return {
    title: payload.kind === "follow" ? "Новый подписчик" : "Активность в публикациях",
    message: payload.kind === "like" ? `${name}: ${actions.like}.` : `${name} ${actions[payload.kind]}.`,
    actionLabel: payload.kind === "follow" ? "Публикации автора" : "Открыть публикацию",
  };
}

/** Заголовок, текст и подпись кнопки карточки по типу уведомления. */
export function toNotificationCard(item: NotificationItem): NotificationCardText {
  switch (item.type) {
    case "RESPONSE_UPDATED":
      return responseUpdated(item.payload as ResponseUpdatedPayload);
    case "RESPONSE_STATUS_CHANGED":
      return responseStatusChanged(item.payload as ResponseStatusChangedPayload);
    case "CHAT_MESSAGE":
      return chatMessage(item.payload as ChatMessagePayload);
    case "QUESTION_ASKED":
      return questionAsked(item.payload as QuestionAskedPayload);
    case "QUESTION_ANSWERED":
      return questionAnswered(item.payload as QuestionAnsweredPayload);
    case "SUPPORT_REPLY":
      return supportReply(item.payload as SupportReplyPayload);
    case "POST_ACTIVITY":
      return postActivity(item.payload as PostActivityPayload);
    case "NEW_BLOG_POST":
      return newBlogPost(item.payload as NewBlogPostPayload);
    case "NEW_ORDER":
      return newOrder(item.payload as NewOrderPayload);
    case "CONTACT_ACCESS": {
      const payload = item.payload as ContactAccessPayload;
      return { title: payload.title, message: payload.message, actionLabel: "Открыть сделку" };
    }
    case "LABOR_RESPONSE":
      return laborResponse(item.payload as LaborResponsePayload);
    default:
      return { title: "Новое уведомление", message: "Откройте уведомление, чтобы посмотреть детали.", actionLabel: "Открыть" };
  }
}
