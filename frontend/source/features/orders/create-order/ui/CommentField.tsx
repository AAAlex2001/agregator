import type { OrderFormProps } from "../model/types";
import { FormSection } from "./FormSection";
import s from "./CommentField.module.scss";

export function CommentField({ state, dispatch }: OrderFormProps) {
  return (
    <FormSection label="Комментарий к заказу">
      <textarea
        className={s.textarea}
        placeholder="Опишите детали заказа..."
        value={state.comment}
        onChange={(event) => dispatch({ type: "field", field: "comment", value: event.target.value })}
      />
    </FormSection>
  );
}
