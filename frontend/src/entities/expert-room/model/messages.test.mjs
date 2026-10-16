import assert from "node:assert/strict";
import test from "node:test";
import {
  addExpertRoomMessage,
  addOlderExpertRoomMessages,
  getTypingLabel,
  groupExpertRoomMessages,
} from "./messages.ts";

/** Сообщение чата с нужным отправителем. */
function createMessage(id, senderId, senderName = `Эксперт ${senderId}`) {
  return {
    id,
    sender_id: senderId,
    sender_name: senderName,
    sender_avatar_url: null,
    text: `Сообщение ${id}`,
    attachments: [],
    created_at: "2026-10-17T10:00:00Z",
  };
}

test("Подряд идущие сообщения одного отправителя собираются в одну группу", () => {
  const groups = groupExpertRoomMessages([
    createMessage(1, 7, "Иванов"),
    createMessage(2, 7, "Иванов"),
    createMessage(3, 9, "Петров"),
    createMessage(4, 7, "Иванов"),
  ]);

  assert.deepEqual(groups.map((group) => group.senderName), ["Иванов", "Петров", "Иванов"]);
  assert.deepEqual(groups[0].messages.map((message) => message.id), [1, 2]);
});

test("Сообщение, уже пришедшее по сокету, не дублируется после отправки", () => {
  const messages = [createMessage(1, 7), createMessage(2, 9)];

  assert.equal(addExpertRoomMessage(messages, createMessage(2, 9)), messages);
  assert.deepEqual(
    addExpertRoomMessage(messages, createMessage(3, 7)).map((message) => message.id),
    [1, 2, 3],
  );
});

test("Старые сообщения встают в начало без уже показанных", () => {
  const messages = [createMessage(5, 7), createMessage(6, 9)];
  const older = [createMessage(3, 7), createMessage(4, 7), createMessage(5, 7)];

  assert.deepEqual(
    addOlderExpertRoomMessages(messages, older).map((message) => message.id),
    [3, 4, 5, 6],
  );
});

test("Подпись набора текста зависит от числа коллег", () => {
  const anna = { user_id: 1, user_name: "Анна" };
  const boris = { user_id: 2, user_name: "Борис" };
  const vera = { user_id: 3, user_name: "Вера" };

  assert.equal(getTypingLabel([anna]), "Анна печатает…");
  assert.equal(getTypingLabel([anna, boris]), "Анна и Борис печатают…");
  assert.equal(getTypingLabel([anna, boris, vera]), "Анна и ещё 2 печатают…");
});
