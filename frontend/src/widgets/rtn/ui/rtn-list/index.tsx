"use client";

import { RtnCard, useRtnList } from "@/entities/rtn";
import { EmptyState } from "@/shared/ui/empty-state";
import styles from "./style.module.scss";

/** Префикс ссылок на разъяснения и наличие фильтров в текущем адресе. */
interface RtnListProps {
  basePath: string;
  isFiltered: boolean;
}

/** Показывает карточки каталога или пояснение для пустой выдачи. */
export function RtnList({ basePath, isFiltered }: RtnListProps) {
  const { items } = useRtnList();

  if (items.length === 0) {
    return (
      <EmptyState
        title={isFiltered ? "Ничего не найдено" : "Пока нет опубликованных разъяснений"}
        subtitle={
          isFiltered
            ? "Попробуйте изменить запрос или сбросить фильтры"
            : "Ответы Ростехнадзора еще не опубликованы в этом разделе — загляните позже"
        }
      />
    );
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <RtnCard
          key={item.id}
          item={item}
          href={`${basePath}/rtn/${item.slug}`}
        />
      ))}
    </ul>
  );
}
