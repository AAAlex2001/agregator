"use client";

import { useState } from "react";
import { MAX_ATTACH_FILES_COUNT, mergeFilesWithLimits } from "@/source/shared/lib/fileUploadValidation";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { OrderCardData } from "@/source/entities/order";
import type { ResponseCardData, VatKind } from "@/source/entities/response";
import { EditResponseModal } from "./EditResponseModal";

interface EditResponseSubmitData {
  comment: string;
  costEstimate: number;
  startDate: string;
  deadline: string;
  vatKind: VatKind;
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
    customerId: response.orderCustomerId,
    title: response.orderTitle,
    customer: response.customer,
    customerInn: response.customerInn,
    company: response.customer,
    comment: response.orderComment ?? "",
    startDate: response.orderStartDate,
    date: response.orderDate,
    createdAtDisplay: "",
    sum: response.orderSum || response.sum,
    sumAmountRaw: 0,
    startDateRaw: "",
    deadlineRaw: response.orderDate,
    responsesDeadline: null,
    requiresExpert: true,
    requiresLicense: true,
    workType: "EXPERTISE",
    details: null,
    documents: response.orderDocuments,
    badges: response.badges,
    badgesRaw: response.badges.map((badge) => ({ text: badge.text, variant: badge.variant })),
    status: response.rawStatus,
    assignedExpertName: "",
    executorName: "",
    executorAvatarUrl: null,
    executorRating: null,
    executorReviewCount: 0,
    executorPublicId: "",
    executorProposedSum: "",
    executorProposedStartDate: "",
    executorProposedDeadline: "",
    executorComment: "",
    executorFiles: [],
    acceptedResponseId: null,
    customerHasReview: false,
  };
}

export function EditResponseModalContainer({
  response,
  isSubmitting,
  onClose,
  onSubmit,
}: EditResponseModalContainerProps) {
  if (!response) return null;
  return (
    <EditResponseForm
      key={response.id}
      response={response}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

interface EditResponseFormProps {
  response: ResponseCardData;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (formData: EditResponseSubmitData) => void;
}

function EditResponseForm({ response, isSubmitting, onClose, onSubmit }: EditResponseFormProps) {
  const { showError } = useNotifications();
  const [startDate, setStartDate] = useState(response.rawStartDate);
  const [deadline, setDeadline] = useState(response.rawDeadline);
  const [cost, setCost] = useState(response.rawSumAmount > 0 ? String(response.rawSumAmount / 100) : "");
  const [comment, setComment] = useState(response.commentText);
  const [vatKind, setVatKind] = useState<VatKind>(response.vatKind);
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingResponseFile[]>(() =>
    response.rawTechSpecFiles.map((fileKey, index) => ({
      key: fileKey,
      url: response.techSpecFiles[index] ?? fileKey,
    })),
  );

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
      startDate,
      deadline,
      vatKind,
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
      startDate={startDate}
      deadline={deadline}
      cost={cost}
      comment={comment}
      vatKind={vatKind}
      files={files}
      existingFiles={existingFiles}
      canSubmit={deadline.trim() !== "" && Number(cost) > 0}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={handleSubmit}
      onStartDateChange={setStartDate}
      onDeadlineChange={setDeadline}
      onCostChange={(value) => setCost(value.replace(/[^0-9]/g, ""))}
      onCommentChange={setComment}
      onVatKindChange={setVatKind}
      onAddFiles={handleAddFiles}
      onRemoveFile={(index) => setFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index))}
      onRemoveExistingFile={(index) => setExistingFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index))}
    />
  );
}
