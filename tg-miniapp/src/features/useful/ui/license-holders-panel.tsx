import { useState } from "react";
import { EmptyState, Spinner } from "@/shared/ui";
import { EmptyAcceptedIcon } from "@/shared/ui/icons/empty";
import { LicenseHolderCard, type LicenseHolder } from "@/entites/license-holder";
import { useLicenseHolders } from "../model/use-license-holders";
import { LicenseHolderSheet } from "./license-holder-sheet";
import s from "./license-holders-panel.module.scss";

export function LicenseHoldersPanel() {
  const { items } = useLicenseHolders();
  const [selected, setSelected] = useState<LicenseHolder | null>(null);

  return (
    <>
      {items === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<EmptyAcceptedIcon />}
          title="Пока нет держателей разрешительных документов"
          subtitle="Компании, предоставляющие лицензии, появятся здесь"
        />
      ) : (
        <div className={s.list}>
          <p className={s.sub}>Компании, предоставляющие лицензии на деятельность по проведению ЭПБ</p>
          {items.map((holder) => (
            <LicenseHolderCard key={holder.id} holder={holder} onClick={() => setSelected(holder)} />
          ))}
        </div>
      )}

      <LicenseHolderSheet holder={selected} onClose={() => setSelected(null)} />
    </>
  );
}
