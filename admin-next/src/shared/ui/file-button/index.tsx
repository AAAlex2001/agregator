"use client";

import { useRef, type ReactNode } from "react";
import Button from "@/shared/ui/button";

type FileButtonProps = {
  children: ReactNode;
  onSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  loading?: boolean;
  size?: "md" | "sm";
};

/** Кнопка, которая открывает выбор файлов и отдаёт выбранные в onSelect. */
const FileButton = ({ children, onSelect, accept, multiple, loading, size }: FileButtonProps) => {
  const input = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button variant="outline" size={size} loading={loading} onClick={() => input.current?.click()}>
        {children}
      </Button>

      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          onSelect(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
    </>
  );
};

export default FileButton;
