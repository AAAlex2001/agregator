import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FullSheet, SheetHero, TextField } from "@/shared/ui";
import { useSession } from "@/features/session";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { PHONE_PLACEHOLDER, formatPhone, isPhoneComplete, phoneApiValue } from "@/shared/lib/phone";
import { type Role } from "@/shared/services/api";
import { confirmEmail, registerUser, resendCode } from "../model/api";
import s from "./register-sheet.module.scss";

const ROLE_META: Record<Role, { light: string; dark: string; title: string; desc: string }> = {
  CUSTOMER: {
    light: "/profile-hero/customer-light.webp",
    dark: "/profile-hero/customer-dark.webp",
    title: "Заказчик",
    desc: "Размещайте заказы и находите аттестованных экспертов",
  },
  EXPERT: {
    light: "/profile-hero/expert-light.webp",
    dark: "/profile-hero/expert-dark.webp",
    title: "Эксперт",
    desc: "Находите проекты и участвуйте в тендерах",
  },
  LICENSE_HOLDER: {
    light: "/profile-hero/license-light.webp",
    dark: "/profile-hero/license-dark.webp",
    title: "Держатель лицензии",
    desc: "Предоставляйте лицензию ЭПБ ОПО",
  },
};

export function RegisterSheet({ role, onClose }: { role: Role | null; onClose: () => void }) {
  const { signInLink } = useSession();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agree, setAgree] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const close = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setConfirm("");
    setPhone("");
    setFirstName("");
    setLastName("");
    setAgree(false);
    setCode("");
    setBusy(false);
    onClose();
  };

  const meta = role ? ROLE_META[role] : null;
  const nameOk = role !== "EXPERT" || (firstName.trim() !== "" && lastName.trim() !== "");
  const canSubmit = email.trim() !== "" && password.length >= 6 && password === confirm && agree && nameOk;

  const submitData = async () => {
    if (!role) return;
    setBusy(true);
    try {
      await registerUser({
        role,
        email: email.trim(),
        password,
        phone: isPhoneComplete(phone) ? phoneApiValue(phone) : undefined,
        first_name: role === "EXPERT" ? firstName.trim() : undefined,
        last_name: role === "EXPERT" ? lastName.trim() : undefined,
      });
      notifyHaptic("success");
      setStep(2);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось зарегистрироваться");
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async () => {
    if (!role) return;
    setBusy(true);
    try {
      await confirmEmail(email.trim(), code.trim(), role);
      await signInLink(email.trim(), password, role);
      notifyHaptic("success");
      close();
      navigate("/", { replace: true });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Неверный код");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!role) return;
    try {
      await resendCode(email.trim(), role);
      notifyHaptic("success");
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить код");
    }
  };

  const actions =
    step === 1 ? (
      <Button onClick={() => void submitData()} loading={busy} disabled={!canSubmit}>
        Далее
      </Button>
    ) : (
      <>
        <Button variant="outline" onClick={() => setStep(1)}>
          Назад
        </Button>
        <Button onClick={() => void submitCode()} loading={busy} disabled={code.trim().length < 4}>
          Подтвердить
        </Button>
      </>
    );

  return (
    <FullSheet
      open={role !== null}
      onClose={close}
      scrollKey={step}
      hero={
        meta && (
          <SheetHero
            light={meta.light}
            dark={meta.dark}
            textDark
            label={`Шаг ${step} из 2`}
            title={meta.title}
            desc={meta.desc}
            step={step}
            total={2}
            onClose={close}
          />
        )
      }
      footer={actions}
    >
      {role && (
        <div className={s.form}>
          {step === 1 ? (
            <>
              {role === "EXPERT" && (
                <>
                  <TextField label="Фамилия" placeholder="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  <TextField label="Имя" placeholder="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </>
              )}
              <TextField
                label="Электронная почта"
                type="email"
                inputMode="email"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Телефон (необязательно)"
                inputMode="tel"
                placeholder={PHONE_PLACEHOLDER}
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
              />
              <TextField label="Пароль" password placeholder="Не менее 6 символов" value={password} onChange={(e) => setPassword(e.target.value)} />
              <TextField label="Повторите пароль" password placeholder="Повторите пароль" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              <label className={s.agree}>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <span>Принимаю условия использования и политику конфиденциальности</span>
              </label>
            </>
          ) : (
            <>
              <p className={s.codeHint}>Мы отправили код подтверждения на {email.trim()}. Введите его ниже.</p>
              <TextField label="Код из письма" inputMode="numeric" placeholder="Код" value={code} onChange={(e) => setCode(e.target.value)} />
              <button type="button" className={s.resend} onClick={() => void resend()}>
                Отправить код повторно
              </button>
            </>
          )}
        </div>
      )}
    </FullSheet>
  );
}
