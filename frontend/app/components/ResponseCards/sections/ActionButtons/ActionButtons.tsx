"use client";

import Button from "@/app/components/Button";
import styles from "./actionButtons.module.scss";

interface ActionButtonsProps {
  editBtnText?: string;
  payBtnText?: string;
  onEdit?: () => void;
  onPay?: () => void;
}

const ActionButtons = ({
  editBtnText = "Редактировать отклик",
  payBtnText = "Оплатить и получить заказ",
  onEdit,
  onPay,
}: ActionButtonsProps) => (
  <div className={styles.actions}>
    <Button
      variant="outline"
      size="sm"
      fullWidth
      onClick={onEdit}
      className={styles.editBtn}
    >
      {editBtnText}
    </Button>
    <Button
      variant="secondary"
      size="sm"
      fullWidth
      onClick={onPay}
      className={styles.payBtn}
    >
      {payBtnText}
    </Button>
  </div>
);

export default ActionButtons;
