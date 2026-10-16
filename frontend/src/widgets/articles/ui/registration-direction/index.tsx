import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import type { RegistrationDirection } from "../../model/types";
import styles from "./style.module.scss";

/** Доступные направления, текущий выбор и событие изменения. */
interface RegistrationDirectionProps {
  options: RegistrationDirection[];
  selected: RegistrationDirection;
  onChange: (value: string) => void;
}

/** Выбирает направление и показывает ссылку на описание его работ. */
export function RegistrationDirectionPicker({
  options,
  selected,
  onChange,
}: RegistrationDirectionProps) {
  return (
    <div className={styles.left}>
      <h2 className={styles.fieldLabel}>
        Направление работ
      </h2>
      <Select
        variant="pill"
        ariaLabel="Направление работ"
        options={options}
        value={selected.value}
        onChange={onChange}
      />
      <Button
        href={selected.href}
        variant="outline"
        size="md"
        fullWidth
        className={styles.cta}
      >
        Чем занимается направление
      </Button>
    </div>
  );
}
