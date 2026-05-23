"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { OrderCardData } from "@/source/entities/order";
import { ExpertiseCodesView } from "@/source/shared/ui/ExpertiseCodesModal";
import { useCreateOrderForm } from "../../model/useCreateOrderForm";
import type { DocumentsFormState } from "../../model/formFiles";
import type { OrderFormValues } from "../../model/schema";
import { BadgeSection } from "./sections/BadgeSection";
import { CommentSection } from "./sections/CommentSection";
import { DetailsSection } from "./sections/DetailsSection";
import { FilesSection } from "./sections/FilesSection";
import { FormActions } from "./sections/FormActions";
import { RequirementsSection } from "./sections/RequirementsSection";
import { OrderLivePreview } from "./OrderLivePreview";
import s from "./CreateOrderForm.module.scss";

interface Props {
  onCancel: () => void;
  onSubmit: (values: OrderFormValues, documents: DocumentsFormState) => void;
  isSubmitting: boolean;
  editTarget?: OrderCardData;
}

type View = "form" | "help";

const transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

export function CreateOrderForm({ onCancel, onSubmit, isSubmitting, editTarget }: Props) {
  const formState = useCreateOrderForm({ editTarget, onSubmit });
  const [view, setView] = useState<View>("form");

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
            <form className={s.form} onSubmit={formState.submit}>
              <h2 className={s.title}>{formState.isEdit ? "Редактирование заказа" : "Создание заказа"}</h2>

              <DetailsSection form={formState.form} />

              <RequirementsSection form={formState.form} />

              <CommentSection form={formState.form} />

              <FilesSection
                documents={formState.documents}
                onSetSingle={formState.setSingle}
                onRemoveSingleExisting={formState.removeSingleExisting}
                onAddOther={formState.addOther}
                onRemoveOtherNew={formState.removeOtherNew}
                onRemoveOtherExisting={formState.removeOtherExisting}
              />

              <BadgeSection
                form={formState.form}
                onShowHelp={() => setView("help")}
              />

              <div className={s.previewInline}>
                <OrderLivePreview form={formState.form} documents={formState.documents} />
              </div>

              <FormActions
                isEdit={formState.isEdit}
                isSubmitting={isSubmitting}
                onCancel={onCancel}
              />
            </form>
            <div className={s.previewSide}>
              <OrderLivePreview form={formState.form} documents={formState.documents} />
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
