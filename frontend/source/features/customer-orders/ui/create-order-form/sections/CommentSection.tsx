import type { UseFormReturn } from "react-hook-form";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./commentSection.module.scss";

interface Props {
  form: UseFormReturn<OrderFormValues>;
}

export function CommentSection({ form }: Props) {
  return (
    <section className={base.section}>
      <span className={base.label}>Комментарий к заказу</span>
      <textarea className={s.textarea} placeholder="Опишите детали заказа..." {...form.register("comment")} />
    </section>
  );
}