"use client";

import { BLITZ_STAGE_LABELS, blitzInvoiceUrl } from "@/entities/blitz-order";
import { useBlitzInvoices } from "@/features/blitz-admin";
import { BLITZ_PATH, blitzOrderPath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import Chip from "@/shared/ui/chip";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Toolbar from "@/shared/ui/toolbar";
import styles from "./style.module.scss";

/** Счета организаций: сверка с банком и подтверждение оплаты. */
const BlitzInvoices = () => {
  const list = useBlitzInvoices();

  return (
    <Page>
      <PageHeader
        backHref={BLITZ_PATH}
        title="Счета Блиц-эксперта"
        description="Когда деньги пришли на расчётный счёт — подтвердите оплату: заявка пойдёт дальше"
      />

      <Toolbar aside={list.invoices && `Всего: ${list.invoices.length}`}>
        <Chip active={list.onlyOpen} onClick={list.showOpen}>Ждут оплаты</Chip>
        <Chip active={!list.onlyOpen} onClick={list.showAll}>Все</Chip>
      </Toolbar>

      {list.error && (
        <div role="alert">
          <Message tone="error">{list.error}</Message>
          <Button variant="outline" onClick={list.reload}>Повторить</Button>
        </div>
      )}
      {!list.invoices && !list.error && <Loader size="lg" />}
      {list.invoices?.length === 0 && <Message>Счетов нет.</Message>}

      {list.invoices && list.invoices.length > 0 && (
        <List>
          {list.invoices.map((invoice) => (
            <ListRow key={invoice.id}>
              <span className={styles.number}>
                <a href={blitzInvoiceUrl(invoice.id)}>№ {invoice.number}</a>
                <a className={styles.meta} href={`${blitzOrderPath(invoice.order_id)}`}>
                  заявка №{invoice.order_id}
                </a>
              </span>
              <span className={styles.payer}>
                <span>{invoice.payer_name}</span>
                <span className={styles.meta}>
                  ИНН {invoice.payer_inn} · {BLITZ_STAGE_LABELS[invoice.stage]} · {formatDateTime(invoice.created_at)}
                </span>
              </span>
              <span className={styles.amount}>{formatRub(invoice.amount)}</span>
              <span className={styles.state}>
                {invoice.paid_at && <Badge tone="success">Оплачен</Badge>}
                {invoice.canceled_at && <Badge tone="danger">Аннулирован</Badge>}
                {!invoice.paid_at && !invoice.canceled_at && (
                  <>
                    {invoice.reported_at && <Badge tone="warning">Заказчик сообщил об оплате</Badge>}
                    <Button
                      size="sm"
                      loading={list.confirmingId === invoice.id}
                      disabled={list.confirmingId !== null}
                      onClick={() => void list.confirm(invoice.id)}
                    >
                      Деньги пришли
                    </Button>
                  </>
                )}
              </span>
            </ListRow>
          ))}
        </List>
      )}
    </Page>
  );
};

export default BlitzInvoices;
