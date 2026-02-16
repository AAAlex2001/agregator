"use client";

import Button from "@/app/components/Button";
import styles from "./actionButtons.module.scss";

interface ActionButtonsProps {
  editBtnText?: string;
  payBtnText?: string;
  onEdit?: () => void;
  onPay?: () => void;
  editBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  payBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  hideEditButton?: boolean;
  isEditLoading?: boolean;
  isPayLoading?: boolean;
}

const ActionButtons = ({
  editBtnText = "Редактировать отклик",
  payBtnText = "Оплатить и получить заказ",
  onEdit,
  onPay,
  editBtnVariant = "outline",
  payBtnVariant = "secondary",
  hideEditButton = false,
  isEditLoading = false,
  isPayLoading = false,
}: ActionButtonsProps) => (
  <div className={styles.actions}>
    {!hideEditButton && (
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
  </div>
);

export default ActionButtons;
