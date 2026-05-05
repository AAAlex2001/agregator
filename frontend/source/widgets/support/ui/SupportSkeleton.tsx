"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./SupportSkeleton.module.scss";

export function SupportSkeleton() {
  return (
    <main className={s.body} aria-hidden="true">
      <div className={s.sidebarPane}>
        <div className={s.sidebarPanel}>
          <div className={s.sidebarHead}>
            <Skeleton className={s.titleLine} rounded="pill" />
            <Skeleton className={s.countPill} rounded="pill" />
          </div>
          <Skeleton className={s.createButton} rounded="pill" />
          <ul className={s.list}>
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index} className={s.listItem}>
                <div className={s.listItemTop}>
                  <Skeleton className={s.numberLine} rounded="pill" />
                  <Skeleton className={s.statusPill} rounded="pill" />
                </div>
                <Skeleton className={s.subjectLine} rounded="pill" />
                <Skeleton className={s.previewLine} rounded="pill" />
                <Skeleton className={s.previewLineShort} rounded="pill" />
                <div className={s.listItemBottom}>
                  <Skeleton className={s.categoryLine} rounded="pill" />
                  <Skeleton className={s.dateLine} rounded="pill" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.contentPane}>
        <div className={s.detailCard}>
          <div className={s.detailHead}>
            <div className={s.detailHeadTitle}>
              <Skeleton className={s.headerNumber} rounded="pill" />
              <Skeleton className={s.headerSubject} rounded="pill" />
            </div>
            <Skeleton className={s.headerStatus} rounded="pill" />
          </div>

          <div className={s.thread}>
            <div className={`${s.bubbleRow} ${s.bubbleRowUser}`}>
              <div className={s.bubbleHead}>
                <Skeleton className={s.bubbleAuthor} rounded="pill" />
                <Skeleton className={s.bubbleDate} rounded="pill" />
              </div>
              <Skeleton className={`${s.bubble} ${s.bubbleUser}`} rounded="lg" />
            </div>

            <div className={`${s.bubbleRow} ${s.bubbleRowSupport}`}>
              <div className={s.bubbleHead}>
                <Skeleton className={s.bubbleAuthor} rounded="pill" />
                <Skeleton className={s.bubbleDate} rounded="pill" />
              </div>
              <Skeleton className={`${s.bubble} ${s.bubbleSupport}`} rounded="lg" />
            </div>
          </div>

          <Skeleton className={s.composer} rounded="lg" />
        </div>
      </div>
    </main>
  );
}
