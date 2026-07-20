import { ORDER_WORK_OPTIONS } from "@/entites/order";
import { Toggle } from "@/shared/ui";
import { useOrderNotificationSettings } from "../model/use-order-notification-settings";
import s from "./order-notification-settings.module.scss";

interface OrderNotificationSettingsProps {
  value: string[];
  reloadProfile: () => Promise<void>;
}

export function OrderNotificationSettings({
  value,
  reloadProfile,
}: OrderNotificationSettingsProps) {
  const settings = useOrderNotificationSettings(value, reloadProfile);

  return (
    <section className={s.section} aria-busy={settings.saving}>
      <div className={s.intro}>
        <h2 className={s.title}>Новые заказы</h2>
        <p className={s.subtitle}>
          Выберите виды инженерных работ, по которым хотите получать уведомления.
        </p>
      </div>

      <div className={s.list}>
        {ORDER_WORK_OPTIONS.map((option) => (
          <div key={option.key} className={s.row}>
            <div className={s.text}>
              <p className={s.label}>{option.label}</p>
              <p className={s.description}>{option.description}</p>
            </div>
            <Toggle
              on={settings.selected.includes(option.key)}
              onChange={(enabled) => void settings.toggle(option.key, enabled)}
              disabled={settings.saving}
              ariaLabel={`Уведомления: ${option.label}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
