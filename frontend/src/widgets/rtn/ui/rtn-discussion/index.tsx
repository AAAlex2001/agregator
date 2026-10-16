"use client";

import { RtnCommentsProvider } from "@/entities/rtn";
import type { RtnComment } from "@/entities/rtn";
import { RtnDiscussionContent } from "../rtn-discussion-content";

/** Разъяснение и комментарии, загруженные для серверного отображения. */
interface RtnDiscussionProps {
  clarificationId: number;
  initialComments: RtnComment[];
}

/** Подключает обсуждение и начинает новое состояние при переходе к другому разъяснению. */
export function RtnDiscussion({
  clarificationId,
  initialComments,
}: RtnDiscussionProps) {
  return (
    <RtnCommentsProvider
      key={clarificationId}
      clarificationId={clarificationId}
      initialComments={initialComments}
    >
      <RtnDiscussionContent />
    </RtnCommentsProvider>
  );
}
