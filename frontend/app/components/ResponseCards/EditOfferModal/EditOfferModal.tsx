"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/Button";
import {
  StatusHeader,
  OrderSection,
  CommissionInfo,
  CardInput,
} from "../sections";
import type { ResponseBadge } from "../types";
import styles from "./editOfferModal.module.scss";

export interface EditOfferFormData {
  deadline: string;
  costEstimate: string;
  comment: string;
  files: File[];
}

export interface EditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditOfferFormData) => void;

  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusMessage?: string;

  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;

  commissionText: string;
  commissionAmount: string;
  commissionStatus?: string;

  initialDeadline?: string;
  initialCostEstimate?: string;
  initialComment?: string;

  existingFiles?: string[];

  hintText?: string;
  submitBtnText?: string;
}

const EditOfferModal = ({
  isOpen,
  onClose,
  onSubmit,
  dateLabel,
  date,
  status,
  statusColor,
  statusBg,
  statusMessage,
  orderTitle,
  customer,
  orderDate,
  badges,
  sum,
  commissionText,
  commissionAmount,
  commissionStatus,
  initialDeadline = "",
  initialCostEstimate = "",
  initialComment = "",
  existingFiles = [],
  hintText = "Обратите внимание, что при изменении стоимости работ сумма взноса будет пересчитана автоматически.",
  submitBtnText = "Отправить изменения",
}: EditOfferModalProps) => {
  const [deadline, setDeadline] = useState(initialDeadline);
  const [costEstimate, setCostEstimate] = useState(initialCostEstimate);
  const [comment, setComment] = useState(initialComment);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDeadline(initialDeadline);
      setCostEstimate(initialCostEstimate);
      setComment(initialComment);
      setFiles([]);
    }
  }, [isOpen, initialDeadline, initialCostEstimate, initialComment]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = () => {
    onSubmit({ deadline, costEstimate, comment, files });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <StatusHeader
            dateLabel={dateLabel}
            date={date}
            status={status}
            statusColor={statusColor}
            statusBg={statusBg}
            statusMessage={statusMessage}
          />

          <div className={styles.innerContent}>
            <OrderSection
              orderTitle={orderTitle}
              customer={customer}
              orderDate={orderDate}
              badges={badges}
              sum={sum}
            />

            <div className={styles.commission}>
              <CommissionInfo
                commissionText={commissionText}
                commissionAmount={commissionAmount}
                commissionStatus={commissionStatus}
                highlighted
              />

              {/* Editable fields */}
              <div className={styles.fieldsArea}>
                <div className={styles.fieldLabels}>
                  <span className={styles.fieldLabel}>Укажите ваши сроки</span>
                  <span className={styles.fieldLabel}>
                    Ваша оценка стоимости работ
                  </span>
                </div>
                <div className={styles.fieldInputs}>
                  <CardInput
                    value={deadline}
                    onChange={setDeadline}
                    placeholder="дд.мм.гггг"
                  />
                  <CardInput
                    value={costEstimate}
                    onChange={setCostEstimate}
                    placeholder="0"
                  />
                </div>
                {hintText && (
                  <div className={styles.hint}>
                    <span className={styles.hintText}>{hintText}</span>
                  </div>
                )}
              </div>

              {/* Comment textarea */}
              <div className={styles.commentArea}>
                <span className={styles.commentLabel}>
                  Комментарий для заказчика
                </span>
                <textarea
                  className={styles.commentTextarea}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section: existing files + upload + submit */}
        <div className={styles.bottomSection}>
          {/* Existing tech spec files */}
          {existingFiles.length > 0 && (
            <div className={styles.existingFiles}>
              <span className={styles.existingFilesTitle}>
                Техническое задание:
              </span>
              {existingFiles.map((file, index) => (
                <a key={index} href="#" className={styles.existingFileLink}>
                  {file}
                </a>
              ))}
            </div>
          )}

          <div className={styles.uploadAndSubmit}>
            {/* File upload thumbnails */}
            <div className={styles.fileUpload}>
              <span className={styles.fileUploadTitle}>Ваши файлы:</span>
              <div className={styles.fileThumbnails}>
                {files.map((file, index) => (
                  <div key={index} className={styles.fileThumbnail}>
                    <button
                      className={styles.fileRemove}
                      onClick={() => removeFile(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <label className={styles.fileAddBtn}>
                  <input
                    type="file"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                    multiple
                  />
                  +
                </label>
              </div>
            </div>

            {/* Submit button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              className={styles.submitBtn}
            >
              {submitBtnText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOfferModal;
