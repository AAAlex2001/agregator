import type { RtnOption } from "@/entities/rtn";
import { Checkbox } from "@/shared/ui/checkbox";
import type { RtnOptionFilter } from "../../model/types";

/** Пункт справочника, его состояние и действие выбора. */
interface FilterOptionProps {
  param: RtnOptionFilter;
  option: RtnOption;
  checked: boolean;
  onToggle: (param: RtnOptionFilter, value: string) => void;
}

/** Переключает один пункт справочника в адресе каталога. */
export function FilterOption({
  param,
  option,
  checked,
  onToggle,
}: FilterOptionProps) {
  /** Передаёт выбранный пункт обработчику фильтров. */
  function toggle() {
    onToggle(param, option.value);
  }

  return (
    <Checkbox
      id={`rtn-${param}-${option.value}`}
      checked={checked}
      onChange={toggle}
    >
      {option.label}
    </Checkbox>
  );
}
