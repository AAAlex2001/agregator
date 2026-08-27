"use client";

import { useState } from "react";
import { uploadPdf } from "./api";
import type { RtnDocumentFile } from "./model";

export function PdfUpload({
  value,
  onChange,
}: {
  value: RtnDocumentFile[];
  onChange: (files: RtnDocumentFile[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const pick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      if (!files.length) return;
      setUploading(true);
      try {
        const uploaded: RtnDocumentFile[] = [];
        for (const file of files) {
          uploaded.push({ name: file.name, url: await uploadPdf(file) });
        }
        onChange([...value, ...uploaded]);
      } catch {
        alert("Не удалось загрузить один или несколько PDF");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <div className="cover">
      {value.length ? (
        <ul className="pdf-list">
          {value.map((file, index) => (
            <li key={`${file.url}-${index}`} className="pdf-list-item">
              <a className="pdf-preview" href={file.url} target="_blank" rel="noreferrer">
                {file.name || `Документ ${index + 1}.pdf`}
              </a>
              <button
                type="button"
                className="link danger"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
              >
                Убрать
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="cover-empty">PDF-файлы не загружены</div>
      )}
      <div className="cover-actions">
        <button type="button" onClick={pick} disabled={uploading}>
          {uploading ? "Загрузка…" : value.length ? "Добавить PDF" : "Загрузить PDF"}
        </button>
        {value.length > 1 && (
          <button type="button" className="link danger" onClick={() => onChange([])}>
            Убрать все
          </button>
        )}
      </div>
    </div>
  );
}
