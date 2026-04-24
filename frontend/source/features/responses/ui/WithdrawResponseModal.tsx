import { Button } from "@/shared/ui";
import type { ResponseBadge } from "@/source/entities/response";
import s from "./WithdrawResponseModal.module.scss";

interface WithdrawResponseModalProps {
  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  warnings: string[];
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function WithdrawResponseModal({
  dateLabel,
  date,
  status,
  statusColor,
  statusBg,
  orderTitle,
  customer,
  orderDate,
  badges,
  sum,
  warnings,
  isLoading,
  onCancel,
  onConfirm,
}: WithdrawResponseModalProps) {
  return (
    <div className={s.overlay} onClick={onCancel}>
      <div className={s.modal} onClick={(event) => event.stopPropagation()}>
        <div className={s.content}>
          <div className={s.statusDateRow}>
            <div className={s.dateRow}>
              <span className={s.dateLabel}>{dateLabel}</span>
              <span className={s.dateValue}>{date}</span>
            </div>
            <span className={s.statusBadge} style={{ color: statusColor, background: statusBg }}>
              {status}
            </span>
          </div>

          <div className={s.inner}>
            <h2 className={s.title}>Вы уверены, что хотите отозвать ваше предложение?</h2>

            <div className={s.orderBlock}>
              <div className={s.orderTitleRow}>
                <span className={s.orderTitle}>{orderTitle}</span>
              </div>
              <span className={s.customer}>{customer}</span>
              <div className={s.orderMeta}>
                <span className={s.orderDate}>{orderDate}</span>
                <div className={s.badges}>
                  {badges.map((badge, index) => (
                    <span key={`${badge.text}-${index}`} className={`${s.badge} ${s[badge.variant]}`}>
                      {badge.text}
                    </span>
                  ))}
                </div>
                <span className={s.sum}>{sum}</span>
              </div>
            </div>

            <div className={s.infoBlock}>
              <span className={s.infoTitle}>Обратите внимание:</span>
              <ul className={s.bulletList}>
                {warnings.map((text) => (
                  <li key={text} className={s.bulletItem}>
                    <span className={s.bulletDot} />
                    <span className={s.bulletText}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={s.buttons}>
          <Button variant="chat" fullWidth onClick={onCancel}>
            Отменить
          </Button>
          <Button variant="outline" fullWidth onClick={onConfirm} isLoading={isLoading}>
            Отозвать отклик
          </Button>
        </div>
      </div>
    </div>
  );
}