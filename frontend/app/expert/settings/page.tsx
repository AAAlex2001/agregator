"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BalanceTopUpModal, BalanceWithdrawModal, Button, Loader } from "@/app/components";
import { NotificationProvider, useNotifications } from "@/app/components/Notifications";
import Title from "@/app/components/Typography/Title";
import Subtitle from "@/app/components/Typography/Subtitle";
import { Input } from "@/app/components/";
import AuthHeader from "@/app/landing/header/AuthHeader";
import { fetchProfile, updateProfile, changePassword } from "@/app/settings/api";
import type { UserProfile } from "@/app/settings/api";
import { createPayment, fetchPaymentHistory, withdrawFunds } from "@/app/payments/api";
import type { PaymentItem } from "@/app/payments/api";
import styles from "./settings.module.scss";

function ExpertSettingsContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<"personal" | "finance">(
    searchParams.get("section") === "finance" ? "finance" : "personal"
  );
  const [isDepositing, setIsDepositing] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCard, setWithdrawCard] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const { showSuccess, showError } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const data = await fetchProfile();
      setProfile(data);
      setLastName(data.last_name || "");
      setFirstName(data.first_name || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");

      try {
        const history = await fetchPaymentHistory();
        setPayments(history);
      } catch {
        // игнорируем
      }
    } catch {
      showError("Не удалось загрузить профиль");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const formatBalance = (kopecks: number): string => {
    const rub = Math.floor(kopecks / 100);
    return rub.toLocaleString("ru-RU") + " ₽";
  };

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  const formatTransactionText = (item: PaymentItem): string => {
    const rub = Math.floor(item.amount / 100).toLocaleString("ru-RU");

    if (item.payment_type === "DEPOSIT") {
      if (item.status === "SUCCEEDED") return `Пополнение баланса +${rub} ₽`;
      if (item.status === "CANCELED") return `Пополнение баланса ${rub} ₽ (отменено)`;
      return `Пополнение баланса ${rub} ₽ (в обработке)`;
    }
    if (item.payment_type === "COMMISSION") {
      if (item.status === "SUCCEEDED") return `Комиссия за проект −${rub} ₽`;
      if (item.status === "CANCELED") return `Комиссия за проект ${rub} ₽ (отменено)`;
      return `Комиссия за проект −${rub} ₽ (в обработке)`;
    }
    if (item.payment_type === "WITHDRAWAL") {
      if (item.status === "SUCCEEDED") return `Вывод средств −${rub} ₽`;
      if (item.status === "CANCELED") return `Вывод средств ${rub} ₽ (отменено)`;
      return `Вывод средств −${rub} ₽ (в обработке)`;
    }
    if (item.status === "REFUNDED") return `Возврат средств +${rub} ₽`;
    return `Операция ${rub} ₽`;
  };

  const handleDeposit = async () => {
    if (isDepositing) return;
    const rub = parseFloat(topUpAmount.replace(/\s/g, "").replace(",", "."));
    if (!rub || rub <= 0) {
      showError("Введите корректную сумму");
      return;
    }
    setIsDepositing(true);
    try {
      const kopecks = Math.round(rub * 100);
      const returnUrl = `${window.location.origin}/expert/settings?section=finance`;
      const { confirmation_url } = await createPayment(kopecks, returnUrl);
      setIsTopUpModalOpen(false);
      window.location.href = confirmation_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка создания платежа";
      showError(message);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) return;
    const rub = parseFloat(withdrawAmount.replace(/\s/g, "").replace(",", "."));
    if (!rub || rub <= 0) {
      showError("Введите корректную сумму");
      return;
    }
    const card = withdrawCard.replace(/\s/g, "");
    if (!card || card.length < 13 || card.length > 19) {
      showError("Введите корректный номер карты");
      return;
    }
    setIsWithdrawing(true);
    try {
      const kopecks = Math.round(rub * 100);
      const result = await withdrawFunds(kopecks, card);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
      setWithdrawCard("");
      setProfile((prev) => prev ? { ...prev, balance: result.new_balance } : prev);
      showSuccess("Заявка на вывод создана");
      const history = await fetchPaymentHistory();
      setPayments(history);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка вывода средств";
      showError(message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (activeSection === "personal") {
        const updated = await updateProfile({
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
          email: email || undefined,
        });
        setProfile(updated);

        if (password) {
          if (password !== repeatPassword) {
            showError("Пароли не совпадают");
            setIsSaving(false);
            return;
          }
          if (password.length < 8) {
            showError("Пароль должен быть не менее 8 символов");
            setIsSaving(false);
            return;
          }
          await changePassword(password, repeatPassword);
          setPassword("");
          setRepeatPassword("");
        }

        showSuccess("Данные сохранены");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка сохранения";
      showError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Настройки профиля" as="h1" className={styles.pageTitle} />
          <Subtitle text="Управляйте личными данными и финансами" className={styles.pageSubtitle} />
        </div>

        <div className={styles.content}>
          <div className={styles.buttons}>
            <Button variant="settings" size="sm" onClick={() => setActiveSection("personal")} isActive={activeSection === "personal"}>
              Личные данные
            </Button>
            <Button variant="settings" size="sm" onClick={() => setActiveSection("finance")} isActive={activeSection === "finance"}>
              Финансы
            </Button>
          </div>

          {isLoadingProfile ? (
            <div className={styles.loaderWrapper}>
              <Loader label="" size="lg" />
            </div>
          ) : activeSection === "personal" ? (
            <div className={styles.data}>
              <Subtitle text="Персональные данные" className={styles.subtitle} />
              <div className={styles.info}>
                <div className={styles.infoContent}>
                  <Input
                    type="text"
                    placeholder="Фамилия"
                    aria-label="Фамилия"
                    value={lastName}
                    variant="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  />
                  <Input
                    type="tel"
                    placeholder="Введите телефон"
                    aria-label="Телефон"
                    value={phone}
                    variant="phone"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Имя"
                    aria-label="Имя"
                    value={firstName}
                    variant="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Введите электронную почту"
                    aria-label="Электронная почта"
                    value={email}
                    variant="email"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Subtitle text="Изменить пароль" className={styles.subtitle} />
              <div className={styles.passwordSection}>
                <div className={styles.infoContent}>
                  <Input
                    placeholder="Введите новый пароль"
                    aria-label="Пароль"
                    variant="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Повторите новый пароль"
                    aria-label="Повторите пароль"
                    variant="password"
                    value={repeatPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.finance}>
              <Subtitle text={`Баланс: ${formatBalance(profile?.balance ?? 0)}`} className={styles.financeSubtitle} />

              <div className={styles.financeButtons}>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  className={styles.financeActionButton}
                  onClick={() => {
                    setWithdrawAmount("");
                    setWithdrawCard("");
                    setIsWithdrawModalOpen(true);
                  }}
                  isLoading={isWithdrawing}
                >
                  Вывести средства
                </Button>
                <Button
                  variant="chat"
                  size="md"
                  fullWidth
                  className={styles.financeActionButton}
                  onClick={() => {
                    setTopUpAmount("");
                    setIsTopUpModalOpen(true);
                  }}
                  isLoading={isDepositing}
                >
                  Пополнить
                </Button>
              </div>

              {payments.length > 0 ? (
                <div className={styles.financeColumns}>
                  {(() => {
                    const mid = Math.ceil(payments.length / 2);
                    const left = payments.slice(0, mid);
                    const right = payments.slice(mid);
                    return (
                      <>
                        <div className={styles.transactionColumn}>
                          {left.map((item) => (
                            <div key={item.id} className={styles.transaction}>
                              <span className={styles.transactionDate}>{formatDate(item.created_at)}</span>
                              <span className={styles.transactionText}>{formatTransactionText(item)}</span>
                            </div>
                          ))}
                        </div>
                        {right.length > 0 && (
                          <div className={styles.transactionColumn}>
                            {right.map((item) => (
                              <div key={item.id} className={styles.transaction}>
                                <span className={styles.transactionDate}>{formatDate(item.created_at)}</span>
                                <span className={styles.transactionText}>{formatTransactionText(item)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className={styles.emptyHistory}>Операций пока нет</p>
              )}
            </div>
          )}
        </div>

        {activeSection === "personal" && (
          <div className={styles.saveButtonWrapper}>
            <Button
              variant="chat"
              size="md"
              className={styles.saveButton}
              onClick={() => void handleSave()}
              isLoading={isSaving}
            >
              Сохранить изменения
            </Button>
          </div>
        )}

        <BalanceTopUpModal
          isOpen={isTopUpModalOpen}
          amount={topUpAmount}
          onAmountChange={setTopUpAmount}
          onClose={() => setIsTopUpModalOpen(false)}
          onSubmit={() => void handleDeposit()}
          isSubmitting={isDepositing}
        />

        <BalanceWithdrawModal
          isOpen={isWithdrawModalOpen}
          amount={withdrawAmount}
          cardNumber={withdrawCard}
          onAmountChange={setWithdrawAmount}
          onCardNumberChange={setWithdrawCard}
          onClose={() => setIsWithdrawModalOpen(false)}
          onSubmit={() => void handleWithdraw()}
          isSubmitting={isWithdrawing}
          balance={profile?.balance ?? 0}
        />
      </div>
    </>
  );
}

export default function ExpertSettingsPage() {
  return (
    <NotificationProvider>
      <React.Suspense
        fallback={
          <>
            <AuthHeader />
            <div className={styles.wrapper}>
              <div className={styles.loaderWrapper}>
                <Loader label="" size="lg" />
              </div>
            </div>
          </>
        }
      >
        <ExpertSettingsContent />
      </React.Suspense>
    </NotificationProvider>
  );
}
