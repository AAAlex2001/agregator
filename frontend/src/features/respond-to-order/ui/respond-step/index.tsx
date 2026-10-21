"use client";

import type { ReactNode } from "react";
import { OrderSummaryPanel } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { ResponseCommentFields, ResponseTermsFields } from "@/entities/response";
import type { useRespondForm } from "../../model/use-respond-form";
import { CompanyStep } from "../company-step";
import { ConditionsStep } from "../conditions-step";
import styles from "./style.module.scss";

/** Заказ, обсуждение его условий и состояние отклика. */
interface RespondStepProps {
  order: OrderListItem;
  questions: ReactNode;
  form: ReturnType<typeof useRespondForm>;
}

/** Поля текущего шага отклика. */
export function RespondStepFields({ order, questions, form }: RespondStepProps) {
  switch (form.keys[form.steps.step]) {
    case "conditions":
      return (
        <ConditionsStep
          order={order}
          questions={questions}
        />
      );
    case "terms":
      return (
        <div className={styles.terms}>
          <OrderSummaryPanel order={order} />
          <ResponseTermsFields
            offer={form.offer}
            dispatch={form.dispatch}
          />
        </div>
      );
    case "company":
      return (
        <CompanyStep
          choice={form.choice}
          onChange={form.changeCompany}
        />
      );
    case "comment":
      return (
        <ResponseCommentFields
          comment={form.offer.comment}
          files={form.files}
          dispatch={form.dispatch}
          onAddFiles={form.addFiles}
        />
      );
  }
}