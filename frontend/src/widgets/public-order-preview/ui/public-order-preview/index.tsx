import Link from "next/link";
import type { PublicOrder } from "@/entities/order";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { LogoIcon } from "@/shared/ui/icons";
import { Loader } from "@/shared/ui/loader";
import { AuthenticationActions } from "../authentication-actions";
import { OrderDetails } from "../order-details";
import styles from "./style.module.scss";

/** Данные публичного заказа, состояние страницы и действия авторизации. */
interface PublicOrderPreviewProps {
  order: PublicOrder | null;
  error: string | null;
  isLoading: boolean;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

/** Показывает заказ по публичной ссылке и приглашение войти для отклика. */
export function PublicOrderPreview({
  order,
  error,
  isLoading,
  onOpenLogin,
  onOpenRegister,
}: PublicOrderPreviewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link
              href="/"
              className={styles.logo}
            >
              <LogoIcon title="Ресурс-Плюс" />
            </Link>
          </div>

          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Заявки", href: "/orders" },
              { label: order?.title || "Заказ" },
            ]}
          />

          {isLoading && !error && (
            <div className={styles.loaderWrapper}>
              <Loader
                label=""
                size="lg"
              />
            </div>
          )}

          {error && (
            <div className={styles.errorBlock}>
              <h2 className={styles.errorTitle}>Заказ не найден</h2>
              <p className={styles.errorText}>
                Возможно, заказ был удалён или ссылка недействительна
              </p>
            </div>
          )}

          {order && !isLoading && (
            <>
              <OrderDetails order={order} />
              <AuthenticationActions
                onOpenLogin={onOpenLogin}
                onOpenRegister={onOpenRegister}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
