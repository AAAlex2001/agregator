"use client";

import type { ReactNode } from "react";
import Dialog from "@/shared/ui/dialog";
import IconButton from "@/shared/ui/icon-button";
import { CloseIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Модальное окно с заголовком, крестиком, содержимым и необязательным низом с кнопками. */
const Modal = ({ open, onClose, title, children, footer }: ModalProps) => (
  <Dialog open={open} onClose={onClose} ariaLabel={title} className={styles.modal}>
    <div className={styles.head}>
      <p className={styles.title}>{title}</p>
      <IconButton tone="ghost" size="sm" ariaLabel="Закрыть" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </div>

    <div className={styles.body}>{children}</div>

    {footer && <div className={styles.footer}>{footer}</div>}
  </Dialog>
);

export default Modal;
