"use client";

import Button from "@/source/shared/ui/Button";
import { CommentIcon } from "@/source/shared/ui/icons";
import s from "./EmptyDetail.module.scss";

interface Props {
  onCreate: () => void;
}

export function EmptyDetail({ onCreate }: Props) {
  return (
    <div className={s.panel}>
      <div className={s.iconWrap}>
        <CommentIcon />
      </div>
      <h2 className={s.title}>Выберите обращение или создайте новое</h2>
      <p className={s.subtitle}>
        Здесь появится переписка по выбранному тикету. Вся история сохраняется,
        её можно перечитать в любой момент.
      </p>
      <Button variant="primary" size="md" onClick={onCreate}>
        Создать обращение
      </Button>
    </div>
  );
}
