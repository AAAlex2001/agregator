"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./TicketDetailSkeleton.module.scss";

export function TicketDetailSkeleton() {
  return (
    <div className={s.card} aria-hidden="true">
      <div className={s.header}>
        <div className={s.headerTitle}>
          <Skeleton className={s.headerNumber} rounded="pill" />
          <Skeleton className={s.headerSubject} rounded="pill" />
        </div>
        <Skeleton className={s.headerStatus} rounded="pill" />
      </div>

      <div className={s.thread}>
        <div className={`${s.row} ${s.rowUser}`}>
          <Skeleton className={s.rowHead} rounded="pill" />
          <Skeleton className={`${s.bubble} ${s.bubbleUser}`} rounded="lg" />
        </div>
        <div className={`${s.row} ${s.rowSupport}`}>
          <Skeleton className={s.rowHead} rounded="pill" />
          <Skeleton className={`${s.bubble} ${s.bubbleSupport}`} rounded="lg" />
        </div>
        <div className={`${s.row} ${s.rowUser}`}>
          <Skeleton className={s.rowHead} rounded="pill" />
          <Skeleton className={`${s.bubble} ${s.bubbleUserShort}`} rounded="lg" />
        </div>
      </div>

      <Skeleton className={s.composer} rounded="lg" />
    </div>
  );
}
