"use client";

import { useEffect, useState } from "react";

export function useObjectUrls(files: File[] | undefined): string[] {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!files?.length) {
      setUrls([]);
      return;
    }
    const next = files.map((file) => URL.createObjectURL(file));
    setUrls(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  return urls;
}
