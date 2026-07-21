"use client";

import type { LaborListingData } from "@/source/entities/labor";
import type { SessionRole } from "@/source/features/session";
import { EmptyStateCard } from "@/source/shared/ui";
import type { LaborListTab } from "../model/types";
import { LaborListingCard } from "./LaborListingCard";
import { LaborListingsSkeleton } from "./LaborListingsSkeleton";
import s from "./LaborListings.module.scss";

interface LaborListingsProps {
  items: LaborListingData[];
  tab: LaborListTab;
  role: SessionRole | null;
  loading: boolean;
  error: string | null;
  busyId: number | null;
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
  onContact,
  onClose,
}: LaborListingsProps) {
  if (loading) {
    return <LaborListingsSkeleton />;
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
