import cn from "classnames";
import styles from "./style.module.scss";

type TextareaProps = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  ariaLabel?: string;
  maxLength?: number;
  className?: string;
};

/** Многострочное поле ввода, тянется по вертикали. */
const Textarea = ({ value, onChange, rows = 4, placeholder, ariaLabel, maxLength, className }: TextareaProps) => (
  <textarea
    className={cn(styles.textarea, className)}
    value={value}
    rows={rows}
    placeholder={placeholder}
    aria-label={ariaLabel}
    maxLength={maxLength}
    onChange={(event) => onChange(event.target.value)}
  />
);

export default Textarea;
