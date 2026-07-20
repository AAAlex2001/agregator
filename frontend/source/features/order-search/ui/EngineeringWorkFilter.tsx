import {
  ORDER_WORK_OPTIONS,
  type PublicOrderSearchFilters,
} from "@/source/entities/order";
import { WorkTypeIcon } from "./WorkTypeIcon";
import s from "./OrderSearchFilters.module.scss";

interface Props {
  onSelect: (filters: PublicOrderSearchFilters, label: string) => void;
}

export function EngineeringWorkFilter({ onSelect }: Props) {
  return (
    <section className={s.workColumn} aria-label="Иная инженерная работа">
      <span className={s.srOnly}>Иная инженерная работа</span>
      <div className={s.workGrid}>
        {ORDER_WORK_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={s.workButton}
            onClick={() => onSelect({ workType: option.value }, option.label)}
          >
            <span className={s.workIcon}><WorkTypeIcon type={option.value} /></span>
            <span className={s.workText}>
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
