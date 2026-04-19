"use client";

import { useEffect, useState } from "react";
import { AddReviewModal } from "./AddReviewModal";

interface Props {
  isOpen: boolean;
  customerName: string;
  orderTitle: string;
  expertName: string;
  onClose: () => void;
  onSubmit: (payload: { rating: number; comment: string }) => Promise<void>;
}

export function AddReviewModalContainer({
  isOpen,
  customerName,
  orderTitle,
  expertName,
  onClose,
  onSubmit,
}: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const handleSubmit = async () => {
    if (isSubmitting || rating < 1) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ rating, comment: comment.trim() });
      setRating(0);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AddReviewModal
      isOpen={isOpen}
      customerName={customerName}
      orderTitle={orderTitle}
      expertName={expertName}
      rating={rating}
      comment={comment}
      isSubmitting={isSubmitting}
      onClose={handleClose}
      onRatingChange={setRating}
      onCommentChange={setComment}
      onSubmit={() => void handleSubmit()}
    />
  );
}