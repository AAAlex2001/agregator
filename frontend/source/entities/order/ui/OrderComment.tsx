import { DiffValue } from "@/source/shared/ui/DiffValue";
import s from "./OrderComment.module.scss";

interface OrderCommentProps {
  title: string;
  text: string;
  previous?: string | null;
}

export function OrderComment({ title, text, previous }: OrderCommentProps) {
  return (
    <div className={s.row}>
      <span className={s.title}>{title}</span>
      <span className={s.text}>
        <DiffValue previous={previous} current={text} />
      </span>
    </div>
  );
}
