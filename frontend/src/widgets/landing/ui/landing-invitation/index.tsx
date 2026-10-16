"use client";

import { Button } from "@/shared/ui/button";
import { BulletIcon } from "@/shared/ui/icons";
import { Title } from "@/shared/ui/title";
import { REGISTRATION_BENEFITS } from "../../config/registration-benefits";
import { InvitationDecoration } from "../invitation-decoration";
import styles from "./style.module.scss";

/** Действие открытия регистрации, переданное приложением. */
interface LandingInvitationProps {
  onRegister: () => void;
}

/** Приглашает зарегистрироваться и перечисляет возможности платформы. */
export function LandingInvitation({ onRegister }: LandingInvitationProps) {
  return (
    <section
      className={styles.footer}
      id="cta"
    >
      <div className={styles.cta}>
        <div className={styles.ctaCard}>
          <InvitationDecoration />
          <div className={styles.ctaLeft}>
            <button
              type="button"
              className={styles.ctaChip}
              onClick={onRegister}
            >
              Действуйте прямо сейчас
            </button>
            <Title
              as="h2"
              text="Найдите исполнителя по промышленной безопасности или заявите о своей специализации"
            />
          </div>

          <div className={styles.ctaRight}>
            <Title
              as="h2"
              text="После регистрации вы сможете:"
            />
            <ul>
              {REGISTRATION_BENEFITS.map((benefit) => (
                <li key={benefit}>
                  <span
                    aria-hidden="true"
                    className={styles.bullet}
                  >
                    <BulletIcon />
                  </span>
                  <span className={styles.liText}>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className={styles.ctaActions}>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={onRegister}
              >
                Найти исполнителя
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={onRegister}
              >
                Стать исполнителем на платформе
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
