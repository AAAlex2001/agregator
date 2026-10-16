import { LicenseHolderCard, useLicenseHolders } from "@/entities/license-holder";
import { Loader } from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Загружает и показывает каталог держателей в открытой панели. */
export function DrawerContent() {
  const { items, isLoading, error } = useLicenseHolders();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader
          size="md"
          label=""
        />
      </div>
    );
  }

  if (error) {
    return <p className={styles.message}>{error}</p>;
  }

  if (items.length === 0) {
    return (
      <p className={styles.message}>
        Пока нет зарегистрированных держателей разрешительных документов.
      </p>
    );
  }

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <LicenseHolderCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}
