import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import cn from "classnames";
import { EyeIcon, EyeOffIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  icon?: ReactNode;
  password?: boolean;
}

export function TextField({ icon, password = false, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  const type = password ? (reveal ? "text" : "password") : rest.type ?? "text";

  return (
    <div className={cn(s.wrap, { [s.focused]: focused })}>
      {icon && <span className={s.icon}>{icon}</span>}
      <input
        {...rest}
        type={type}
        className={s.input}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
      />
      {password && (
        <button type="button" className={s.toggle} onClick={() => setReveal((v) => !v)} aria-label="Показать пароль">
          {reveal ? <EyeOffIcon width={20} height={20} /> : <EyeIcon width={20} height={20} />}
        </button>
      )}
    </div>
  );
}
