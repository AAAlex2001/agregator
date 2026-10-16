import { LaborListingCard } from "@/entities/labor";
import type { LaborListing } from "@/entities/labor";
import { CloseLaborListingButton } from "@/features/close-labor-listing";
import { ContactLaborListingButton } from "@/features/contact-labor-listing";
import { ShareLaborListingButton } from "@/features/share-labor-listing";
import { LaborResponders } from "../labor-responders";
import styles from "./style.module.scss";

/** Объявление и обновление списка после его закрытия. */
interface LaborListingItemProps {
  item: LaborListing;
  onClosed: () => void;
}

/** Показывает объявление с откликами автора и доступными действиями. */
export function LaborListingItem({ item, onClosed }: LaborListingItemProps) {
  return (
    <LaborListingCard item={item}>
      {item.is_mine && <LaborResponders responders={item.responders} />}

      <div className={styles.actions}>
        <ShareLaborListingButton publicId={item.public_id} />

        {!item.is_mine && <ContactLaborListingButton listingId={item.id} />}

        {item.is_mine && (
          <CloseLaborListingButton
            listingId={item.id}
            onClosed={onClosed}
          />
        )}
      </div>
    </LaborListingCard>
  );
}
