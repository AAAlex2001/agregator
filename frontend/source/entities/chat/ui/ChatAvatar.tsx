"use client";

import { useState } from "react";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { ChatPersonIcon } from "@/source/shared/ui/icons";
import s from "./ChatAvatar.module.scss";

interface ChatAvatarProps {
  src?: string | null;
  alt: string;
}

export function ChatAvatar({ src, alt }: ChatAvatarProps) {
  const [broken, setBroken] = useState(false);
  const imageSrc = src ? resolveFileUrl(src) : "";
  const showImage = Boolean(imageSrc) && !broken;

  return (
    <div className={s.avatar} aria-label={alt}>
      {showImage ? (
        <img
          src={imageSrc}
          alt={alt}
          className={s.image}
          onError={() => setBroken(true)}
        />
      ) : (
        <ChatPersonIcon className={s.fallback} />
      )}
    </div>
  );
}

export function ChatAvatarSpacer() {
  return <div className={s.spacer} />;
}