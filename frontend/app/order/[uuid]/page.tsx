"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Loader } from "@/app/components";
import { LogoIcon } from "@/app/icons";
import styles from "./orderPreview.module.scss";

interface BadgeData {
  text: string;
  variant: string;
}

interface OrderData {
  id: number;
  public_id: string;
  title: string;
  company: string;
  comment: string;
  sum: string;
  date: string;
  badges: BadgeData[];
  status: string;
}

const variantClassMap: Record<string, string> = {
  BLUE: "badgeBlue",
  GREEN: "badgeGreen",
  GRAY: "badgeGray",
  ORANGE: "badgeOrange",
  BROWN: "badgeBrown",
  PURPLE: "badgePurple",
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export default function OrderPreviewPage() {
  const params = useParams();
  const uuid = params.uuid as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;
    setIsLoading(true);
    fetch(`${getApiBaseUrl()}/orders/public/${uuid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Заказ не найден");
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [uuid]);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <LogoIcon title="Ресурс-Плюс" />
            </Link>
          </div>

          {isLoading && (
            <div className={styles.loaderWrapper}>
              <Loader label="" size="lg" />
            </div>
          )}

          {error && (
            <div className={styles.errorBlock}>
              <h2 className={styles.errorTitle}>Заказ не найден</h2>
              <p className={styles.errorText}>Возможно, заказ был удалён или ссылка недействительна</p>
            </div>
          )}

          {order && (
            <>
              <h1 className={styles.orderTitle}>{order.title}</h1>

              {order.company && (
                <div className={styles.company}>{order.company}</div>
              )}

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Срок выполнения</span>
                  <span className={styles.metaValue}>{order.date}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Мин. стоимость</span>
                  <span className={styles.metaValue}>{order.sum}</span>
                </div>
              </div>

              {order.badges.length > 0 && (
                <div className={styles.badges}>
                  {order.badges.map((badge) => (
                    <span
                      key={badge.text}
                      className={`${styles.badge} ${styles[variantClassMap[badge.variant] || "badgeGray"]}`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}

              {order.comment && (
                <div className={styles.commentBlock}>
                  <span className={styles.commentLabel}>Описание</span>
                  <p className={styles.commentText}>{order.comment}</p>
                </div>
              )}

              <div className={styles.divider} />

              <p className={styles.ctaText}>
                Войдите или зарегистрируйтесь, чтобы откликнуться на заказ
              </p>

              <div className={styles.actions}>
                <Link href="/login" className={styles.actionLink}>
                  <Button variant="chat" size="lg" fullWidth>
                    Войти
                  </Button>
                </Link>
                <Link href="/register" className={styles.actionLink}>
                  <Button variant="outlineOrange" size="lg" fullWidth>
                    Зарегистрироваться
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
