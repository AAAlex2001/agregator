import type { StepProps } from "./types";
import base from "./sectionBase.module.scss";
import s from "./commentSection.module.scss";

export function CommentSection({ state, dispatch }: StepProps) {
  return (
    <section className={base.section}>
      <span className={base.label}>Комментарий к заказу</span>
      <textarea
        className={s.textarea}
        placeholder="Опишите детали заказа..."
        value={state.comment}
        onChange={(e) => dispatch({ type: "set", key: "comment", value: e.target.value })}
      />
    </section>
  );
}
