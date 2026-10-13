"use client";

import { useState } from "react";
import Link from "next/link";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import Button from "@/source/shared/ui/Button";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { ExpertiseCodesView } from "@/source/shared/ui/ExpertiseCodesModal";
import { useOrderForm } from "../model/useOrderForm";
import { BadgesField } from "./BadgesField";
import { CommentField } from "./CommentField";
import { DirectionFields } from "./DirectionFields";
import { ExpertsMapSection } from "./ExpertsMapSection";
import { FilesSection } from "./FilesSection";
import { FormActions } from "./FormActions";
import { MainFields } from "./MainFields";
import { OrderLivePreview } from "./OrderLivePreview";
import { RequirementsField } from "./RequirementsField";
import { WorkTypeField } from "./WorkTypeField";
import s from "./CreateOrderForm.module.scss";

interface CreateOrderFormProps {
  editTarget?: OrderCardData;
  copyTemplate?: OrderCardData;
  onCancel: () => void;
  onCopy: () => void;
  onSaved: () => void;
}

/** Создание или правка заказа с живым предпросмотром карточки. */
export function CreateOrderForm({ editTarget, copyTemplate, onCancel, onCopy, onSaved }: CreateOrderFormProps) {
  const { user } = useSession();
  const { isEdit, state, dispatch, isSaving, addFile, addOtherFiles, submit } = useOrderForm({ editTarget, copyTemplate, onSaved });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const isExpertise = state.workType === "EXPERTISE";

  if (!isEdit && user && user.directions.length === 0) {
    return (
      <div className={s.shell}>
        <div className={s.form}>
          <h2 className={s.title}>Создание заказа</h2>
          <p className={s.noDirectionsText}>
            У вас не выбрано ни одного направления работы. Перейдите в настройки профиля и отметьте направления, по которым размещаете заказы, —
            после этого форма станет доступна.
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

  if (isHelpOpen) {
    return (
      <div className={s.shellWide}>
        <div className={s.form}>
          <ExpertiseCodesView onBack={() => setIsHelpOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className={s.shellWithPreview}>
      <div className={s.layout}>
        <form className={s.form} onSubmit={submit}>
          <h2 className={s.title}>{isEdit ? "Редактирование заказа" : "Создание заказа"}</h2>
          <MainFields state={state} dispatch={dispatch} />
          <WorkTypeField state={state} dispatch={dispatch} />
          {isExpertise && <RequirementsField state={state} dispatch={dispatch} />}
          {state.details && (
            <DirectionFields workType={state.workType} value={state.details} onChange={(value) => dispatch({ type: "details", value })} />
          )}
          <ExpertsMapSection workType={state.workType} />
          {isExpertise && <BadgesField state={state} dispatch={dispatch} onShowHelp={() => setIsHelpOpen(true)} />}
          <CommentField state={state} dispatch={dispatch} />
          <FilesSection state={state} dispatch={dispatch} onAddFile={addFile} onAddOtherFiles={addOtherFiles} />
          <div className={s.previewInline}>
            <OrderLivePreview state={state} />
          </div>
          {isEdit && (
            <div className={s.notifyRow}>
              <Checkbox id="order-notify-responders" checked={state.notifyResponders} onChange={(value) => dispatch({ type: "notifyResponders", value })}>
                Оповестить участников тендера об изменениях
              </Checkbox>
            </div>
          )}
          <FormActions isEdit={isEdit} isSaving={isSaving} onCancel={onCancel} onCopy={onCopy} />
        </form>
        <div className={s.previewSide}>
          <OrderLivePreview state={state} />
        </div>
      </div>
    </div>
  );
}
