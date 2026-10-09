"use client";

import { countLabel } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import IconButton from "@/shared/ui/icon-button";
import { CheckIcon, CloseIcon, PencilIcon, PlusIcon, TrashIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Panel from "@/shared/ui/panel";
import { useTags } from "../../model/use-tags";
import styles from "./style.module.scss";

/** Управление тегами: добавление, переименование на месте и удаление. */
const TagsManager = () => {
  const { state, changeDraft, add, openEdit, changeEditing, closeEdit, rename, askRemove, cancelRemove, remove } = useTags();
  const { tags } = state;

  if (state.failed) return <Message tone="error">Не удалось загрузить теги.</Message>;
  if (!tags) return <Loader size="lg" />;

  return (
    <LoadingArea loading={state.pending}>
      <Panel title="Новый тег">
        <form
          className={styles.add}
          onSubmit={(event) => {
            event.preventDefault();
            add();
          }}
        >
          <Input ariaLabel="Название тега" placeholder="Например, Промышленная безопасность" maxLength={100} value={state.draft} onChange={changeDraft} />
          <Button type="submit" disabled={!state.draft.trim()}>
            <PlusIcon />
            Добавить
          </Button>
        </form>
      </Panel>

      <Panel title="Все теги" action={<span className={styles.count}>{countLabel(tags.length, ["тег", "тега", "тегов"])}</span>}>
        {tags.length === 0 ? (
          <Message>Тегов пока нет.</Message>
        ) : (
          <List>
            {tags.map((tag) =>
              state.editing?.id === tag.id ? (
                <ListRow key={tag.id} className={styles.row}>
                  <Input ariaLabel="Новое название" maxLength={100} value={state.editingName} onChange={changeEditing} />
                  <span className={styles.actions}>
                    <IconButton tone="accent" size="sm" ariaLabel="Сохранить" onClick={rename}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton size="sm" ariaLabel="Отменить" onClick={closeEdit}>
                      <CloseIcon />
                    </IconButton>
                  </span>
                </ListRow>
              ) : (
                <ListRow key={tag.id} className={styles.row}>
                  <span className={styles.name}>{tag.name}</span>
                  <span className={styles.actions}>
                    <IconButton size="sm" ariaLabel="Переименовать" onClick={() => openEdit(tag)}>
                      <PencilIcon />
                    </IconButton>
                    <IconButton tone="danger" size="sm" ariaLabel="Удалить" onClick={() => askRemove(tag)}>
                      <TrashIcon />
                    </IconButton>
                  </span>
                </ListRow>
              ),
            )}
          </List>
        )}
      </Panel>

      <ConfirmModal
        open={state.removing !== null}
        title="Удалить тег?"
        text={`Тег «${state.removing?.name ?? ""}» пропадёт со всех статей и разъяснений.`}
        confirmLabel="Удалить"
        pending={state.pending}
        onConfirm={remove}
        onCancel={cancelRemove}
      />
    </LoadingArea>
  );
};

export default TagsManager;
