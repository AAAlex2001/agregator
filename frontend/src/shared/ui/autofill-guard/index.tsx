import type { CSSProperties } from "react";

/** Префикс скрытых полей, уникальный для формы. */
interface AutofillGuardProps {
  idPrefix: string;
}

/** Убирает поля за пределы экрана, оставляя их доступными менеджеру паролей. */
const HIDDEN_FIELD_STYLE: CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  opacity: 0,
  pointerEvents: "none",
};

/** Скрытые поля принимают автоматическое заполнение менеджером паролей. */
export function AutofillGuard({ idPrefix }: AutofillGuardProps) {
  return (
    <div
      aria-hidden="true"
      style={HIDDEN_FIELD_STYLE}
    >
      <input
        tabIndex={-1}
        type="text"
        name={`${idPrefix}-username`}
        autoComplete="username"
        defaultValue=""
      />

      <input
        tabIndex={-1}
        type="password"
        name={`${idPrefix}-password`}
        autoComplete="current-password"
        defaultValue=""
      />
    </div>
  );
}
