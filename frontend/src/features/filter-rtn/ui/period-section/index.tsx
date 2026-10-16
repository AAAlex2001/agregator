import { CalendarInput } from "@/shared/ui/calendar-input";
import { useRtnFilters } from "../../model/use-rtn-filters";
import { FilterSection } from "../filter-section";
import styles from "./style.module.scss";

/** Ограничивает каталог датами начала и конца публикации разъяснений. */
export function PeriodSection() {
  const { dateValue, changeDate } = useRtnFilters();
  const from = dateValue("published_from");
  const to = dateValue("published_to");

  /** Меняет начальную дату периода публикации. */
  function changeFrom(value: string) {
    changeDate("published_from", value);
  }

  /** Меняет конечную дату периода публикации. */
  function changeTo(value: string) {
    changeDate("published_to", value);
  }

  return (
    <FilterSection
      title="Период"
      count={[from, to].filter(Boolean).length}
    >
      <div className={styles.range}>
        <CalendarInput
          value={from}
          onChange={changeFrom}
          placeholder="С даты"
        />
        <CalendarInput
          value={to}
          onChange={changeTo}
          placeholder="По дату"
        />
      </div>
    </FilterSection>
  );
}
