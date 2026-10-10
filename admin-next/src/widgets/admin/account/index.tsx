"use client";

import { AccountSummary } from "@/entities/account";
import { AccountForm, useAccountEditor } from "@/features/account-editor";
import { ACCOUNTS_PATH } from "@/shared/lib/admin-paths";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import styles from "./style.module.scss";

type AccountProfileProps = {
  accountId: number;
};

/** Профиль учётной записи: форма правки и сводка по активности. */
const AccountProfile = ({ accountId }: AccountProfileProps) => {
  const { state, change, save } = useAccountEditor(accountId);
  const { account } = state;

  if (state.failed) return <Message tone="error">Не удалось загрузить учётную запись.</Message>;
  if (!account) return <Loader size="lg" />;

  const name = [account.first_name, account.last_name].filter(Boolean).join(" ");

  return (
    <Page>
      <PageHeader
        backHref={ACCOUNTS_PATH}
        title={name || account.email || account.phone || `Учётная запись №${account.id}`}
        description={`#${account.id}`}
      />

      <div className={styles.columns}>
        <AccountForm fields={state.fields} pending={state.pending} onChange={change} onSubmit={save} />
        <AccountSummary account={account} />
      </div>
    </Page>
  );
};

export default AccountProfile;
