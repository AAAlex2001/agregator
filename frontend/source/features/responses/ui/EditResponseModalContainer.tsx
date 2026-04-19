"use client";

import { useEffect, useState } from "react";
import { MAX_ATTACH_FILES_COUNT, mergeFilesWithLimits } from "@/shared/lib/fileUploadValidation";
import { useNotifications } from "@/shared/ui/Notifications";
import type { OrderCardData } from "@/source/entities/order";
import type { ResponseCardData } from "@/source/entities/response";
import { EditResponseModal } from "./EditResponseModal";

interface EditResponseSubmitData {
  comment: string;
  costEstimate: number;
  deadline: string;
  files: File[];
  keepFiles: string[];
}

interface ExistingResponseFile {
  key: string;
  url: string;
}

interface EditResponseModalContainerProps {
  response: ResponseCardData | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (formData: EditResponseSubmitData) => void;
}

function buildOrder(response: ResponseCardData): OrderCardData {
  return {
    id: response.orderId,
    publicId: response.orderPublicId,
    title: response.orderTitle,
    customer: response.customer,
    company: response.customer,
    typicalNames: "",
    comment: response.orderComment ?? "",
    date: response.orderDate,
    sum: response.orderSum || response.sum,
    sumAmountRaw: 0,
    commissionAmount: response.orderCommissionAmount,
    commissionAmountRaw: 0,
    deadlineRaw: response.orderDate,
    responsesDeadline: null,
    technicalFiles: response.orderTechSpecFiles,
    badges: response.badges,
    badgesRaw: response.badges.map((badge) => ({ text: badge.text, variant: badge.variant })),
    status: response.rawStatus,
  };
}

function buildCommissionText(response: ResponseCardData): string {
  return [response.commissionText, response.commissionAmount, response.commissionStatus]
    .filter(Boolean)
    .join(" ");
}

export function EditResponseModalContainer({
  response,
  isSubmitting,
  onClose,
  onSubmit,
}: EditResponseModalContainerProps) {
  const { showError } = useNotifications();
  const [deadline, setDeadline] = useState("");
  const [cost, setCost] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingResponseFile[]>([]);

  useEffect(() => {
    setDeadline(response?.rawDeadline ?? "");
    setCost(response && response.rawSumAmount > 0 ? String(response.rawSumAmount / 100) : "");
    setComment(response?.commentText ?? "");
    setFiles([]);
    setExistingFiles(
      response
        ? response.rawTechSpecFiles.map((fileKey, index) => ({
          key: fileKey,
          url: response.techSpecFiles[index] ?? fileKey,
        }))
        : [],
    );
  }, [response?.id]);

  if (!response) {
    return null;
  }

  const handleAddFiles = (nextFiles: FileList | null) => {
    if (!nextFiles || nextFiles.length === 0) {
      return;
    }

    const result = mergeFilesWithLimits(files, Array.from(nextFiles));
    if (result.errorMessage) {
      showError(result.errorMessage);
      return;
    }

    if (existingFiles.length + result.nextFiles.length > MAX_ATTACH_FILES_COUNT) {
      showError(`Можно прикрепить не более ${MAX_ATTACH_FILES_COUNT} файлов`);
      return;
    }

    setFiles(result.nextFiles);
  };

  const handleSubmit = () => {
    if (isSubmitting) {
      return;
    }

    onSubmit({
      comment,
      costEstimate: Math.round(Number(cost) * 100),
      deadline,
      files,
      keepFiles: existingFiles.map((file) => file.key),
    });
  };

  return (
    <EditResponseModal
      dateText={`${response.dateLabel} ${response.date}`.trim()}
      status={response.status}
      statusColor={response.statusColor}
      statusBg={response.statusBg}
      order={buildOrder(response)}
      commissionText={buildCommissionText(response)}
      deadline={deadline}
      cost={cost}
      comment={comment}
      files={files}
      existingFiles={existingFiles}
      canSubmit={deadline.trim() !== "" && Number(cost) > 0}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={handleSubmit}
      onDeadlineChange={setDeadline}
      onCostChange={(value) => setCost(value.replace(/[^0-9]/g, ""))}
      onCommentChange={setComment}
      onAddFiles={handleAddFiles}
      onRemoveFile={(index) => setFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index))}
      onRemoveExistingFile={(index) => setExistingFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index))}
    />
  );
}