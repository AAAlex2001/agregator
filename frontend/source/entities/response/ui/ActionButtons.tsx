import Button from "@/source/shared/ui/Button";
import type { CardAction } from "../model/types";
import s from "./ActionButtons.module.scss";

export function ActionButtons({ actions }: { actions: CardAction[] }) {
  if (!actions.length) return null;
  return (
    <div className={s.actions}>
      {actions.map((a, i) => (
        <Button key={i} variant={a.variant} size="sm" fullWidth
          onClick={a.onClick} isLoading={a.isLoading} className={s.actionBtn}>
          {a.text}
        </Button>
      ))}
    </div>
  );
}
