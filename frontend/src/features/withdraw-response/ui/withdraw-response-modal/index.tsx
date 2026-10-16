import classNames from "classnames";
import { getOrderBadgeColor } from "@/entities/order";
import { getResponseStatusBadge } from "@/entities/response";
import type { ResponseItem } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import styles from "./style.module.scss";

/** Отзываемый отклик и состояние запроса отзыва. */
interface WithdrawResponseModalProps {
  response: ResponseItem;
  isWithdrawing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Показывает заказ отклика и последствия отзыва перед подтверждением. */
export function WithdrawResponseModal({
  response,
  isWithdrawing,
  onCancel,
  onConfirm,
}: WithdrawResponseModalProps) {
  const status = getResponseStatusBadge(response, "EXPERT");

  return (
    <Modal
      open
      onClose={onCancel}
      size="md"
      isBusy={isWithdrawing}
    >
      <div className={styles.content}>
        <div className={styles.statusDateRow}>
          <div className={styles.dateRow}>
            <span className={styles.date}>Отклик от</span>
            <span className={styles.date}>{response.date}</span>
          </div>
          <span
            className={styles.statusBadge}
            style={{
              color: status.color,
              background: status.background,
            }}
          >
            {status.text}
          </span>
        </div>

        <div className={styles.inner}>
          <h2 className={styles.title}>Вы уверены, что хотите отозвать ваше предложение?</h2>

          <div className={styles.orderBlock}>
            <span className={styles.orderTitle}>{response.order_title}</span>
            <span className={styles.customer}>
              {response.customer_company || response.customer_name}
            </span>
            <div className={styles.orderMeta}>
              <span className={styles.orderDate}>{response.order_date}</span>
              <span className={styles.sum}>{response.order_sum || response.proposed_sum}</span>
            </div>
            {response.badges.length > 0 && (
              <div className={styles.requirements}>
                <span className={styles.requirementsLabel}>Требования к исполнителю:</span>
                <div className={styles.badges}>
                  {response.badges.map((badge) => (
                    <span
                      key={badge.text}
                      className={classNames(
                        styles.badge,
                        styles[getOrderBadgeColor(badge.variant)],
                      )}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.infoTitle}>Обратите внимание:</span>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>
                <span className={styles.bulletDot} />
                <span className={styles.bulletText}>
                  Заказчик больше не увидит ваше предложение
                </span>
              </li>
              <li className={styles.bulletItem}>
                <span className={styles.bulletDot} />
                <span className={styles.bulletText}>
                  Вы сможете откликнуться на этот заказ повторно
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <Button
          variant="chat"
          fullWidth
          onClick={onCancel}
        >
          Отменить отказ
        </Button>
        <Button
          variant="danger"
          fullWidth
          isLoading={isWithdrawing}
          onClick={onConfirm}
        >
          Отозвать отклик
        </Button>
      </div>
    </Modal>
  );
}
