"use client";

import { BLITZ_STATUS_GROUPS, OrdersTable } from "@/entities/blitz-order";
import { useBlitzOrders } from "@/features/blitz-admin";
import { BLITZ_INVOICES_PATH } from "@/shared/lib/admin-paths";
import Button from "@/shared/ui/button";
import Chip from "@/shared/ui/chip";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Pagination from "@/shared/ui/pagination";
import Toolbar from "@/shared/ui/toolbar";

/** Заявки Блиц-эксперта: группы статусов, страницы и переход в карточку. */
const BlitzOrders = () => {
  const list = useBlitzOrders();

  return (
    <Page>
      <PageHeader
        title="Блиц-эксперт"
        description="Заявки на экспертизу: эксперт, договор, оплата, заключение"
        action={<Button variant="outline" href={BLITZ_INVOICES_PATH}>Счета</Button>}
      />

      <Toolbar aside={list.list && `Всего: ${list.list.total}`}>
        {BLITZ_STATUS_GROUPS.map((group, index) => (
          <Chip key={group.label} active={list.group === index} onClick={() => list.changeGroup(index)}>
            {group.label}
          </Chip>
        ))}
      </Toolbar>

      {list.error && (
        <div role="alert">
          <Message tone="error">{list.error}</Message>
          <Button variant="outline" onClick={list.reload}>Повторить</Button>
        </div>
      )}
      {list.loading && <Loader size="lg" />}
      {list.list?.items.length === 0 && <Message>Заявок в этой группе нет.</Message>}
      {list.list && list.list.items.length > 0 && <OrdersTable orders={list.list.items} />}

      <Pagination page={list.page} pages={list.pages} disabled={list.loading} onChange={list.openPage} />
    </Page>
  );
};

export default BlitzOrders;
