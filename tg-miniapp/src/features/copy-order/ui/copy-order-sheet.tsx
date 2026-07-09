import { useEffect, useState } from "react";
import { listArchivedOrders, listOrders, type Order } from "@/entites/order";
import { BottomSheet, Spinner } from "@/shared/ui";
import s from "./copy-order-sheet.module.scss";

interface Props {
  open: boolean;
  customerId: number;
  onClose: () => void;
  onSelect: (order: Order) => void;
}

export function CopyOrderSheet({ open, customerId, onClose, onSelect }: Props) {
  const [items, setItems] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!open) return;
    setItems(null);
    Promise.all([listOrders(100), listArchivedOrders(100)]).then(([active, archived]) => {
      const unique = new Map<number, Order>();
      [...active.items, ...archived.items]
        .filter((order) => order.customer_id === customerId)
        .forEach((order) => unique.set(order.id, order));
      setItems([...unique.values()]);
    });
  }, [open, customerId]);

  return (
    <BottomSheet open={open} title="Какую заявку вы хотите скопировать?" onClose={onClose}>
      {items === null ? (
        <div className={s.loading}><Spinner /></div>
      ) : (
        <div className={s.list}>
          {items.map((order) => (
            <button key={order.id} type="button" className={s.item} onClick={() => onSelect(order)}>
              <span className={s.number}>№ {order.id}</span>
              <span className={s.title}>{order.title}</span>
            </button>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
