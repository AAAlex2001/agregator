import type { TelegramPoll } from "@/entities/post";

/** Меняет текст одного варианта ответа. */
export function changePollOption(poll: TelegramPoll, index: number, text: string): TelegramPoll {
  return {
    ...poll,
    options: poll.options.map((option, position) => (position === index ? text : option)),
  };
}

/** Добавляет пустой вариант ответа. */
export function addPollOption(poll: TelegramPoll): TelegramPoll {
  return {
    ...poll,
    options: [...poll.options, ""],
  };
}

/** Убирает вариант ответа. */
export function removePollOption(poll: TelegramPoll, index: number): TelegramPoll {
  return {
    ...poll,
    options: poll.options.filter((option, position) => position !== index),
  };
}
