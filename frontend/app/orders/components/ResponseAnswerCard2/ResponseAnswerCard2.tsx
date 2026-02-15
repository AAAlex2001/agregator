"use client";

import { useRef, useState } from "react";
import type { OrderDetails, Step2FormData } from "../OrderDetailsModal/types";
import { OrderSummary } from "../ResponseAnswerCard1/sections";
import {
  CommissionConfirm,
  CommentField,
  FileUploadSection,
  HeaderRow,
  InputFields,
} from "./sections";
import styles from "./responseAnswerCard2.module.scss";

interface ResponseAnswerCard2Props {
  order: OrderDetails;
  commission: number;
  onCancel: () => void;
  onSubmit: (data: Step2FormData) => void;
  isSubmitting: boolean;
}

export default function ResponseAnswerCard2({
  order,
  commission,
  onCancel,
  onSubmit,
  isSubmitting,
}: ResponseAnswerCard2Props) {
  const [deadline, setDeadline] = useState("");
  const [costEstimate, setCostEstimate] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedCost = Number(costEstimate.replace(/\s/g, "").replace(",", "."));
  const canSubmit = deadline.trim() !== "" && parsedCost > 0;

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;
    onSubmit({
      deadline,
      costEstimate: Math.round(parsedCost * 100),
      comment,
      files,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      setFiles((prev) => [...prev, ...Array.from(newFiles)]);
    }
    event.target.value = "";
  };

  return (
    <div className={styles.card}>
      <HeaderRow />
      <OrderSummary
        title={order.title}
        customer={order.customer}
        date={order.date}
        badges={order.badges}
        sum={order.sum}
      />
      <CommissionConfirm commission={commission} />
      <InputFields
        deadline={deadline}
        onDeadlineChange={setDeadline}
        costEstimate={costEstimate}
        onCostEstimateChange={setCostEstimate}
      />
      <CommentField comment={comment} onCommentChange={setComment} />
      <FileUploadSection
        files={files}
        onAddFile={() => fileInputRef.current?.click()}
        onRemoveFile={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
