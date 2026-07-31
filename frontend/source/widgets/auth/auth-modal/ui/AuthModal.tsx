"use client";

import { useState } from "react";
import { Modal } from "@/source/shared/ui/Modal";
import Tabs from "@/source/shared/ui/Tabs";
import type { AuthTab } from "@/source/shared/lib/auth-modal";
import { LoginTab } from "./LoginTab";
import { RegisterTab } from "./RegisterTab";
import { ForgotFlow } from "./ForgotFlow";
import s from "./auth-modal.module.scss";

interface Props {
  initialTab: AuthTab;
  onClose: () => void;
}

const TABS = [
  { id: "login", label: "Вход" },
  { id: "register", label: "Регистрация" },
];

export function AuthModal({ initialTab, onClose }: Props) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [forgot, setForgot] = useState(false);

  return (
    <Modal open onClose={onClose} size="md" ariaLabel="Авторизация" dialogClassName={s.dialog}>
      {forgot ? (
        <div className={s.scrollArea}>
          <ForgotFlow onBack={() => setForgot(false)} />
        </div>
      ) : (
        <>
          <Tabs
            variant="squared"
            tabs={TABS}
            activeTab={tab}
            onTabChange={(id) => setTab(id as AuthTab)}
            className={s.tabs}
          />
          <div className={s.scrollArea}>
            {tab === "login" ? (
              <LoginTab onSuccess={onClose} onForgot={() => setForgot(true)} />
            ) : (
              <RegisterTab onSuccess={onClose} />
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
