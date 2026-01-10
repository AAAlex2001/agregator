"use client"

import React, { useState } from "react";
import { Button } from "@/app/components";
import Title from "@/app/components/Typography/Title";
import Subtitle from "@/app/components/Typography/Subtitle";
import {Input} from "@/app/components/";
import Header from "@/app/landing/header/Header";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [activeSection, setActiveSection] = useState<"personal" | "finance">("personal");

  const handleSwitchSection = (section: string) => {
    if (section === "personal") {
      setActiveSection("personal");
    } else if (section === "finance") {
      setActiveSection("finance");
    }
  };

  return (
    <>
    <Header />
    <div className={styles.container}>
      <div className={styles.content}>
        <Title text="Настройки профиля" as="h1" className={styles.title} />
        <div className={styles.buttons}>
          <Button variant="settings" size="sm" onClick={() => handleSwitchSection("personal")}>
            Личные данные
          </Button>
          <Button variant="settings" size="sm" onClick={() => handleSwitchSection("finance")}>
            Финансы
          </Button>
        </div>
        {activeSection === "personal" && (
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
              type="password"
              placeholder="Введите новый пароль"
              aria-label="Пароль"
              variant="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Повторите новый пароль"
              aria-label="Повторите пароль"
              variant="password"
              value={repeatPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
        )}
        {activeSection === "finance" && (
          <div className={styles.finance}>
            <Subtitle text="Финансовая информация" className={styles.subtitle} />
            <div className={styles.infoContent}>
            </div>
          </div>
        )}
      </div>

      <div className={styles.saveButtonWrapper}>
          <Button variant="chat" size="md" className={styles.saveButton} onClick={() => {/* Сохранение данных */}}>
             Сохранить изменения
          </Button>
      </div>
    </div>
    </>
  );
}
