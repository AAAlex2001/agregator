"use client";

import type { OrderCardData } from "@/source/entities/order";
import { useCreateOrderForm } from "../../model/useCreateOrderForm";
import type { OrderFormValues } from "../../model/schema";
import { BadgeSection } from "./sections/BadgeSection";
import { CommentSection } from "./sections/CommentSection";
import { DetailsSection } from "./sections/DetailsSection";
import { FilesSection } from "./sections/FilesSection";
import { FormActions } from "./sections/FormActions";
import s from "./CreateOrderForm.module.scss";

interface Props {
  onCancel: () => void;
  onSubmit: (values: OrderFormValues, files: File[], keepFiles?: string[]) => void;
  isSubmitting: boolean;
  editTarget?: OrderCardData;
}

export function CreateOrderForm({ onCancel, onSubmit, isSubmitting, editTarget }: Props) {
  const formState = useCreateOrderForm({ editTarget, onSubmit });

  return (
    <form className={s.form} onSubmit={formState.submit}>
      <h2 className={s.title}>{formState.isEdit ? "Редактирование заказа" : "Создание заказа"}</h2>

      <DetailsSection form={formState.form} />

      <BadgeSection
        options={formState.badgeOptions}
        selectedBadgeVariants={formState.selectedBadgeVariants}
        typicalNamesMap={formState.typicalNamesMap}
        onToggleBadge={formState.toggleBadge}
        onChangeTypicalNames={formState.setTypicalNames}
      />

      <CommentSection form={formState.form} />

      <FilesSection
        existingFiles={formState.keepFiles}
        files={formState.files}
        dropzoneOptions={formState.dropzoneOptions}
        onRemoveFile={formState.removeFile}
        onRemoveExistingFile={formState.removeExistingFile}
      />

      <FormActions
        isEdit={formState.isEdit}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
}