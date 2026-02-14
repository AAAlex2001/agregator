"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BurgerHeaderIcon,
  ChatHeaderIcon,
  LogoIcon,
  LogoMarkIcon,
  NotificationsHeaderIcon,
  ProfileHeaderIcon,
} from "@/app/icons";
import ProfileMenu from "./ProfileMenu";
import styles from "./authHeader.module.scss";

interface AuthHeaderProps {
  name: string;
  rating: number;
  reviewCount: number;
  role: string;
  balance: string;
}

const AuthHeader = ({
  name,
  rating,
  reviewCount,
  role,
  balance,
}: AuthHeaderProps) => {
  const pathname = usePathname();
  const iconMotion = {
    whileHover: { y: -2, scale: 1.06 },
    whileTap: { scale: 0.96 },
    transition: { type: "spring" as const, stiffness: 420, damping: 20 },
  };

  const navLinks = [
    { href: "/orders", label: "Все заказы" },
    { href: "/responses", label: "Мои отклики" },
    { href: "/reviews", label: "Отзывы" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
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
          <div className={styles.burgerTriggerWrap}>
            <ProfileMenu
              name={name}
              rating={rating}
              reviewCount={reviewCount}
              role={role}
              balance={balance}
              triggerIcon={<BurgerHeaderIcon />}
              triggerClassName={styles.burgerTriggerButton}
              triggerAriaLabel="Открыть меню"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
