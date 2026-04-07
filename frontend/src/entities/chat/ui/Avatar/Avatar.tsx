"use client";

import { useState } from "react";
import { ProfileIcon } from "@/shared/ui/icons";
import styles from "./avatar.module.scss";

interface AvatarProps {
  src?: string | null;
  alt: string;
}

export function Avatar({ src, alt }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;

  return (
    <div className={styles.avatar} aria-label={alt}>
      {showImage ? (
        <img
          src={src as string}
          alt={alt}
          className={styles.image}
          onError={() => setBroken(true)}
        />
      ) : (
        <ProfileIcon className={styles.fallback} />
      )}
    </div>
  );
}

export function AvatarSpacer() {
  return <div className={styles.spacer} />;
}
