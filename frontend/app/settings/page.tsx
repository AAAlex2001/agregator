"use client"

import React, { useState } from "react";
import { Button } from "@/app/components";
import Title from "@/app/components/Typography/Title";
import Subtitle from "@/app/components/Typography/Subtitle";
import {Input} from "@/app/components/";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className={styles.container}>
      <Title text="Настройки" as="h1" className={styles.title} />
      <div className={styles.buttons}>
        <Button variant="settings" size="sm" onClick={() => {/* переключение секции при необходимости */}}>
          Личные данные
        </Button>
        <Button variant="settings" size="sm" onClick={() => {/* переключение секции при необходимости */}}>
          Финансы
        </Button>
      </div>
      <div className={styles.info}>
        <Subtitle text="Персональные данные" className={styles.subtitle} />
        <div className={styles.infoContent}>
          <Input
            type="text"
            placeholder="Фамилия"
            aria-label="Фамилия"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          />
          <Input
            type="tel"
            placeholder="Введите телефон"
            aria-label="Телефон"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Имя"
            aria-label="Имя"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Введите электронную почту"
            aria-label="Электронная почта"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
