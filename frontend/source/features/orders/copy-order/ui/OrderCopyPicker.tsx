"use client";

import { useEffect, useState } from "react";
import { fetchArchivedOrders, fetchOrders, mapApiToOrderCard, type OrderCardData } from "@/source/entities/order";
import Loader from "@/source/shared/ui/Loader";
import { Modal } from "@/source/shared/ui/Modal";
import s from "./OrderCopyPicker.module.scss";

const LIMIT = 200;

interface OrderCopyPickerProps {
  customerId: number;
  onClose: () => void;
  onSelect: (order: OrderCardData) => void;
}

/** Выбор своего заказа (активного или архивного), чтобы завести новый по его образцу. */
export function OrderCopyPicker({ customerId, onClose, onSelect }: OrderCopyPickerProps) {
  const [orders, setOrders] = useState<OrderCardData[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchOrders({ skip: 0, limit: LIMIT }), fetchArchivedOrders({ skip: 0, limit: LIMIT })])
      .then(([active, archived]) => {
        if (cancelled) return;
        const own = [...active.items, ...archived.items].map(mapApiToOrderCard).filter((order) => order.customerId === customerId);
        setOrders(own);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      });
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  return (
    <Modal open onClose={onClose} size="md" ariaLabel="Выбор заявки для копирования">
      <div className={s.content}>
        <h2 className={s.title}>Какую заявку вы хотите скопировать?</h2>
        {orders === null ? (
          <div className={s.loading}>
            <Loader label="" size="md" />
          </div>
        ) : (
          <div className={s.list}>
            {orders.map((order) => (
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
