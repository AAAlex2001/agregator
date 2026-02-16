"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ProfileIcon,
  StarIcon,
  SettingsIcon,
  ReviewIcon,
  LogoutIcon,
} from "@/app/icons";
import styles from "./profileMenu.module.scss";

interface ProfileMenuProps {
  name: string;
  rating: number;
  reviewCount: number;
  role?: string;
  balance: string;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
  triggerAriaLabel?: string;
}

function useDisplayRole(roleProp?: string): string {
  const [displayRole, setDisplayRole] = useState(roleProp ?? "Эксперт");

  useEffect(() => {
    if (roleProp) {
      setDisplayRole(roleProp);
      return;
    }
    const stored = window.localStorage.getItem("user_role");
    if (stored === "CUSTOMER") {
      setDisplayRole("Заказчик");
    } else {
      setDisplayRole("Эксперт");
    }
  }, [roleProp]);

  return displayRole;
}

const ProfileMenu = ({
  name,
  rating,
  reviewCount,
  role: roleProp,
  balance,
  triggerIcon,
  triggerClassName,
  triggerAriaLabel,
}: ProfileMenuProps) => {
  const role = useDisplayRole(roleProp);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    closeMenu();
    router.push("/login");
  };

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const menuTabs =
    role === "Заказчик"
      ? [{ href: "/customer/orders", label: "Мои заказы" }]
      : [
          { href: "/expert/orders", label: "Все заказы" },
          { href: "/responses", label: "Мои отклики" },
          { href: "/reviews", label: "Отзывы" },
        ];

  return (
    <>
      <button
        className={`${styles.profileButton} ${triggerClassName ?? ""}`}
        onClick={toggleMenu}
        aria-label={triggerAriaLabel ?? "Открыть профиль"}
        aria-expanded={isOpen}
      >
        {triggerIcon ?? <ProfileIcon width={24} height={24} />}
      </button>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={closeMenu} />
          <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
            <div className={styles.mainInfo}>
              <div className={styles.avatar}>
                <ProfileIcon width={24} height={24} />
              </div>
              <div className={styles.content}>
                <div className={styles.profileInfo}>
                  <span className={styles.name}>{name}</span>
                  <div className={styles.ratingRow}>
                    <StarIcon className={styles.starIcon} filled />
                    <div className={styles.ratingDetails}>
                      <span className={styles.ratingValue}>
                        {rating.toFixed(1).replace(".", ",")}
                      </span>
                      <span className={styles.dot}>&middot;</span>
                      <span className={styles.reviewCount}>{reviewCount}</span>
                      <span className={styles.reviewLabel}>отзывов</span>
                    </div>
                  </div>
                </div>
                <div className={styles.roleBadge}>
                  <span className={styles.roleBadgeText}>{role}</span>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={closeMenu}
                aria-label="Закрыть меню"
              >
                <span className={styles.closeIcon} />
              </button>
            </div>

            <div className={styles.balanceSection}>
              <div className={styles.balanceInfo}>
                <span className={styles.balanceLabel}>Баланс</span>
                <div className={styles.balanceAmount}>
                  <span className={styles.balanceValue}>{balance}</span>
                  <span className={styles.balanceCurrency}>{"\u20bd"}</span>
                </div>
              </div>
              <button className={styles.topUpButton}>Пополнить</button>
            </div>

            <nav className={styles.menuTabs}>
              {menuTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`${styles.menuTab} ${
                    pathname === tab.href ? styles.menuTabActive : ""
                  }`}
                  onClick={closeMenu}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>

            <div className={styles.bottomLinks}>
              <Link
                href="/settings"
                className={styles.bottomLink}
                onClick={closeMenu}
              >
                <SettingsIcon />
                Настройки профиля
              </Link>
              <Link
                href="/reviews"
                className={styles.bottomLink}
                onClick={closeMenu}
              >
                <ReviewIcon />
                Отзывы
              </Link>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <LogoutIcon />
                Выйти
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileMenu;
