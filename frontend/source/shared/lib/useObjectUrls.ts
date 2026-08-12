"use client";

import { useEffect, useState } from "react";

export function useObjectUrls(files: File[] | undefined): string[] {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!files?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- blob-URL создаются с побочным эффектом, их место в эффекте
      setUrls([]);
      return;
    }
    const next = files.map((file) => URL.createObjectURL(file));
    setUrls(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  return urls;
}
