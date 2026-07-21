import type { LaborPageMode } from "../model/types";
import s from "./LaborForm.module.scss";

interface LaborFormUnavailableProps {
  mode: LaborPageMode;
  title: string;
}

export function LaborFormUnavailable({
  mode,
  title,
}: LaborFormUnavailableProps) {
  const message = mode === "license"
    ? "Создание заявок доступно в роли держателя лицензии."
    : "Создание заявок доступно в роли эксперта.";

  return (
    <div className={s.unavailable}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
