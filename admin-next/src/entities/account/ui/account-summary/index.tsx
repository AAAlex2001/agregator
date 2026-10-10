import { formatDate, formatDateTime } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import Panel from "@/shared/ui/panel";
import { ACCOUNT_ROLE_LABELS, ACCOUNT_ROLE_TONES, type AccountDetail } from "../../model/types";
import styles from "./style.module.scss";

type AccountSummaryProps = {
  account: AccountDetail;
};

/** Сводка по учётной записи: роль, компания, активность, подписка и даты. */
const AccountSummary = ({ account }: AccountSummaryProps) => {
  const subscription = account.subscription_name
    ? `${account.subscription_name}${account.subscription_expires_at ? ` до ${formatDate(account.subscription_expires_at)}` : ""}`
    : "Нет";

  const rows = [
    ["Компания", account.company_name ?? "Не указана"],
    ["Заказов размещено", String(account.orders_count)],
    ["Откликов оставлено", String(account.responses_count)],
    ["Подписка", subscription],
    ["Telegram", account.has_telegram ? "Привязан" : "Не привязан"],
    ["Регистрация", formatDateTime(account.created_at)],
    ["Изменена", formatDateTime(account.updated_at)],
  ];

  return (
    <Panel title="Сводка" action={<Badge tone={ACCOUNT_ROLE_TONES[account.role]}>{ACCOUNT_ROLE_LABELS[account.role]}</Badge>}>
      <dl className={styles.list}>
        {rows.map(([label, value]) => (
          <div key={label} className={styles.row}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
};

export default AccountSummary;
