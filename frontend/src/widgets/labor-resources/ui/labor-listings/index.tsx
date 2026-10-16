import { LaborListingCardSkeleton } from "@/entities/labor";
import type { LaborListing } from "@/entities/labor";
import { EmptyState } from "@/shared/ui/empty-state";
import { LaborListingItem } from "../labor-listing-item";
import styles from "./style.module.scss";

/** Объявления открытой вкладки и результат их загрузки. */
interface LaborListingsProps {
  items: LaborListing[];
  isMine: boolean;
  isLoading: boolean;
  error: string | null;
  onClosed: () => void;
}

/** Показывает загрузку, ошибку, пустую вкладку или список объявлений. */
export function LaborListings({
  items,
  isMine,
  isLoading,
  error,
  onClosed,
}: LaborListingsProps) {
  const emptyTitle = isMine
    ? "У вас пока нет активных заявок"
    : "Активных заявок пока нет";
  const emptySubtitle = isMine
    ? "Заполните форму, и заявка появится в этом разделе"
    : "Здесь появятся новые предложения о трудоустройстве";

  if (isLoading) {
    return (
      <div
        className={styles.list}
        aria-hidden="true"
      >
        <LaborListingCardSkeleton />
        <LaborListingCardSkeleton />
      </div>
    );
  }

  return (
    <>
      {error && <p className={styles.error}>{error}</p>}

      {items.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          subtitle={emptySubtitle}
        />
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <LaborListingItem
              key={item.id}
              item={item}
              onClosed={onClosed}
            />
          ))}
        </div>
      )}
    </>
  );
}
