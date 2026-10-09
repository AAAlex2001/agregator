import cn from "classnames";
import type { Option } from "@/shared/lib/options";
import { ChevronDownIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type SelectProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  size?: "md" | "sm";
  className?: string;
};

/** Выпадающий список на нативном select — с клавиатурой и на телефоне работает сам. */
const Select = ({ value, options, onChange, ariaLabel, size = "md", className }: SelectProps) => (
  <label className={cn(styles.field, size === "sm" && styles.small, className)}>
    <select
      className={styles.select}
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    <ChevronDownIcon className={styles.chevron} />
  </label>
);

export default Select;
