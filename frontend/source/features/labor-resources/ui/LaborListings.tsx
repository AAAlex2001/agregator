"use client";

import type { LaborListingData } from "@/source/entities/labor";
import { EmptyStateCard } from "@/source/shared/ui";
import type { LaborListTab } from "../model/types";
import { LaborListingCard } from "./LaborListingCard";
import { LaborListingsSkeleton } from "./LaborListingsSkeleton";
import s from "./LaborListings.module.scss";

interface LaborListingsProps {
  items: LaborListingData[];
  tab: LaborListTab;
  loading: boolean;
  error: string | null;
  busyId: number | null;
  onContact: (item: LaborListingData) => void;
  onOpenChat: (chatUuid: string) => void;
  onClose: (item: LaborListingData) => void;
  unreadForListing: (listingId: number) => number;
  unreadForChat: (chatUuid: string) => number;
}

export function LaborListings({
  items,
  tab,
  loading,
  error,
  busyId,
  onContact,
  onOpenChat,
  onClose,
  unreadForListing,
  unreadForChat,
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
              busy={busyId === item.id}
              unreadCount={unreadForListing(item.id)}
              unreadForChat={unreadForChat}
              onContact={() => onContact(item)}
              onOpenChat={onOpenChat}
              onClose={() => onClose(item)}
            />
          ))}
        </div>
      )}
    </>
  );
}
