"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./TicketListSkeleton.module.scss";

const PLACEHOLDERS = [0, 1, 2, 3];

export function TicketListSkeleton() {
  return (
    <div className={s.panel} aria-hidden="true">
      <div className={s.header}>
        <Skeleton className={s.title} rounded="pill" />
        <Skeleton className={s.count} rounded="pill" />
      </div>

      <Skeleton className={s.createButton} rounded="pill" />

      <ul className={s.list}>
        {PLACEHOLDERS.map((index) => (
          <li key={index} className={s.item}>
            <div className={s.itemTop}>
              <Skeleton className={s.number} rounded="pill" />
              <Skeleton className={s.status} rounded="pill" />
            </div>
            <Skeleton className={s.subject} rounded="pill" />
            <Skeleton className={s.preview} rounded="pill" />
            <Skeleton className={s.previewShort} rounded="pill" />
            <div className={s.itemBottom}>
              <Skeleton className={s.category} rounded="pill" />
              <Skeleton className={s.date} rounded="pill" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
