import { accountPath } from "@/shared/lib/admin-paths";
import { formatDate } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import { ACCOUNT_ROLE_LABELS, ACCOUNT_ROLE_TONES, type Account } from "../../model/types";
import styles from "./style.module.scss";

type AccountsTableProps = {
  accounts: Account[];
};

/** Список учётных записей. Строка целиком ведёт в профиль. */
const AccountsTable = ({ accounts }: AccountsTableProps) => (
  <List>
    {accounts.map((account) => (
      <ListRow key={account.id} href={accountPath(account.id)}>
        <span className={styles.id}>#{account.id}</span>

        <span className={styles.cell}>
          <span className={styles.name}>{account.name}</span>
          <span className={styles.meta}>
            {[account.company_name, account.inn && `ИНН ${account.inn}`].filter(Boolean).join(" · ") || "Компания не указана"}
          </span>
        </span>

        <span className={styles.contacts}>
          <span>{account.email ?? "Email не указан"}</span>
          <span className={styles.meta}>{account.phone ?? "Телефон не указан"}</span>
        </span>

        <span className={styles.badges}>
          <Badge tone={ACCOUNT_ROLE_TONES[account.role]}>{ACCOUNT_ROLE_LABELS[account.role]}</Badge>
          {!account.is_active && <Badge tone="danger">Отключена</Badge>}
        </span>

        <span className={styles.date}>{formatDate(account.created_at)}</span>
      </ListRow>
    ))}
  </List>
);

export default AccountsTable;
