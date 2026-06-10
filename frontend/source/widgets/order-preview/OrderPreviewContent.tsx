"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Loader } from "@/source/shared/ui";
import { LogoIcon } from "@/source/shared/ui/icons";
import { documentPaths, fetchPublicOrder, type PublicOrderPreview } from "@/source/entities/order";
import { fetchProfile } from "@/source/entities/user";
import styles from "./order-preview.module.scss";

type PreviewOrder = PublicOrderPreview;

function useOrderPreviewState() {
  const params = useParams();
  const router = useRouter();
  const uuid = params?.uuid as string | undefined;
  const [order, setOrder] = useState<PreviewOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (uuid) sessionStorage.setItem("pendingOrderUuid", uuid);
  }, [uuid]);

  useEffect(() => {
    if (!uuid) return;
    setIsLoading(true);
    fetchPublicOrder(uuid)
      .then((data) => setOrder(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Заказ не найден"))
      .finally(() => setIsLoading(false));
  }, [uuid]);

  useEffect(() => {
    if (!order) return;
    fetchProfile()
      .then((profile) => {
        if (profile.role === "EXPERT") {
          sessionStorage.removeItem("pendingOrderUuid");
          router.replace(`/expert/orders?orderId=${order.id}`);
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => setCheckingAuth(false));
  }, [order, router]);

  return { order, isLoading, error, checkingAuth };
}

const variantClassMap: Record<string, string> = {
  BLUE: "badgeBlue", GREEN: "badgeGreen", GRAY: "badgeGray",
  ORANGE: "badgeOrange", BROWN: "badgeBrown", PURPLE: "badgePurple",
};

function formatResponsesDeadline(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getFileName(url: string): string {
  const parts = url.split("/");
  const last = parts[parts.length - 1];
  return last.split("?")[0] || last;
}

export function OrderPreviewContent() {
  const { order, isLoading, error, checkingAuth } = useOrderPreviewState();

  if (checkingAuth && !error) {
    return (
      <div className={styles.container}><div className={styles.background} /><div className={styles.content}><div className={styles.card}>
        <div className={styles.loaderWrapper}><Loader label="" size="lg" /></div>
      </div></div></div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}><LogoIcon title="Ресурс-Плюс" /></Link>
          </div>

          {isLoading && <div className={styles.loaderWrapper}><Loader label="" size="lg" /></div>}

          {error && (
            <div className={styles.errorBlock}>
              <h2 className={styles.errorTitle}>Заказ не найден</h2>
              <p className={styles.errorText}>Возможно, заказ был удалён или ссылка недействительна</p>
            </div>
          )}

          {order && (
            <>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Название заказа</span>
                <h1 className={styles.orderTitle}>{order.title}</h1>
              </div>

              {order.company && (
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Название компании</span>
                  <span className={styles.company}>{order.company}</span>
                </div>
              )}

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Срок начала выполнения работ</span>
                  <span className={styles.metaValue}>{order.start_date || "—"}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Срок окончания выполнения работ</span>
                  <span className={styles.metaValue}>{order.date}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Бюджет</span>
                  <span className={styles.metaValue}>{order.sum}</span>
                </div>
                {order.responses_deadline && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Приём откликов до</span>
                    <span className={styles.metaValue}>{formatResponsesDeadline(order.responses_deadline)}</span>
                  </div>
                )}
              </div>

              {order.badges.length > 0 && (
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Требования к эксперту:</span>
                  <div className={styles.badges}>
                    {order.badges.map((badge) => (
                      <span key={badge.text} className={`${styles.badge} ${styles[variantClassMap[badge.variant] || "badgeGray"]}`}>
                        {badge.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {order.comment && (
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Комментарий заказчика</span>
                  <p className={styles.infoText}>{order.comment}</p>
                </div>
              )}

              {documentPaths(order.documents).length > 0 && (
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Прикреплённые файлы</span>
                  <div className={styles.filesGrid}>
                    {documentPaths(order.documents).map((file) => (
                      <div key={file} className={styles.fileItem}>
                        <span className={styles.fileIcon}>📎</span>
                        <span className={styles.fileName}>{getFileName(file)}</span>
                        <div className={styles.fileBlur} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.divider} />
              <p className={styles.ctaText}>Войдите или зарегистрируйтесь как эксперт, чтобы откликнуться на заказ</p>
              <div className={styles.actions}>
                <Link href="/login" className={styles.actionLink}>
                  <Button variant="chat" size="lg" fullWidth>Войти</Button>
                </Link>
                <Link href="/register" className={styles.actionLink}>
                  <Button variant="outlineOrange" size="lg" fullWidth>Зарегистрироваться</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
