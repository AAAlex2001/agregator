import { Button } from "@/shared/ui";
import s from "../style.module.scss";

interface Props {
  canCopy: boolean;
  onCopy: () => void;
  onCreate: () => void;
}

export function CreateBar({ canCopy, onCopy, onCreate }: Props) {
  return (
    <div className={s.createBar}>
      {canCopy && <Button variant="outline" onClick={onCopy}>Скопировать заявку</Button>}
      <Button onClick={onCreate}>Создать заказ</Button>
    </div>
  );
}
