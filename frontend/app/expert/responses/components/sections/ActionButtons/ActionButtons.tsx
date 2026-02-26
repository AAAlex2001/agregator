"use client";

import Button from "@/app/components/Button";
import styles from "./actionButtons.module.scss";

interface ActionButtonsProps {
  editBtnText?: string;
  middleBtnText?: string;
  payBtnText?: string;
  onEdit?: () => void;
  onMiddle?: () => void;
  onPay?: () => void;
  editBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  middleBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  payBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  hideEditButton?: boolean;
  isEditLoading?: boolean;
  isMiddleLoading?: boolean;
  isPayLoading?: boolean;
}

const ActionButtons = ({
  editBtnText,
  middleBtnText,
  payBtnText,
  onEdit,
  onMiddle,
  onPay,
  editBtnVariant = "outline",
  middleBtnVariant = "secondary",
  payBtnVariant = "secondary",
  hideEditButton = false,
  isEditLoading = false,
  isMiddleLoading = false,
  isPayLoading = false,
}: ActionButtonsProps) => (
  <div className={styles.actions}>
    {!hideEditButton && editBtnText && (
      <Button
        variant={editBtnVariant}
        size="sm"
        fullWidth
        onClick={onEdit}
        className={styles.editBtn}
        isLoading={isEditLoading}
      >
        {editBtnText}
      </Button>
    )}
    {middleBtnText && (
      <Button
        variant={middleBtnVariant}
        size="sm"
        fullWidth
        onClick={onMiddle}
        className={styles.middleBtn}
        isLoading={isMiddleLoading}
      >
        {middleBtnText}
      </Button>
    )}
    {payBtnText && (
      <Button
        variant={payBtnVariant}
        size="sm"
        fullWidth
        onClick={onPay}
        className={styles.payBtn}
        isLoading={isPayLoading}
      >
        {payBtnText}
      </Button>
    )}
  </div>
);

export default ActionButtons;
