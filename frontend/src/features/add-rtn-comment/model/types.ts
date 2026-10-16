/** Адресат ответа и действие после появления комментария в обсуждении. */
export interface AddRtnCommentOptions {
  parentId: number | null;
  onAdded?: () => void;
}
