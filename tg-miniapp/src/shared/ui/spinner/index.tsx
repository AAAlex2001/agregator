import cn from "classnames";
import s from "./style.module.scss";

export function Spinner({ page = false }: { page?: boolean }) {
  return (
    <div className={cn(s.wrap, { [s.page]: page })}>
      <span className={s.ring} />
    </div>
  );
}
