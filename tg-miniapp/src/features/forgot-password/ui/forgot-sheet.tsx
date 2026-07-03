import { Button, CodeInput, FullSheet, SheetHero, TextField } from "@/shared/ui";
import { useForgotPassword } from "../model/use-forgot-password";
import s from "./forgot-sheet.module.scss";

const HERO = { light: "/profile-hero/change-mail-light.webp", dark: "/profile-hero/change-mail-dark.webp" };

const STEP_META: Record<number, { label: string; title: string; desc: string }> = {
  1: { label: "Шаг 1 из 2", title: "Восстановление пароля", desc: "Укажите почту — вышлем код" },
  2: { label: "Шаг 2 из 2", title: "Новый пароль", desc: "Введите код из письма и новый пароль" },
  3: { label: "Готово", title: "Пароль изменён", desc: "Войдите с новым паролем" },
};

export function ForgotSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { step, email, code, password, busy, setEmail, setCode, setPassword, sendCode, submitReset } =
    useForgotPassword(open);
  const meta = STEP_META[step];

  const actions =
    step === 1 ? (
      <Button onClick={() => void sendCode()} loading={busy} disabled={email.trim() === ""}>
        Отправить код
      </Button>
    ) : step === 2 ? (
      <Button
        onClick={() => void submitReset()}
        loading={busy}
        disabled={code.trim().length < 4 || password.length < 6}
      >
        Изменить пароль
      </Button>
    ) : (
      <Button onClick={onClose}>Войти</Button>
    );

  return (
    <FullSheet
      open={open}
      onClose={onClose}
      scrollKey={step}
      hero={
        <SheetHero
          light={HERO.light}
          dark={HERO.dark}
          textDark
          label={meta.label}
          title={meta.title}
          desc={meta.desc}
          onClose={onClose}
        />
      }
      footer={actions}
    >
      {step === 1 && (
        <div className={s.form}>
          <TextField
            label="Электронная почта"
            type="email"
            inputMode="email"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      {step === 2 && (
        <div className={s.form}>
          <p className={s.hint}>Мы отправили код на {email.trim()}.</p>
          <CodeInput value={code} onChange={setCode} />
          <TextField
            label="Новый пароль"
            password
            placeholder="Не менее 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      {step === 3 && (
        <div className={s.form}>
          <p className={s.hint}>Пароль успешно изменён. Войдите с новым паролем.</p>
        </div>
      )}
    </FullSheet>
  );
}
