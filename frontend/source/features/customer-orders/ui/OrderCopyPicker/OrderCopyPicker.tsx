"use client";

import { useEffect, useState } from "react";
import { fetchArchivedOrders, mapApiToOrderCard, type OrderCardData } from "@/source/entities/order";
import { fetchCustomerOrders } from "@/source/entities/order/api/customer-orders.api";
import { Modal } from "@/source/shared/ui/Modal";
import Loader from "@/source/shared/ui/Loader";
import s from "./OrderCopyPicker.module.scss";

interface Props {
  open: boolean;
  customerId: number;
  onClose: () => void;
  onSelect: (order: OrderCardData) => void;
}

async function loadAll(
  fetchPage: (skip: number, limit: number) => Promise<{ items: Parameters<typeof mapApiToOrderCard>[0][]; has_more: boolean }>,
): Promise<OrderCardData[]> {
  const result: OrderCardData[] = [];
  while (true) {
    const page = await fetchPage(result.length, 50);
    result.push(...page.items.map(mapApiToOrderCard));
    if (!page.has_more) return result;
  }
}

export function OrderCopyPicker({ open, customerId, onClose, onSelect }: Props) {
  const [items, setItems] = useState<OrderCardData[] | null>(null);

  useEffect(() => {
    if (!open) return;
    setItems(null);
    Promise.all([
      loadAll(fetchCustomerOrders),
      loadAll(fetchArchivedOrders),
    ]).then(([active, archived]) => {
      const unique = new Map<number, OrderCardData>();
      [...active, ...archived]
        .filter((order) => order.customerId === customerId)
        .forEach((order) => unique.set(order.id, order));
      setItems([...unique.values()]);
    });
  }, [open, customerId]);

  return (
    <Modal open={open} onClose={onClose} size="md" ariaLabel="Выбор заявки для копирования">
      <div className={s.content}>
        <h2 className={s.title}>Какую заявку вы хотите скопировать?</h2>
        {items === null ? (
          <div className={s.loading}><Loader label="" size="md" /></div>
        ) : (
          <div className={s.list}>
            {items.map((order) => (
              <button key={order.id} type="button" className={s.item} onClick={() => onSelect(order)}>
                <span className={s.number}>№ {order.id}</span>
                <span className={s.name}>{order.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
