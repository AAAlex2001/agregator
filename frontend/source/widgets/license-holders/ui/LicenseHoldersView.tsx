"use client";

import { Subtitle, Title } from "@/source/shared/ui/Typography";
import {
  LicenseHolderCard,
  LicenseHolderCardSkeleton,
  useLicenseHolders,
} from "@/source/entities/license-holder";
import s from "./LicenseHoldersView.module.scss";

const SKELETON_COUNT = 6;

export function LicenseHoldersView() {
  const { items, isLoading, error } = useLicenseHolders(true);

  return (
    <div className={s.wrapper}>
      <div className={s.head}>
        <Title text="Держатели лицензии" as="h1" className={s.title} />
        <Subtitle
          text="Компании, предоставляющие лицензии для участия в тендерах. Раскройте карточку, чтобы увидеть документы и условия."
          className={s.subtitle}
        />
      </div>

      {isLoading ? (
        <div className={s.grid}>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <LicenseHolderCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className={s.message}>{error}</p>
      ) : items.length === 0 ? (
        <p className={s.message}>Пока нет зарегистрированных держателей лицензии.</p>
      ) : (
        <div className={s.grid}>
          {items.map((item) => (
            <LicenseHolderCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
