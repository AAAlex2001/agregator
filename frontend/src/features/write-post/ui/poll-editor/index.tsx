"use client";

import type { TelegramPoll } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { PlusIcon } from "@/shared/ui/icons";
import { RemoveButton } from "@/shared/ui/remove-button";
import { Switch } from "@/shared/ui/switch";
import { TextInput } from "@/shared/ui/text-input";
import { EMPTY_POLL, MAX_POLL_OPTIONS, MIN_POLL_OPTIONS } from "../../config/telegram-options";
import { addPollOption, changePollOption, removePollOption } from "../../model/poll";
import styles from "./style.module.scss";

/** Опрос или его отсутствие, блокировка и замена опроса. */
interface PollEditorProps {
  poll: TelegramPoll | null;
  disabled: boolean;
  onChange: (poll: TelegramPoll | null) => void;
}

/** Опрос следом за постом: вопрос, от 2 до 10 вариантов, анонимность и несколько ответов. */
export function PollEditor({ poll, disabled, onChange }: PollEditorProps) {
  if (!poll) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={styles.add}
        disabled={disabled}
        onClick={() => onChange(EMPTY_POLL)}
      >
        <PlusIcon />
        Добавить опрос
      </Button>
    );
  }

  return (
    <div className={styles.poll}>
      <Field label="Вопрос">
        <TextInput
          value={poll.question}
          maxLength={300}
          placeholder="Что думаете?"
          onChange={(event) => onChange({ ...poll, question: event.target.value })}
        />
      </Field>
      <Field label="Варианты ответа">
        <ol className={styles.options}>
          {poll.options.map((option, index) => (
            <li
              key={index}
              className={styles.option}
            >
              <TextInput
                value={option}
                maxLength={100}
                placeholder={`Вариант ${index + 1}`}
                className={styles.optionInput}
                onChange={(event) => onChange(changePollOption(poll, index, event.target.value))}
              />
              {poll.options.length > MIN_POLL_OPTIONS && (
                <RemoveButton
                  label={`Удалить вариант ${index + 1}`}
                  onClick={() => onChange(removePollOption(poll, index))}
                />
              )}
            </li>
          ))}
        </ol>
      </Field>
      {poll.options.length < MAX_POLL_OPTIONS && (
        <Button
          variant="transparent"
          size="sm"
          className={styles.add}
          disabled={disabled}
          onClick={() => onChange(addPollOption(poll))}
        >
          <PlusIcon />
          Вариант ответа
        </Button>
      )}
      <Switch
        id="poll-anonymous"
        checked={poll.is_anonymous}
        onChange={(checked) => onChange({ ...poll, is_anonymous: checked })}
        label="Анонимный опрос"
        disabled={disabled}
      />
      <Switch
        id="poll-multiple"
        checked={poll.allows_multiple_answers}
        onChange={(checked) => onChange({ ...poll, allows_multiple_answers: checked })}
        label="Можно выбрать несколько ответов"
        disabled={disabled}
      />
      <Button
        variant="transparent"
        size="sm"
        className={styles.add}
        disabled={disabled}
        onClick={() => onChange(null)}
      >
        Убрать опрос
      </Button>
    </div>
  );
}
