"use client";

import cn from "classnames";
import { useState } from "react";
import { Modal } from "@/shared/ui/modal";
import styles from "./style.module.scss";

/** Шаг: название и необязательное пояснение, например дата. */
export interface ProgressStep {
  title: string;
  note?: string;
}

/** Шаги, текущий шаг, подписи карточки и переход к пройденному шагу, если он доступен. */
interface StepProgressProps {
  steps: ProgressStep[];
  current: number;
  title: string;
  caption: string;
  listTitle: string;
  onSelect?: (step: number) => void;
}

/** Состояние шага относительно текущего. */
function stateOf(index: number, current: number) {
  if (index < current) {
    return "done";
  }

  return index === current ? "current" : "future";
}

/** Полоса шагов с подписями; по «Все шаги» открывается список, где видны прошлые и будущие шаги. */
export function StepProgress({
  steps,
  current,
  title,
  caption,
  listTitle,
  onSelect,
}: StepProgressProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Открывает пройденный шаг и закрывает список. */
  function select(step: number) {
    setIsOpen(false);
    onSelect?.(step);
  }

  return (
    <div className={styles.progress}>
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        <button
          type="button"
          className={styles.all}
          onClick={() => setIsOpen(true)}
        >
          Все шаги
        </button>
      </div>
      <span
        className={styles.bar}
        aria-hidden
      >
        {steps.map((step, index) => (
          <span
            key={step.title}
            className={cn(styles.segment, styles[stateOf(index, current)])}
          />
        ))}
      </span>
      <span className={styles.caption}>{caption}</span>

      <Modal
        open={isOpen}
        size="sm"
        ariaLabel={listTitle}
        onClose={() => setIsOpen(false)}
      >
        <div className={styles.dialog}>
          <h2 className={styles.dialogTitle}>{listTitle}</h2>
          <ol className={styles.list}>
            {steps.map((step, index) => {
              const state = stateOf(index, current);
              const canOpen = Boolean(onSelect) && state === "done";
              const content = (
                <>
                  <span className={styles.marker}>
                    {state === "done" && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M3 8.4 6.3 11.6 13 4.8"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className={styles.text}>
                    <span className={styles.stepTitle}>{step.title}</span>
                    {step.note && <span className={styles.note}>{step.note}</span>}
                  </span>
                </>
              );

              return (
                <li
                  key={step.title}
                  className={cn(styles.row, styles[state])}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  {canOpen ? (
                    <button
                      type="button"
                      className={styles.rowButton}
                      onClick={() => select(index)}
                    >
                      {content}
                    </button>
                  ) : (
                    <span className={styles.rowBody}>{content}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </Modal>
    </div>
  );
}