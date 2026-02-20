"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChatHeaderIcon,
  LogoIcon,
  LogoMarkIcon,
  NotificationsHeaderIcon,
  ProfileHeaderIcon,
} from "@/app/icons";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import ProfileMenu from "./ProfileMenu";
import styles from "./authHeader.module.scss";

interface AuthHeaderProps {
  name?: string;
  rating?: number;
  reviewCount?: number;
  role?: string;
  balance?: string;
}

const AuthHeader = ({
  name: nameProp,
  rating: ratingProp,
  reviewCount: reviewCountProp,
  role: roleProp,
  balance: balanceProp,
}: AuthHeaderProps) => {
  const { displayName, balance: profileBalance, rating: profileRating, reviewCount: profileReviewCount, role: profileRole } = useUserProfile();
  const pathname = usePathname();
  const router = useRouter();

  const rawRole = roleProp ?? profileRole;
  const role = rawRole === "CUSTOMER" ? "Заказчик" : "Эксперт";
  const settingsHref = role === "Заказчик" ? "/customer/settings" : "/expert/settings";

  const name = nameProp ?? displayName;
  const rating = ratingProp ?? profileRating;
  const reviewCount = reviewCountProp ?? profileReviewCount;
  const balanceKopecks = profileBalance;
  const balance = balanceProp ?? Math.floor(balanceKopecks / 100).toLocaleString("ru-RU");
  const iconMotion = {
    whileHover: { y: -2, scale: 1.06 },
    whileTap: { scale: 0.96 },
    transition: { type: "spring" as const, stiffness: 420, damping: 20 },
  };

  const navLinks =
    role === "Заказчик"
      ? [
          { href: "/customer/orders", label: "Мои заказы" },
          { href: "/customer/responses", label: "Отклики" },
        ]
      : [
          { href: "/expert/orders", label: "Все заказы" },
          { href: "/expert/responses", label: "Мои отклики" },
          { href: "/expert/reviews", label: "Отзывы" },
        ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href={settingsHref} className={styles.logo}>
            <span className={styles.logoMobile}>
              <LogoMarkIcon />
            </span>
            <span className={styles.logoDesktop}>
              <LogoIcon />
            </span>
          </Link>
        </div>
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.navActive : undefined}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <div className={styles.iconsRow}>
            <motion.button
              className={styles.iconRounded}
              type="button"
              aria-label="Чат"
              onClick={() => router.push(role === "Заказчик" ? "/customer/chat" : "/expert/chat")}
              {...iconMotion}
            >
              <ChatHeaderIcon />
            </motion.button>
            <motion.button
              className={styles.iconRounded}
              type="button"
              aria-label="Уведомления"
              {...iconMotion}
            >
              <NotificationsHeaderIcon />
            </motion.button>
            <div className={styles.profileDesktopTrigger}>
              <ProfileMenu
                name={name}
                rating={rating}
                reviewCount={reviewCount}
                role={role}
                balance={balance}
                triggerIcon={(
                  <motion.span className={styles.profileIconMotion} {...iconMotion}>
                    <ProfileHeaderIcon />
                  </motion.span>
                )}
                triggerClassName={styles.profileTriggerButton}
                triggerAriaLabel="Открыть профиль"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
