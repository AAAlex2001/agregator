"use client";

import { useRef, useState } from "react";
import { TextInput } from "@/source/shared/ui/Inputs";
import s from "./RegulatoryDocumentsBlock.module.scss";

const ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

interface Props {
  miningLicenseFile: File | null;
  sroDesignFile: File | null;
  labAccreditationFile: File | null;
  miningLicenseNumber: string;
  sroDesignNumber: string;
  labAccreditationNumber: string;
  onMiningNumberChange: (v: string) => void;
  onSroNumberChange: (v: string) => void;
  onLabNumberChange: (v: string) => void;
  onMiningFileSelect?: (f: File | null) => void;
  onSroFileSelect?: (f: File | null) => void;
  onLabFileSelect?: (f: File | null) => void;
}

export function RegulatoryDocumentsBlock(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.wrap}>
      <button type="button" className={s.toggle} onClick={() => setOpen((v) => !v)}>
        <span>Дополнительные разрешительные документы</span>
        <span className={s.chevron} aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>

      {open && (
        <div className={s.body}>
          <DocRow
            label="Лицензия на маркшейдерские работы №"
            number={props.miningLicenseNumber}
            file={props.miningLicenseFile}
            onNumberChange={props.onMiningNumberChange}
            onFileSelect={props.onMiningFileSelect}
          />
          <DocRow
            label="Выписка СРО проектирования, ОГРН"
            number={props.sroDesignNumber}
            file={props.sroDesignFile}
            onNumberChange={props.onSroNumberChange}
            onFileSelect={props.onSroFileSelect}
          />
          <DocRow
            label="Свидетельство об аккредитации лаборатории №"
            number={props.labAccreditationNumber}
            file={props.labAccreditationFile}
            onNumberChange={props.onLabNumberChange}
            onFileSelect={props.onLabFileSelect}
          />
        </div>
      )}
    </div>
  );
}

interface RowProps {
  label: string;
  number: string;
  file: File | null;
  onNumberChange: (v: string) => void;
  onFileSelect?: (f: File | null) => void;
}

function DocRow({ label, number, file, onNumberChange, onFileSelect }: RowProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={s.row}>
      <TextInput
        value={number}
        autoComplete="off"
        onChange={(e) => onNumberChange(e.target.value)}
        placeholder={label}
      />
      <div className={s.fileSlot}>
        <button
          type="button"
          className={s.pickBtn}
          onClick={() => inputRef.current?.click()}
          disabled={!onFileSelect}
        >
          {file ? "Заменить файл" : "Прикрепить файл"}
        </button>
        {file && <span className={s.fileName}>{file.name}</span>}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          hidden
          onChange={(e) => {
            const next = e.target.files?.[0] ?? null;
            e.target.value = "";
            if (onFileSelect) onFileSelect(next);
          }}
        />
      </div>
      <p className={s.hint}>PDF / JPG / PNG / DOC / DOCX, до 10 МБ</p>
    </div>
  );
}
