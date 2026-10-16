import type { DirectionCode, DirectionOption } from "@/entities/direction";
import { Switch } from "@/shared/ui/switch";
import styles from "./style.module.scss";

/** Переключатель писем по одному направлению работ. */
interface DirectionNotificationOptionProps {
  direction: DirectionOption;
  checked: boolean;
  disabled: boolean;
  onChange: (code: DirectionCode, enabled: boolean) => void;
}

/** Показывает название направления и передаёт изменение фильтра форме. */
export function DirectionNotificationOption({
  direction,
  checked,
  disabled,
  onChange,
}: DirectionNotificationOptionProps) {
  /** Передаёт код направления вместе с новым состоянием переключателя. */
  function changeDirection(enabled: boolean) {
    onChange(direction.value, enabled);
  }

  return (
    <li className={styles.item}>
      <Switch
        id={`order-notification-${direction.value.toLowerCase()}`}
        checked={checked}
        onChange={changeDirection}
        label={direction.label}
        description={direction.description}
        disabled={disabled}
      />
    </li>
  );
}
