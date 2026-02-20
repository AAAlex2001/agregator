"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BalanceTopUpModal } from "@/app/components";
import { createPayment } from "@/app/payments/api";
import {
  ProfileIcon,
  StarIcon,
  SettingsIcon,
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
  const role = roleProp ?? "Эксперт";
  const [isOpen, setIsOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiBaseUrl) {
        await fetch(`${apiBaseUrl}/login/logout`, {
          method: "POST",
          credentials: "include",
        });
      }
    } catch {
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    closeMenu();
    router.push("/login");
  };

  const handleDeposit = async () => {
    if (isDepositing) return;

    const rub = parseFloat(topUpAmount.replace(/\s/g, "").replace(",", "."));
    if (!rub || rub <= 0) {
      return;
    }

    setIsDepositing(true);
    try {
      const kopecks = Math.round(rub * 100);
      const returnUrl = window.location.href;
      const { confirmation_url } = await createPayment(kopecks, returnUrl);
      setIsTopUpModalOpen(false);
      window.location.href = confirmation_url;
    } catch {
      setIsTopUpModalOpen(false);
      router.push("/settings?section=finance");
    } finally {
      setIsDepositing(false);
    }
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

  const menuTabs: Array<{ href: string; label: string }> = [];

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
                  {reviewCount > 0 ? (
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
                  ) : (
                    <span className={styles.noReviews}>Отзывов пока нет</span>
                  )}
                </div>
                <div className={styles.roleBadge}>
                  <span className={styles.roleBadgeText}>{role}</span>
                </div>
              </div>
            </div>

            <div className={styles.balanceSection}>
              <div className={styles.balanceInfo}>
                <span className={styles.balanceLabel}>Баланс</span>
                <div className={styles.balanceAmount}>
                  <span className={styles.balanceValue}>{balance}</span>
                  <span className={styles.balanceCurrency}>{"\u20bd"}</span>
                </div>
              </div>
              <button
                className={styles.topUpButton}
                onClick={() => {
                  closeMenu();
                  setTopUpAmount("");
                  setIsTopUpModalOpen(true);
                }}
              >
                Пополнить
              </button>
            </div>

            {menuTabs.length > 0 && (
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
            )}

            <div className={styles.bottomLinks}>
              <Link
                href="/settings"
                className={styles.bottomLink}
                onClick={closeMenu}
              >
                <SettingsIcon />
                Настройки профиля
              </Link>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <LogoutIcon />
                Выйти
              </button>
            </div>
          </div>
        </>
      )}

      <BalanceTopUpModal
        isOpen={isTopUpModalOpen}
        amount={topUpAmount}
        onAmountChange={setTopUpAmount}
        onClose={() => setIsTopUpModalOpen(false)}
        onSubmit={() => void handleDeposit()}
        isSubmitting={isDepositing}
      />
    </>
  );
};

export default ProfileMenu;
