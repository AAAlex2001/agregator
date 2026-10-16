/** Общая блокировка секции при сохранении соседних настроек уведомлений. */
export interface OrderNotificationsOptions {
  disabled?: boolean;
  onBusyChange?: (isBusy: boolean) => void;
}
