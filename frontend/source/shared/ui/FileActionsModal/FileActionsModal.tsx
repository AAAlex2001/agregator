"use client";

import { Modal } from "@/source/shared/ui/Modal";
import Button from "@/source/shared/ui/Button";
import s from "./FileActionsModal.module.scss";

interface Props {
  open: boolean;
  fileName: string;
  onView: () => void;
  onDownload: () => void;
  onClose: () => void;
}

export function FileActionsModal({ open, fileName, onView, onDownload, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} size="sm" ariaLabel="Действия с файлом">
      <div className={s.body}>
        <p className={s.name} title={fileName}>{fileName}</p>
        <div className={s.actions}>
          <Button variant="primary" fullWidth onClick={() => { onView(); onClose(); }}>
            Посмотреть
          </Button>
          <Button variant="secondary" fullWidth onClick={() => { onDownload(); onClose(); }}>
            Скачать файл
          </Button>
        </div>
      </div>
    </Modal>
  );
}
