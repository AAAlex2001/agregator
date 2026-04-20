import type React from "react";

interface AutofillGuardProps {
  idPrefix: string;
}

const hiddenFieldStyle: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  opacity: 0,
  pointerEvents: "none",
};

export default function AutofillGuard({ idPrefix }: AutofillGuardProps) {
  return (
    <div aria-hidden="true" style={hiddenFieldStyle}>
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