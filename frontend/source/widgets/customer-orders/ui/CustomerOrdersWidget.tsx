"use client";

import { useRef } from "react";
import { Header } from "@/source/widgets/header";
import { OrderCard } from "@/source/entities/order";
import { Button, Loader, ScrollHintTooltip } from "@/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useHorizontalScroll } from "@/shared/lib/hooks/useHorizontalScroll";
import CreateOrderForm from "@/features/order/create/ui/CreateOrderForm";
import { useCustomerOrders } from "@/source/features/customer-orders";
import s from "./CustomerOrdersWidget.module.scss";

export function CustomerOrdersWidget() {
  const h = useCustomerOrders();
  const ref = useRef<HTMLDivElement>(null);
  useHorizontalScroll(ref, { deps: [h.isLoading] });

  if (h.mode === "create" || h.mode === "edit") {
    return (
      <>
        <Header />
        <div className={s.wrapper}>
          <CreateOrderForm
            onCancel={h.backToList}
            onSubmit={h.mode === "edit" ? h.onUpdate : h.onCreate}
            isSubmitting={h.submitting}
            initialData={h.editTarget ?? undefined}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={s.wrapper}>
        {h.isLoading && <div className={s.center}><Loader label="" size="lg" /></div>}

        {!h.isLoading && h.error && (
          <div className={s.center}>
            <Title text="шибка загрузки" as="h2" />
            <Subtitle text={h.error} />
            <button className={s.retry} onClick={() => void h.reload()}>овторить</button>
          </div>
        )}

        {!h.isLoading && !h.error && h.items.length === 0 && (
          <div className={s.center}>
            <Title text="ои заказы" as="h2" />
            <Subtitle text=" вас пока нет заказов" />
            <Button variant="primary" size="md" onClick={h.openCreate}>Создать заказ</Button>
          </div>
        )}

        {!h.isLoading && !h.error && h.items.length > 0 && (
          <>
            <div className={s.pageHead}>
              <div className={s.titleRow}>
                <Title text="ои заказы" as="h1" />
                <ScrollHintTooltip message="спользуйте Shift + колесо мыши для прокрутки" />
              </div>
              <Subtitle text="ктуальные заказы по направлениям" />
            </div>

            <Button variant="primary" size="md" fullWidth className={s.createBtn} onClick={h.openCreate}>
              обавить заказ
            </Button>

            <div className={s.container}>
              <div className={s.shadeL} /><div className={s.shadeR} />
              <div className={s.grid} ref={ref}>
                {h.items.map((o) => (
                  <OrderCard key={o.id} badges={o.badges} title={o.title} customer={o.customer} date={o.date} sum={o.sum}>
                    <Button variant="outline" size="sm" className={s.btn} onClick={(e) => { e.stopPropagation(); h.openEdit(o); }}>
                      едактировать
                    </Button>
                    <Button variant="transparent" size="sm" className={s.btnDel}
                      disabled={h.deletingId === o.id} isLoading={h.deletingId === o.id}
                      onClick={(e) => { e.stopPropagation(); void h.onDelete(o.id); }}
                    >далить</Button>
                  </OrderCard>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
