"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { OrderCardData } from "@/source/entities/order";
import { ExpertiseCodesView } from "@/source/shared/ui/ExpertiseCodesModal";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import Button from "@/source/shared/ui/Button";
import { useSession } from "@/source/features/session";
import { hasOrderDetails } from "../../model/orderDetails";
import { useCreateOrderForm } from "../../model/useCreateOrderForm";
import type { DocumentsFormState } from "@/source/entities/order";
import type { OrderFormValues } from "../../model/orderForm";
import { BadgeSection } from "./sections/BadgeSection";
import { CommentSection } from "./sections/CommentSection";
import { DetailsSection } from "./sections/DetailsSection";
import { DirectionDetailsSection } from "./sections/DirectionDetailsSection";
import { ExpertsMapSection } from "./sections/ExpertsMapSection";
import { FilesSection } from "./sections/FilesSection";
import { FormActions } from "./sections/FormActions";
import { RequirementsSection } from "./sections/RequirementsSection";
import { WorkTypeSection } from "./sections/WorkTypeSection";
import { OrderLivePreview } from "./OrderLivePreview";
import s from "./CreateOrderForm.module.scss";

export interface CreateOrderSubmitOptions {
  notifyResponders: boolean;
}

interface Props {
  onCancel: () => void;
  onSubmit: (
    values: OrderFormValues,
    documents: DocumentsFormState,
    options: CreateOrderSubmitOptions,
  ) => void;
  isSubmitting: boolean;
  editTarget?: OrderCardData;
  copyTemplate?: OrderCardData;
  onCopy: () => void;
}

type View = "form" | "help";

const transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

export function CreateOrderForm({ onCancel, onSubmit, isSubmitting, editTarget, copyTemplate, onCopy }: Props) {
  const { isEdit, state, dispatch, submit, setSingle, addOther } = useCreateOrderForm({
    editTarget,
    copyTemplate,
    onSubmit,
  });
  const [view, setView] = useState<View>("form");
  const { user } = useSession();
  const isExpertise = state.workType === "EXPERTISE";

  if (!isEdit && user !== null && (user.directions ?? []).length === 0) {
    return (
      <div className={s.shell}>
        <div className={s.form}>
          <h2 className={s.title}>Создание заказа</h2>
          <p className={s.noDirectionsText}>
            У вас не выбрано ни одного направления работы. Перейдите в настройки профиля и отметьте
            направления, по которым размещаете заказы, — после этого форма станет доступна.
          </p>
          <Button href="/settings" variant="chat" size="md">
            Перейти в настройки профиля
          </Button>
          <Link href="/customer/orders" className={s.noDirectionsBack}>
            Вернуться к заказам
          </Link>
        </div>
      </div>
    );
  }

  const shellClassName = [
    s.shell,
    view === "help" ? s.shellWide : "",
    view === "form" ? s.shellWithPreview : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={shellClassName}>
      <AnimatePresence mode="wait" initial={false}>
        {view === "form" ? (
          <motion.div
            key="form"
            className={s.layout}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={transition}
          >
            <form className={s.form} onSubmit={submit}>
              <h2 className={s.title}>{isEdit ? "Редактирование заказа" : "Создание заказа"}</h2>

              <DetailsSection state={state} dispatch={dispatch} />

              <WorkTypeSection state={state} dispatch={dispatch} />

              {isExpertise && <RequirementsSection state={state} dispatch={dispatch} />}

              {hasOrderDetails(state.workType) && (
                <DirectionDetailsSection state={state} dispatch={dispatch} />
              )}

              <ExpertsMapSection workType={state.workType} />

              {isExpertise && (
                <BadgeSection state={state} dispatch={dispatch} onShowHelp={() => setView("help")} />
              )}

              <CommentSection state={state} dispatch={dispatch} />

              <FilesSection
                documents={state.documents}
                onSetSingle={setSingle}
                onRemoveSingleExisting={(category) => dispatch({ type: "docRemoveSingleExisting", category })}
                onAddOther={addOther}
                onRemoveOtherNew={(index) => dispatch({ type: "docRemoveOtherNew", index })}
                onRemoveOtherExisting={(index) => dispatch({ type: "docRemoveOtherExisting", index })}
              />

              <div className={s.previewInline}>
                <OrderLivePreview state={state} />
              </div>

              {isEdit && (
                <div className={s.notifyRow}>
                  <Checkbox
                    id="order-notify-responders"
                    checked={state.notifyResponders}
                    onChange={(value) => dispatch({ type: "notifyResponders", value })}
                  >
                    Оповестить участников тендера об изменениях
                  </Checkbox>
                </div>
              )}

              <FormActions
                isEdit={isEdit}
                isSubmitting={isSubmitting}
                onCancel={onCancel}
                onCopy={onCopy}
              />
            </form>
            <div className={s.previewSide}>
              <OrderLivePreview state={state} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="help"
            className={s.form}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={transition}
          >
            <ExpertiseCodesView onBack={() => setView("form")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
