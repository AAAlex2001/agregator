"use client";

import { useRef, useState } from "react";
import { Button, Input } from "@/app/components";
import { useNotifications } from "@/app/components/Notifications";
import { mergeFilesWithLimits } from "@/app/utils/fileUploadValidation";
import { BadgeSelector, FileUpload, BADGE_OPTIONS } from "./sections";
import styles from "./createOrderForm.module.scss";

interface CreateOrderFormProps {
  onCancel: () => void;
  onSubmit: (data: {
    title: string;
    company: string;
    deadline: string;
    budget: string;
    selectedBadges: { text: string; variant: string }[];
    typicalNames: string;
    comment: string;
    files: File[];
  }) => void;
  isSubmitting: boolean;
}

export default function CreateOrderForm({
  onCancel,
  onSubmit,
  isSubmitting,
}: CreateOrderFormProps) {
  const { showError } = useNotifications();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedBadgeVariants, setSelectedBadgeVariants] = useState<string[]>([]);
  const [typicalNames, setTypicalNames] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleBadge = (variant: string) => {
    setSelectedBadgeVariants((prev) =>
      prev.includes(variant)
        ? prev.filter((v) => v !== variant)
        : [...prev, variant],
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.currentTarget.files
      ? Array.from(event.currentTarget.files)
      : [];

    if (selectedFiles.length > 0) {
      setFiles((prev) => {
        const result = mergeFilesWithLimits(prev, selectedFiles);
        if (result.errorMessage) {
          showError(result.errorMessage);
          return prev;
        }
        return result.nextFiles;
      });
    }

    event.currentTarget.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = title.trim().length > 0 && deadline.length > 0 && budget.length > 0;

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;

    const badges = selectedBadgeVariants.map((variant) => {
      const opt = BADGE_OPTIONS.find((b) => b.variant === variant);
      return { text: opt?.text ?? "", variant };
    });

    onSubmit({
      title: title.trim(),
      company: company.trim(),
      deadline,
      budget,
      selectedBadges: badges,
      typicalNames: typicalNames.trim(),
      comment: comment.trim(),
      files,
    });
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Создание заказа</h2>

      <div className={styles.fieldsBlock}>
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Название заказа</span>
            <Input
              variant="text"
              active
              placeholder="Введите название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.formInput}
            />
          </div>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Компания</span>
            <Input
              variant="text"
              active
              placeholder="Название компании"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Срок выполнения</span>
            <Input
              type="date"
              variant="text"
              active
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={styles.formInput}
            />
          </div>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Бюджет проекта, ₽</span>
            <Input
              variant="text"
              active
              placeholder="Сумма в рублях"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={styles.formInput}
            />
          </div>
        </div>
      </div>

      <BadgeSelector
        selected={selectedBadgeVariants}
        onToggle={handleToggleBadge}
      />

      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>Укажите типовые наименования</span>
        <Input
          variant="text"
          active
          placeholder="Типовые наименования"
          value={typicalNames}
          onChange={(e) => setTypicalNames(e.target.value)}
          className={styles.formInput}
        />
      </div>

      <div className={styles.commentBlock}>
        <span className={styles.fieldLabel}>Комментарий к заказу</span>
        <textarea
          className={styles.textarea}
          placeholder="Опишите детали заказа..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <FileUpload
        files={files}
        onAddFile={() => {
          if (!fileInputRef.current) {
            return;
          }
          fileInputRef.current.value = "";
          fileInputRef.current.click();
        }}
        onRemoveFile={handleRemoveFile}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          padding: 0,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        tabIndex={-1}
        onChange={handleFileChange}
      />

      <div className={styles.buttonsRow}>
        <Button
          variant="transparent"
          size="md"
          fullWidth
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button
          variant="primary"
          size="md"
          fullWidth
          className={styles.submitButton}
          disabled={!canSubmit}
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          Создать заказ
        </Button>
      </div>
    </div>
  );
}
