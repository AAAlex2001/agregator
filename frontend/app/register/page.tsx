"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/app/components";
import { LogoIcon } from "@/app/icons";
import styles from "./register.module.scss";

const roles = [
  {
    id: 1,
    title: "Заказчик",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.7097 8.70993C22.9597 7.45993 22.3897 5.99993 21.7097 5.28993L18.7097 2.28993C17.4497 1.03993 15.9997 1.60993 15.2897 2.28993L13.5897 3.99993H10.9997C9.09969 3.99993 7.99968 4.99993 7.43968 6.14993L2.99968 10.5899V14.5899L2.28968 15.2899C1.03968 16.5499 1.60968 17.9999 2.28968 18.7099L5.28968 21.7099C5.82968 22.2499 6.40968 22.4499 6.95968 22.4499C7.66968 22.4499 8.31968 22.0999 8.70968 21.7099L11.4097 18.9999H14.9997C16.6997 18.9999 17.5597 17.9399 17.8697 16.8999C18.9997 16.5999 19.6197 15.7399 19.8697 14.8999C21.4197 14.4999 21.9997 13.0299 21.9997 11.9999V8.99993H21.4097L21.7097 8.70993ZM19.9997 11.9999C19.9997 12.4499 19.8097 12.9999 18.9997 12.9999H17.9997V13.9999C17.9997 14.4499 17.8097 14.9999 16.9997 14.9999H15.9997V15.9999C15.9997 16.4499 15.8097 16.9999 14.9997 16.9999H10.5897L7.30968 20.2799C6.99968 20.5699 6.81968 20.3999 6.70968 20.2899L3.71968 17.3099C3.42968 16.9999 3.59968 16.8199 3.70968 16.7099L4.99968 15.4099V11.4099L6.99968 9.40993V10.9999C6.99968 12.2099 7.79969 13.9999 9.99969 13.9999C12.1997 13.9999 12.9997 12.2099 12.9997 10.9999H19.9997V11.9999ZM20.2897 7.28993L18.5897 8.99993H10.9997V10.9999C10.9997 11.4499 10.8097 11.9999 9.99969 11.9999C9.18969 11.9999 8.99968 11.4499 8.99968 10.9999V7.99993C8.99968 7.53993 9.16969 5.99993 10.9997 5.99993H14.4097L16.6897 3.71993C16.9997 3.42993 17.1797 3.59993 17.2897 3.70993L20.2797 6.68993C20.5697 6.99993 20.3997 7.17993 20.2897 7.28993Z" fill="url(#paint0_linear_1023_1662)"/>
        <defs>
        <linearGradient id="paint0_linear_1023_1662" x1="1.55078" y1="12.0005" x2="22.4486" y2="12.0005" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB800"/>
        <stop offset="1" stopColor="#FF8A00"/>
        </linearGradient>
        </defs>
      </svg>

    ),
    expandedTitle: "Найдите эксперта по промышленной безопасности",
    description: [
      "Разместите заказ на платформе",
      "Договаривайтесь с подходящими аттестованными экспертами",
      "Напишите отзыв и оцените работу"
    ],
    photo: "/advantages__3.jpg"
  },
  {
    id: 2,
    title: "Эксперт",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.8025 4.50012C6.95483 3.44231 7.42636 2.45619 8.15408 1.67351C8.8818 0.890842 9.83106 0.348904 10.875 0.120117V2.62512C10.875 2.92349 10.9935 3.20963 11.2045 3.42061C11.4155 3.63159 11.7016 3.75012 12 3.75012C12.2984 3.75012 12.5845 3.63159 12.7955 3.42061C13.0065 3.20963 13.125 2.92349 13.125 2.62512V0.120117C14.1687 0.349174 15.1176 0.89123 15.845 1.67388C16.5725 2.45653 17.0438 3.44251 17.196 4.50012H17.625C17.9234 4.50012 18.2095 4.61864 18.4205 4.82962C18.6315 5.0406 18.75 5.32675 18.75 5.62512C18.75 5.92349 18.6315 6.20963 18.4205 6.42061C18.2095 6.63159 17.9234 6.75012 17.625 6.75012H17.25C17.25 8.1425 16.6969 9.47786 15.7123 10.4624C14.7277 11.447 13.3924 12.0001 12 12.0001C10.6076 12.0001 9.27226 11.447 8.28769 10.4624C7.30312 9.47786 6.75 8.1425 6.75 6.75012H6.375C6.07663 6.75012 5.79048 6.63159 5.5795 6.42061C5.36853 6.20963 5.25 5.92349 5.25 5.62512C5.25 5.32675 5.36853 5.0406 5.5795 4.82962C5.79048 4.61864 6.07663 4.50012 6.375 4.50012H6.8025ZM12 9.75012C11.2044 9.75012 10.4413 9.43405 9.87868 8.87144C9.31607 8.30883 9 7.54577 9 6.75012H15C15 7.54577 14.6839 8.30883 14.1213 8.87144C13.5587 9.43405 12.7956 9.75012 12 9.75012ZM3.75 18.7501C3.75 18.4441 4.08 17.5366 5.73 16.5616C5.84016 16.4967 5.95168 16.4342 6.0645 16.3741L7.515 20.2501H5.25C4.85218 20.2501 4.47064 20.0921 4.18934 19.8108C3.90804 19.5295 3.75 19.1479 3.75 18.7501ZM9.921 20.2501L8.1525 15.5371C9.40326 15.1776 10.6986 14.9968 12 15.0001C13.395 15.0001 14.7 15.2026 15.8475 15.5356L14.0805 20.2501H9.921ZM16.4835 20.2501H18.75C19.1478 20.2501 19.5294 20.0921 19.8107 19.8108C20.092 19.5295 20.25 19.1479 20.25 18.7501C20.25 18.4441 19.92 17.5366 18.27 16.5616C18.1598 16.4967 18.0483 16.4342 17.9355 16.3741L16.4835 20.2501ZM12 12.7501C6.225 12.7501 1.5 15.7501 1.5 18.7501C1.5 19.7447 1.89509 20.6985 2.59835 21.4018C3.30161 22.105 4.25544 22.5001 5.25 22.5001H18.75C19.7446 22.5001 20.6984 22.105 21.4016 21.4018C22.1049 20.6985 22.5 19.7447 22.5 18.7501C22.5 15.7501 17.775 12.7501 12 12.7501Z" fill="url(#paint0_linear_1023_1638)"/>
        <defs>
        <linearGradient id="paint0_linear_1023_1638" x1="1.5" y1="11.3101" x2="22.5" y2="11.3101" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB800"/>
        <stop offset="1" stopColor="#FF8A00"/>
        </linearGradient>
        </defs>
      </svg>

    ),
    expandedTitle: "Находите проекты и укрепляйте репутацию, расширяя портфолио",
    description: [
      "Найдите свой проект и участвуйте в тендере",
      "Договаривайтесь напрямую",
      "Выполните заказ, получите отзыв и оценку"
    ],
    photo: "/advantages_1.jpg"
  }
];

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [openedCardId, setOpenedCardId] = useState<number | null>(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const toggleCard = (id: number) => {
    setOpenedCardId((prev) => (prev === id ? null : id));
  };

  const handleSelectRole = (roleId: number) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Регистрация:", { role: selectedRole, login, password });
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.content}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <LogoIcon title="Ресурс-Плюс" />
            </Link>
          </div>

          <div className={styles.stepsHeader}>
            <h2 className={styles.registrationTitle}>Регистрация</h2>
            <span className={styles.stepIndicator}>
              {step === 1 ? "Шаг 1. Выбор роли" : "Шаг 2. Данные"}
            </span>
          </div>

          {step === 1 ? (
            <div className={styles.stepContent} key="step1">
              <div className={styles.rolesContainer}>
                {roles.map((role) => {
                  const isOpen = openedCardId === role.id;
                  return (
                    <div
                      key={role.id}
                      className={`${styles.roleCard} ${isOpen ? styles.roleCardOpen : ''}`}
                      onClick={() => toggleCard(role.id)}
                    >
                      {role.photo && (
                        <div className={`${styles.roleImage} ${isOpen ? styles.visible : ''}`}>
                          <Image src={role.photo} alt={role.title} fill style={{ objectFit: "cover" }} />
                        </div>
                      )}
                      <div className={styles.roleContent}>
                        <div className={styles.roleHeader}>
                          <div className={styles.roleIcon}>{role.icon}</div>
                          <h3 className={styles.roleTitle}>{role.title}</h3>
                          <svg
                            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 9L12 15L18 9" stroke="#FFB800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className={`${styles.roleDescriptionWrapper} ${isOpen ? styles.roleDescriptionOpen : ''}`}>
                          <div className={styles.roleDescriptionInner}>
                            <h4 className={styles.expandedTitle}>{role.expandedTitle}</h4>
                            <ul className={styles.descriptionList}>
                              {role.description.map((item, index) => (
                                <li key={index} className={styles.descriptionItem}>
                                  <span className={styles.bullet}>

                                      <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 0C2.84844 0 2.69689 0.0541395 2.57781 0.173246L0.17456 2.57704C-0.0581868 2.80984 -0.0581868 3.18881 0.17456 3.42161L2.57781 5.8254C2.81056 6.0582 3.18945 6.0582 3.42219 5.8254L5.82544 3.42161C6.05819 3.18881 6.05819 2.80984 5.82544 2.57704L3.42219 0.173246C3.30311 0.0541395 3.15156 0 3 0Z" fill="url(#paint0_linear_1064_1184)"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_1064_1184" x1="0" y1="3" x2="6" y2="3" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FFB800"/>
                                        <stop offset="1" stopColor="#FF8A00"/>
                                        </linearGradient>
                                        </defs>
                                      </svg>

                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <button
                              className={styles.selectButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectRole(role.id);
                              }}
                            >
                              Выбрать
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={styles.stepContent} key="step2">
              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  id="login"
                  variant="emailOrPhone"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Электронная почта или телефон"
                  required
                />

                <Input
                  id="password"
                  variant="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  required
                />

                <Input
                  id="repeatPassword"
                  variant="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />

                <button type="submit" className={styles.submitButton}>
                  Зарегистрироваться
                </button>
              </form>
            </div>
          )}

          <div className={styles.footer}>
            <p>
              Уже есть аккаунт?{" "}
              <Link href="/login" className={styles.link}>
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

