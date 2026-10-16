"use client";

import { ShareIcon } from "@/shared/ui/icons";
import { ToolButton } from "@/shared/ui/tool-button";
import { useCopyPostLink } from "../../model/use-copy-post-link";

/** Публикация, ссылку на которую копирует кнопка. */
interface CopyPostLinkButtonProps {
  postId: number;
}

/** Кнопка «Поделиться»: копирует ссылку на публикацию. */
export function CopyPostLinkButton({ postId }: CopyPostLinkButtonProps) {
  const copyLink = useCopyPostLink(postId);

  return (
    <ToolButton
      label="Скопировать ссылку"
      onClick={copyLink}
    >
      <ShareIcon />
    </ToolButton>
  );
}
