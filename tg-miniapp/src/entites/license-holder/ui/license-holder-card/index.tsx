import { Card } from "@/shared/ui";
import { ChevronRightIcon } from "@/shared/ui/icons/interface";
import { formatRental, licenseHolderName, type LicenseHolder } from "../../model/api";
import s from "./style.module.scss";

export function LicenseHolderCard({ holder, onClick }: { holder: LicenseHolder; onClick: () => void }) {
  const areas = holder.license_areas ?? [];

  return (
    <Card className={s.card} onClick={onClick}>
      <div className={s.head}>
        <div className={s.identity}>
          <span className={s.name}>{licenseHolderName(holder)}</span>
          {holder.inn && <span className={s.inn}>ИНН {holder.inn}</span>}
        </div>
        <ChevronRightIcon className={s.chev} width={18} height={18} />
      </div>

      {areas.length > 0 && (
        <div className={s.badges}>
          {areas.map((area) => (
            <span key={area} className={s.badge}>
              {area}
            </span>
          ))}
        </div>
      )}

      <div className={s.rentalRow}>
        <span className={s.rentalLab}>Стоимость лицензии</span>
        <span className={s.rentalVal}>{formatRental(holder)}</span>
      </div>
    </Card>
  );
}
