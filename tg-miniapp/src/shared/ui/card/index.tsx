import type { ReactNode } from "react";
import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

interface Props {
  children: ReactNode;
  className?: string;
  pad?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, pad = true, onClick }: Props) {
  return (
    <div
      className={cn(s.card, { [s.pad]: pad, [s.clickable]: !!onClick }, className)}
      onClick={
        onClick
          ? () => {
              tapHaptic();
              onClick();
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
