"use client";

import cn from "classnames";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./style.module.scss";

type Tone = "success" | "error";

type Toast = {
  id: number;
  text: string;
  tone: Tone;
};

type ShowToast = (text: string, tone?: Tone) => void;

const ToastContext = createContext<ShowToast>(() => undefined);

/** Показывает уведомление в правом верхнем углу. Оно само уезжает, когда добегает полоска времени. */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (box.current && !box.current.matches(":popover-open")) box.current.showPopover();
  }, [toast]);

  const show: ShowToast = (text, tone = "success") => setToast({ id: Date.now(), text, tone });

  return (
    <ToastContext.Provider value={show}>
      {children}

      {toast && (
        <div
          key={toast.id}
          ref={box}
          popover="manual"
          className={cn(styles.toast, styles[toast.tone])}
          role="status"
          onAnimationEnd={() => setToast(null)}
        >
          <span className={styles.icon}>{toast.tone === "success" ? "✓" : "!"}</span>
          <p className={styles.text}>{toast.text}</p>
          <span className={styles.timer} />
        </div>
      )}
    </ToastContext.Provider>
  );
};

/** Функция показа уведомления: toast("Сохранено") или toast("Не удалось", "error"). */
export const useToast = () => useContext(ToastContext);
