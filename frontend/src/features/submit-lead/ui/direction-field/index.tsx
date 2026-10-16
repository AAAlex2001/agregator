import { LEAD_DIRECTIONS } from "@/entities/lead";
import { Select } from "@/shared/ui/select";
import { LeadField } from "../lead-field";

/** Выбранное направление и обработчик его смены. */
interface DirectionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/** Названия и иллюстрации направлений для списка выбора в заявке. */
const DIRECTION_OPTIONS = LEAD_DIRECTIONS.map((direction) => ({
  value: direction.value,
  label: direction.label,
  hint: direction.hint,
  image: direction.image,
}));

/** Показывает выбор направления работ с краткой подсказкой. */
export function DirectionField({ value, onChange }: DirectionFieldProps) {
  return (
    <LeadField
      as="div"
      label="Направление работ *"
      wide
    >
      <Select
        variant="pill"
        ariaLabel="Направление работ"
        options={DIRECTION_OPTIONS}
        value={value}
        onChange={onChange}
      />
    </LeadField>
  );
}
