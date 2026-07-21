"use client";

import type { LaborListingData } from "@/source/entities/labor";
import type { SessionRole } from "@/source/features/session";
import { EmptyStateCard } from "@/source/shared/ui";
import type { LaborListTab } from "../model/types";
import { LaborListingCard } from "./LaborListingCard";
import s from "./LaborListings.module.scss";

interface LaborListingsProps {
  items: LaborListingData[];
  tab: LaborListTab;
  role: SessionRole | null;
  loading: boolean;
  error: string | null;
  busyId: number | null;
  onCreate: () => void;
  onContact: (item: LaborListingData) => void;
  onClose: (item: LaborListingData) => void;
}

export function LaborListings({
  items,
  tab,
  role,
  loading,
  error,
  busyId,
  onCreate,
  onContact,
  onClose,
}: LaborListingsProps) {
  if (loading) {
    return <div className={s.loading}>Загружаем заявки…</div>;
  }

  return (
    <>
      {error && <p className={s.error}>{error}</p>}

      {items.length === 0 ? (
        <EmptyStateCard
          title={
            tab === "mine"
              ? "У вас пока нет активных заявок"
              : "Активных заявок пока нет"
          }
          subtitle={
            tab === "mine"
              ? "Заполните форму, и заявка появится в этом разделе"
              : "Здесь появятся новые предложения о трудоустройстве"
          }
          actionLabel={
            tab === "mine" ? "Создать заявку" : undefined
          }
          onAction={tab === "mine" ? onCreate : undefined}
        />
      ) : (
        <div className={s.list}>
          {items.map((item) => (
            <LaborListingCard
              key={item.id}
              item={item}
              role={role}
              busy={busyId === item.id}
              onContact={() => onContact(item)}
              onClose={() => onClose(item)}
            />
          ))}
        </div>
      )}
    </>
  );
}
