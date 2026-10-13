"use client";

import cn from "classnames";
import Link from "next/link";
import { documentPaths } from "@/source/entities/order";
import { getFileDisplayName } from "@/source/shared/lib/filePreview";
import { formatMoscowDateTime } from "@/source/shared/lib/formatDate";
import { AuthTrigger } from "@/source/shared/ui/AuthTrigger";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { LogoIcon } from "@/source/shared/ui/icons";
import Loader from "@/source/shared/ui/Loader";
import { useOrderPreview } from "../model/useOrderPreview";
import s from "./OrderPreview.module.scss";

interface OrderPreviewProps {
  uuid: string;
}

/** Заказ по ссылке для гостя: условия без контактов и приглашение войти, чтобы откликнуться. */
export function OrderPreview({ uuid }: OrderPreviewProps) {
  const { order, error, isLoading } = useOrderPreview(uuid);

  return (
    <div className={s.container}>
      <div className={s.background} />
      <div className={s.content}>
        <div className={s.card}>
          <div className={s.header}>
            <Link href="/" className={s.logo}>
              <LogoIcon title="Ресурс-Плюс" />
            </Link>
          </div>

          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Заявки", href: "/orders" }, { label: order?.title || "Заказ" }]} />

          {isLoading && !error && (
            <div className={s.loaderWrapper}>
              <Loader label="" size="lg" />
            </div>
          )}

          {error && (
            <div className={s.errorBlock}>
              <h2 className={s.errorTitle}>Заказ не найден</h2>
              <p className={s.errorText}>Возможно, заказ был удалён или ссылка недействительна</p>
            </div>
          )}

          {order && !isLoading && (
            <>
              <div className={s.infoBlock}>
                <span className={s.infoLabel}>Название заказа</span>
                <h1 className={s.orderTitle}>{order.title}</h1>
              </div>

              {order.company && (
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Название компании</span>
                  <span className={s.company}>{order.company}</span>
                </div>
              )}

              <div className={s.meta}>
                <div className={s.metaItem}>
                  <span className={s.metaLabel}>Срок начала выполнения работ</span>
                  <span className={s.metaValue}>{order.start_date || "—"}</span>
                </div>
                <div className={s.metaItem}>
                  <span className={s.metaLabel}>Срок окончания выполнения работ</span>
                  <span className={s.metaValue}>{order.date}</span>
                </div>
                <div className={s.metaItem}>
                  <span className={s.metaLabel}>Бюджет</span>
                  <span className={s.metaValue}>{order.sum}</span>
                </div>
                {order.responses_deadline && (
                  <div className={s.metaItem}>
                    <span className={s.metaLabel}>Приём откликов до (МСК)</span>
                    <span className={s.metaValue}>{formatMoscowDateTime(order.responses_deadline)}</span>
                  </div>
                )}
              </div>

              {order.badges.length > 0 && (
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Требования к исполнителю:</span>
                  <div className={s.badges}>
                    {order.badges.map((badge) => (
                      <span key={badge.text} className={cn(s.badge, s[badge.variant.toLowerCase()] ?? s.gray)}>
                        {badge.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {order.comment && (
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Комментарий заказчика</span>
                  <p className={s.infoText}>{order.comment}</p>
                </div>
              )}

              {documentPaths(order.documents).length > 0 && (
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Прикреплённые файлы</span>
                  <div className={s.filesGrid}>
                    {documentPaths(order.documents).map((file) => (
                      <div key={file} className={s.fileItem}>
                        <span className={s.fileIcon}>📎</span>
                        <span className={s.fileName}>{getFileDisplayName(file)}</span>
                        <div className={s.fileBlur} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={s.divider} />
              <p className={s.ctaText}>Войдите или зарегистрируйтесь как исполнитель, чтобы откликнуться на заказ</p>
              <div className={s.actions}>
                <div className={s.actionLink}>
                  <AuthTrigger tab="login" variant="chat" size="lg" fullWidth>
                    Войти
                  </AuthTrigger>
                </div>
                <div className={s.actionLink}>
                  <AuthTrigger tab="register" variant="outlineOrange" size="lg" fullWidth>
                    Зарегистрироваться
                  </AuthTrigger>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
