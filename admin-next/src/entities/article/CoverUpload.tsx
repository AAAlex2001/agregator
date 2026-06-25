"use client";

import { useState } from "react";
import { uploadImage } from "./api";

export function CoverUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const pick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        onChange(await uploadImage(file));
      } catch {
        alert("Не удалось загрузить обложку");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <div className="cover">
      {value ? (
        <img className="cover-preview" src={value} alt="Обложка" />
      ) : (
        <div className="cover-empty">Обложка не загружена</div>
      )}
      <div className="cover-actions">
        <button type="button" onClick={pick} disabled={uploading}>
          {uploading ? "Загрузка…" : value ? "Заменить обложку" : "Загрузить обложку"}
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
