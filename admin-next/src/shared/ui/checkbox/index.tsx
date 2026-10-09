import cn from "classnames";
import type { ReactNode } from "react";
import { CheckIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  className?: string;
};

/** Галочка с подписью. */
const Checkbox = ({ checked, onChange, children, className }: CheckboxProps) => (
  <label className={cn(styles.checkbox, checked && styles.checked, className)}>
    <input
      className={styles.input}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className={styles.box} aria-hidden="true">
      {checked && <CheckIcon />}
    </span>
    <span className={styles.label}>{children}</span>
  </label>
);

export default Checkbox;
