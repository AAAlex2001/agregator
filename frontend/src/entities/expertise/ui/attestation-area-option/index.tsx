import classNames from "classnames";
import type { PointerEvent } from "react";
import type { AttestationArea } from "../../model/types";
import { AttestationAreaDetails } from "../attestation-area-details";
import styles from "./style.module.scss";

/** Область аттестации с подсказкой для выбора объекта экспертизы. */
interface AttestationAreaOptionProps {
  area: AttestationArea;
  isActive: boolean;
  onOpen: (value: string) => void;
  onClose: (value: string) => void;
  onSelect: (code: string) => void;
}

/** Проверяет, доступно ли раскрытие подсказки наведением мыши. */
function hasDesktopHover(): boolean {
  return window.matchMedia(
    "(min-width: 768px) and (hover: hover) and (pointer: fine)",
  ).matches;
}

/** Показывает кнопку области и её подсказку для настольного экрана. */
export function AttestationAreaOption({
  area,
  isActive,
  onOpen,
  onClose,
  onSelect,
}: AttestationAreaOptionProps) {
  /** Открывает область нажатием, включая сенсорный экран. */
  function openArea() {
    onOpen(area.value);
  }

  /** Показывает подсказку при наведении мыши на широком экране. */
  function openFromPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && hasDesktopHover()) {
      openArea();
    }
  }

  /** Закрывает подсказку после выхода мыши за пределы области. */
  function closeFromPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && hasDesktopHover()) {
      onClose(area.value);
    }
  }

  return (
    <div
      className={classNames(styles.opoItem, {
        [styles.opoItemActive]: isActive,
      })}
      onPointerEnter={openFromPointer}
      onPointerLeave={closeFromPointer}
    >
      <button
        type="button"
        className={classNames(styles.opoButton, {
          [styles.opoButtonActive]: isActive,
        })}
        aria-expanded={isActive}
        onClick={openArea}
      >
        {area.value}
      </button>

      {isActive && (
        <div className={styles.expertisePopover}>
          <div className={styles.expertisePopoverCard}>
            <AttestationAreaDetails
              area={area}
              variant="popover"
              onSelect={onSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
