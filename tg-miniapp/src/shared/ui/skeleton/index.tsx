import cn from "classnames";
import s from "./style.module.scss";

export function Skeleton({ className }: { className?: string }) {
  return <span className={cn(s.skeleton, className)} />;
}
