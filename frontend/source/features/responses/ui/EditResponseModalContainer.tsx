"use client";

import { useState } from "react";
import type { OrderSummary } from "@/source/entities/order";
import { useBidFiles, type ResponseCardData, type VatKind } from "@/source/entities/response";
import { getFileDisplayName } from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
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

interface EditResponseModalContainerProps {
  response: ResponseCardData | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (formData: EditResponseSubmitData) => void;
}

function orderSummary(response: ResponseCardData): OrderSummary {
  return {
    id: response.orderId,
    title: response.orderTitle,
    customer: response.customer,
    customerInn: response.customerInn,
    startDate: response.orderStartDate,
    date: response.orderDate,
    sum: response.orderSum || response.sum,
    responsesDeadline: null,
    createdAtDisplay: "",
    status: response.rawStatus,
    workType: "EXPERTISE",
    badges: response.badges,
    previousTitle: null,
    previousSum: null,
    previousDeadline: null,
    previousBadges: null,
  };
}

export function EditResponseModalContainer({ response, isSubmitting, onClose, onSubmit }: EditResponseModalContainerProps) {
  if (!response) return null;
  return <EditResponseForm key={response.id} response={response} isSubmitting={isSubmitting} onClose={onClose} onSubmit={onSubmit} />;
}

interface EditResponseFormProps {
  response: ResponseCardData;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (formData: EditResponseSubmitData) => void;
}

function EditResponseForm({ response, isSubmitting, onClose, onSubmit }: EditResponseFormProps) {
  const [startDate, setStartDate] = useState(response.rawStartDate);
  const [deadline, setDeadline] = useState(response.rawDeadline);
  const [cost, setCost] = useState(response.rawSumAmount > 0 ? String(response.rawSumAmount / 100) : "");
  const [comment, setComment] = useState(response.commentText);
  const [vatKind, setVatKind] = useState<VatKind>(response.vatKind);
  const [keepFiles, setKeepFiles] = useState(response.rawTechSpecFiles);
  const bid = useBidFiles();

  const existingItems = keepFiles.map((key) => ({
    id: key,
    name: getFileDisplayName(key),
    url: resolveFileUrl(key),
    onRemove: () => setKeepFiles(keepFiles.filter((item) => item !== key)),
  }));

  return (
    <EditResponseModal
      dateText={`${response.dateLabel} ${response.date}`.trim()}
      status={response.status}
      statusColor={response.statusColor}
      statusBg={response.statusBg}
      order={orderSummary(response)}
      startDate={startDate}
      deadline={deadline}
      cost={cost}
      comment={comment}
      vatKind={vatKind}
      fileItems={[...existingItems, ...bid.items]}
      canSubmit={deadline.trim() !== "" && Number(cost) > 0}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={() => {
        if (isSubmitting) return;
        onSubmit({ comment, costEstimate: Math.round(Number(cost) * 100), startDate, deadline, vatKind, files: bid.files, keepFiles });
      }}
      onStartDateChange={setStartDate}
      onDeadlineChange={setDeadline}
      onCostChange={(value) => setCost(value.replace(/\D/g, ""))}
      onCommentChange={setComment}
      onVatKindChange={setVatKind}
      onAddFiles={bid.add}
    />
  );
}
