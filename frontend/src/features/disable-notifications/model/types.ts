/** Блокировка кнопки на время сохранения соседних настроек. */
export interface DisableNotificationsOptions {
  disabled?: boolean;
  onBusyChange?: (isBusy: boolean) => void;
}
