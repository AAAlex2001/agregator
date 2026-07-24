"use client";

import { useState } from "react";
import { uploadPdf } from "./api";

export function PdfUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const pick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        onChange(await uploadPdf(file));
      } catch {
        alert("Не удалось загрузить PDF");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <div className="cover">
      {value ? (
        <a className="pdf-preview" href={value} target="_blank" rel="noreferrer">
          Открыть текущий PDF
        </a>
      ) : (
        <div className="cover-empty">PDF не загружен</div>
      )}
      <div className="cover-actions">
        <button type="button" onClick={pick} disabled={uploading}>
          {uploading ? "Загрузка…" : value ? "Заменить PDF" : "Загрузить PDF"}
        </button>
        {value && (
          <button type="button" className="link danger" onClick={() => onChange("")}>
            Убрать
          </button>
        )}
      </div>
    </div>
  );
}
