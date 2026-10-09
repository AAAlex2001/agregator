"use client";

import { useState } from "react";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import Modal from "@/shared/ui/modal";

type LinkModalProps = {
  open: boolean;
  initialUrl: string;
  onSubmit: (url: string) => void;
  onClose: () => void;
};

/** Окно ввода адреса ссылки. Пустой адрес снимает ссылку с выделения. */
const LinkModal = ({ open, initialUrl, onSubmit, onClose }: LinkModalProps) => {
  const [url, setUrl] = useState(initialUrl);

  return (
    <Modal
      open={open}
      title="Ссылка"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={() => onSubmit(url.trim())}>{url.trim() ? "Поставить" : "Убрать ссылку"}</Button>
        </>
      }
    >
      <Field label="Адрес" hint="Полный адрес с https:// или путь на сайте вида /news">
        <Input type="url" ariaLabel="Адрес ссылки" placeholder="https://" value={url} onChange={setUrl} />
      </Field>
    </Modal>
  );
};

export default LinkModal;
