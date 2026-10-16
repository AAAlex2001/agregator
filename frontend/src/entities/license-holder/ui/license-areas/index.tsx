import { LicenseAreaBadge } from "../license-area-badge";
import styles from "./style.module.scss";

/** Области разрешительных документов, полученные из каталога. */
interface LicenseAreasProps {
  areas: string[] | null;
}

/** Отдельные места областей лицензии после объединённой группы КЛ и ТП. */
const SEPARATE_LICENSE_AREAS = ["ЗС", "ТУ", "Д", "ОБ"];

/** Показывает объединённую область КЛ/ТП или имеющиеся отдельные области. */
function CombinedLicenseArea({ areas }: LicenseAreasProps) {
  if (areas?.includes("КЛ/ТП")) {
    return <LicenseAreaBadge area="КЛ/ТП" />;
  }

  const hasKl = areas?.includes("КЛ");
  const hasTp = areas?.includes("ТП");

  if (!hasKl && !hasTp) {
    return <span className={styles.badgeMissing}>—/—</span>;
  }

  return (
    <span className={styles.badgeCombo}>
      {hasKl ? "КЛ" : "—"}
      {"/"}
      {hasTp ? "ТП" : "—"}
    </span>
  );
}

/** Сохраняет пять мест областей лицензии, отмечая отсутствующие прочерками. */
export function LicenseAreas({ areas }: LicenseAreasProps) {
  return (
    <div className={styles.badges}>
      <div className={styles.badgeSlot}>
        <CombinedLicenseArea areas={areas} />
      </div>
      {SEPARATE_LICENSE_AREAS.map((area) => (
        <div
          key={area}
          className={styles.badgeSlot}
        >
          {areas?.includes(area) ? (
            <LicenseAreaBadge area={area} />
          ) : (
            <span className={styles.badgeMissing}>—</span>
          )}
        </div>
      ))}
    </div>
  );
}
