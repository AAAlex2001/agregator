import assert from "node:assert/strict";
import test from "node:test";
import {
  INITIAL_TICKET_LIST_STATE,
  ticketListReducer,
} from "./ticket-list-reducer.ts";

const summary = {
  id: 7,
  number: "T-7",
  subject: "Оплата",
  category: "BILLING",
  status: "REVIEW",
  created_at: "2026-10-01T10:00:00Z",
  updated_at: "2026-10-01T10:00:00Z",
  has_unread: true,
  last_message_preview: "Здравствуйте",
};

test("Ошибка первой страницы остаётся в состоянии списка", () => {
  const state = ticketListReducer(INITIAL_TICKET_LIST_STATE, {
    type: "load/error",
    error: "Нет связи",
  });

  assert.equal(state.isLoading, false);
  assert.equal(state.error, "Нет связи");
});

test("Открытое обращение перестаёт быть непрочитанным", () => {
  const loaded = ticketListReducer(INITIAL_TICKET_LIST_STATE, {
    type: "load/success",
    tickets: [summary],
    hasMore: false,
  });
  const read = ticketListReducer(loaded, {
    type: "ticket/read",
    id: 7,
  });

  assert.equal(read.tickets[0].has_unread, false);
});

test("Ответ обновляет обращение, новое добавляется в начало без переписки", () => {
  const loaded = ticketListReducer(INITIAL_TICKET_LIST_STATE, {
    type: "load/success",
    tickets: [summary],
    hasMore: false,
  });
  const answered = ticketListReducer(loaded, {
    type: "ticket/upsert",
    ticket: { ...summary, status: "ANSWERED", messages: [] },
  });
  const created = ticketListReducer(answered, {
    type: "ticket/upsert",
    ticket: { ...summary, id: 8, messages: [] },
  });

  assert.equal(answered.tickets.length, 1);
  assert.equal(answered.tickets[0].status, "ANSWERED");
  assert.equal(created.tickets[0].id, 8);
  assert.equal("messages" in created.tickets[0], false);
});
