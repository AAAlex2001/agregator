"use client";

import { useRef, useState } from "react";
import { Button, Input } from "@/app/components";
import { useNotifications } from "@/app/components/Notifications";
import { mergeFilesWithLimits } from "@/app/utils/fileUploadValidation";
import { BadgeSelector, FileUpload, BADGE_OPTIONS } from "./sections";
import styles from "./createOrderForm.module.scss";

export interface OrderFormData {
  title: string;
  company: string;
  deadline: string;
  responsesDeadline: string;
  budget: string;
  selectedBadges: { text: string; variant: string }[];
  typicalNames: string;
  comment: string;
  files: File[];
  keepFiles?: string[];
}

export interface OrderInitialData {
  id: number;
  title: string;
  company: string;
  deadline: string;
  responsesDeadline: string;
  budget: string;
  selectedBadgeVariants: string[];
  typicalNamesMap: Record<string, string>;
  comment: string;
  existingFiles: string[];
}

interface CreateOrderFormProps {
  onCancel: () => void;
  onSubmit: (data: OrderFormData) => void;
  isSubmitting: boolean;
  initialData?: OrderInitialData;
}

function buildBadgesFromMap(
  selectedVariants: string[],
  typicalNamesMap: Record<string, string>,
): { text: string; variant: string }[] {
  const badges: { text: string; variant: string }[] = [];

  for (const variant of selectedVariants) {
    const opt = BADGE_OPTIONS.find((b) => b.variant === variant);
    if (!opt) continue;

    const namesStr = (typicalNamesMap[variant] ?? "").trim();
    if (namesStr) {
      const names = namesStr.split(",").map((n) => n.trim()).filter(Boolean);
      for (const name of names) {
        badges.push({ text: `${opt.text} ${name}`, variant });
      }
    } else {
      badges.push({ text: opt.text, variant });
    }
  }

  return badges;
}

function buildTypicalNamesString(
  selectedVariants: string[],
  typicalNamesMap: Record<string, string>,
): string {
  const parts: string[] = [];
  for (const variant of selectedVariants) {
    const val = (typicalNamesMap[variant] ?? "").trim();
    if (val) parts.push(val);
  }
  return parts.join(", ");
}

export default function CreateOrderForm({
  onCancel,
  onSubmit,
  isSubmitting,
  initialData,
}: CreateOrderFormProps) {
  const isEdit = Boolean(initialData);
  const { showError } = useNotifications();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [company, setCompany] = useState(initialData?.company ?? "");
  const [deadline, setDeadline] = useState(initialData?.deadline ?? "");
  const [responsesDeadline, setResponsesDeadline] = useState(initialData?.responsesDeadline ?? "");
  const [budget, setBudget] = useState(initialData?.budget ?? "");
  const [selectedBadgeVariants, setSelectedBadgeVariants] = useState<string[]>(
    initialData?.selectedBadgeVariants ?? [],
  );
  const [typicalNamesMap, setTypicalNamesMap] = useState<Record<string, string>>(
    initialData?.typicalNamesMap ?? {},
  );
  const [comment, setComment] = useState(initialData?.comment ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [keepFiles, setKeepFiles] = useState<string[]>(initialData?.existingFiles ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleBadge = (variant: string) => {
    setSelectedBadgeVariants((prev) =>
      prev.includes(variant)
        ? prev.filter((v) => v !== variant)
        : [...prev, variant],
    );
  };

  const handleTypicalNamesChange = (variant: string, value: string) => {
    setTypicalNamesMap((prev) => ({ ...prev, [variant]: value }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    setBudget(val);
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

  const handleRemoveExistingFile = (index: number) => {
    setKeepFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = title.trim().length > 0 && deadline.length > 0 && budget.length > 0;

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;

    const badges = buildBadgesFromMap(selectedBadgeVariants, typicalNamesMap);
    const typicalNames = buildTypicalNamesString(selectedBadgeVariants, typicalNamesMap);

    onSubmit({
      title: title.trim(),
      company: company.trim(),
      deadline,
      responsesDeadline,
      budget,
      selectedBadges: badges,
      typicalNames,
      comment: comment.trim(),
      files,
      keepFiles: isEdit ? keepFiles : undefined,
    });
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{isEdit ? "Редактирование заказа" : "Создание заказа"}</h2>

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
              onChange={handleBudgetChange}
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Приём откликов до</span>
            <input
              type="datetime-local"
              value={responsesDeadline}
              onChange={(e) => setResponsesDeadline(e.target.value)}
              className={styles.nativeInput}
            />
          </div>
          <div className={styles.fieldGroup} />
        </div>
      </div>

      <BadgeSelector
        selected={selectedBadgeVariants}
        onToggle={handleToggleBadge}
        typicalNamesMap={typicalNamesMap}
        onTypicalNamesChange={handleTypicalNamesChange}
      />

      <div className={styles.commentBlock}>
        <span className={styles.fieldLabel}>Комментарий к заказу</span>
        <textarea
          className={styles.textarea}
          placeholder="Опишите детали заказа..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {isEdit && keepFiles.length > 0 && (
        <div className={styles.commentBlock}>
          <span className={styles.fieldLabel}>Текущие файлы</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {keepFiles.map((url, i) => {
              const name = url.split("/").pop() ?? "Файл";
              return (
                <div key={url} style={{ display: "flex", alignItems: "center", gap: 4, background: "#fff8eb", padding: "4px 8px", borderRadius: 8, fontSize: 13 }}>
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingFile(i)}
                    style={{ border: "none", background: "none", cursor: "pointer", color: "#f73c1d", fontSize: 16, padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <FileUpload
        files={files}
        onAddFile={() => {
          if (!fileInputRef.current) return;
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
          {isEdit ? "Сохранить" : "Создать заказ"}
        </Button>
      </div>
    </div>
  );
}
