import type { SupportTicket } from "./types";

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 1,
    number: "T-1024",
    subject: "Не могу прикрепить PDF к отклику",
    category: "TECHNICAL",
    status: "ANSWERED",
    createdAt: "2026-05-03T10:24:00Z",
    updatedAt: "2026-05-04T14:18:00Z",
    hasUnread: true,
    messages: [
      {
        id: 1,
        author: "user",
        authorName: "Вы",
        text: "Здравствуйте! При попытке прикрепить PDF к отклику получаю ошибку «Файл слишком большой», но размер документа всего 4 МБ. В правилах указано, что лимит 10 МБ. Можете подсказать, в чём дело?",
        createdAt: "2026-05-03T10:24:00Z",
        attachments: [{ name: "tex_zadanie.pdf", url: "/uploads/support/tex_zadanie.pdf" }],
      },
      {
        id: 2,
        author: "support",
        authorName: "Поддержка",
        text: "Здравствуйте! Уточните, пожалуйста, в каком браузере и с какого устройства вы пытаетесь загрузить файл. Также пришлите скриншот ошибки, если возможно — это поможет быстрее разобраться.",
        createdAt: "2026-05-04T14:18:00Z",
      },
    ],
  },
  {
    id: 2,
    number: "T-1019",
    subject: "Возврат средств за подписку",
    category: "BILLING",
    status: "REVIEW",
    createdAt: "2026-05-04T09:11:00Z",
    updatedAt: "2026-05-04T09:11:00Z",
    hasUnread: false,
    messages: [
      {
        id: 1,
        author: "user",
        authorName: "Вы",
        text: "Оформил подписку на месяц, но обнаружил, что в моей категории заказов нет. Можно ли вернуть деньги?",
        createdAt: "2026-05-04T09:11:00Z",
      },
    ],
  },
  {
    id: 3,
    number: "T-1003",
    subject: "Как изменить ИНН компании?",
    category: "ACCOUNT",
    status: "CLOSED",
    createdAt: "2026-04-22T16:02:00Z",
    updatedAt: "2026-04-23T11:40:00Z",
    hasUnread: false,
    messages: [
      {
        id: 1,
        author: "user",
        authorName: "Вы",
        text: "Подскажите, как можно поменять ИНН в личном кабинете? В настройках поле заблокировано.",
        createdAt: "2026-04-22T16:02:00Z",
      },
      {
        id: 2,
        author: "support",
        authorName: "Поддержка",
        text: "Добрый день! Смена ИНН проходит через нашу службу поддержки. Пришлите, пожалуйста, новый ИНН и реквизиты компании в ответ — мы обновим данные в течение рабочего дня.",
        createdAt: "2026-04-22T18:30:00Z",
      },
      {
        id: 3,
        author: "user",
        authorName: "Вы",
        text: "Спасибо, всё разобрались.",
        createdAt: "2026-04-23T11:40:00Z",
      },
    ],
  },
];
