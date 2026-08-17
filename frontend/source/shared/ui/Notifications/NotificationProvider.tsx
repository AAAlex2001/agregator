"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Toast, type ToastType } from "./Toast";
import s from "./Toast.module.scss";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const Ctx = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<ToastItem | null>(null);

  const dismiss = useCallback((id: string) => {
    setItem((prev) => (prev && prev.id === id ? null : prev));
  }, []);

  const push = useCallback((type: ToastType, message: string) => {
    setItem({ id: `${Date.now()}-${Math.random()}`, type, message });
  }, []);
  const showSuccess = useCallback((message: string) => {
    push("success", message);
  }, [push]);
  const showError = useCallback((message: string) => {
    push("error", message);
  }, [push]);
  const toastHost =
    typeof document === "undefined" ? null : document.querySelector("dialog[open]") ?? document.body;
  const toastStack = (
    <div className={s.stack}>
      {item && (
        <Toast
          key={item.id}
          message={item.message}
          type={item.type}
          onDismiss={() => dismiss(item.id)}
        />
      )}
    </div>
  );

  return (
    <Ctx.Provider value={{ showSuccess, showError }}>
      {children}
      {toastHost && createPortal(toastStack, toastHost)}
    </Ctx.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
