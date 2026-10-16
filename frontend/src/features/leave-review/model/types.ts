/** Публикация отзыва и действия после публикации или закрытия формы. */
export interface LeaveReviewOptions {
  publish: (rating: number, comment: string) => Promise<void>;
  successMessage: string;
  onPublished: () => void;
  onClose: () => void;
}
