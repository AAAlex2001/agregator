/** Вариант списка с необязательными пояснением и изображением. */
export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
  image?: string;
}

/** Общие настройки обычного поля и округлой кнопки с изображением. */
interface SelectBaseProps {
  options: SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  variant?: "pill" | "input";
  className?: string;
}

/** Выбор одного значения с закрытием списка. */
interface SingleSelectProps extends SelectBaseProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

/** Выбор нескольких значений без закрытия списка. */
interface MultipleSelectProps extends SelectBaseProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

/** Связывает режим выбора с типом значения и обработчика. */
export type SelectProps = SingleSelectProps | MultipleSelectProps;
