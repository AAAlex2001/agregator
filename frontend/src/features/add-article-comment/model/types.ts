/** Родитель ответа и действие после успешной отправки комментария. */
export interface AddArticleCommentOptions {
  parentId: number | null;
  onAdded?: () => void;
}
