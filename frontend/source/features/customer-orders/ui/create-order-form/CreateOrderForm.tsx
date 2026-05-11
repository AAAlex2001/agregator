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

  return (
    <div className={`${s.shell} ${view === "help" ? s.shellWide : ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        {view === "form" ? (
          <motion.form
            key="form"
            className={s.form}
            onSubmit={formState.submit}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={transition}
          >
            <h2 className={s.title}>{formState.isEdit ? "Редактирование заказа" : "Создание заказа"}</h2>

            <DetailsSection form={formState.form} />

            <BadgeSection
              form={formState.form}
              onShowHelp={() => setView("help")}
            />

            <CommentSection form={formState.form} />

            <FilesSection
              documents={formState.documents}
              onSetSingle={formState.setSingle}
              onRemoveSingleExisting={formState.removeSingleExisting}
              onAddOther={formState.addOther}
              onRemoveOtherNew={formState.removeOtherNew}
              onRemoveOtherExisting={formState.removeOtherExisting}
            />

            <FormActions
              isEdit={formState.isEdit}
              isSubmitting={isSubmitting}
              onCancel={onCancel}
            />
          </motion.form>
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
