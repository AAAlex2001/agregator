import { useState, type ComponentType } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { type Role } from "@/shared/services/api";
import { tapHaptic } from "@/shared/services/telegram";
import { useAuthForm } from "@/features/session";
import { RegisterSheet } from "@/features/register";
import { ForgotSheet } from "@/features/forgot-password";
import { Button, TextField, BottomSheet, Logo } from "@/shared/ui";
import { MailIcon, LockIcon, ChevronRightIcon } from "@/shared/ui/icons/interface";
import { CustomerRoleIcon, ExpertRoleIcon, LicenseRoleIcon } from "@/shared/ui/icons/roles";
import s from "./style.module.scss";

const LOGIN_ROLE_META: Record<Role, { label: string; Icon: ComponentType<{ size?: number }> }> = {
  CUSTOMER: { label: "Вы — заказчик", Icon: CustomerRoleIcon },
  EXPERT: { label: "Вы — исполнитель", Icon: ExpertRoleIcon },
  LICENSE_HOLDER: { label: "Вы — держатель разрешительных документов", Icon: LicenseRoleIcon },
};

const REG_ROLES: {
  role: Role;
  label: string;
  subtitle?: string;
  desc: string;
  bullets?: string[];
  Icon: ComponentType<{ size?: number }>;
}[] = [
  {
    role: "EXPERT",
    label: "Исполнитель",
    subtitle: "исполнитель экспертиз, проектов, обследований, дефектоскопии и других инженерных работ",
    desc: "Находите проекты и укрепляйте репутацию, расширяя портфолио",
    bullets: [
      "Найдите свой проект и участвуйте в тендере",
      "Договаривайтесь напрямую",
      "Выполните заказ, получите отзыв и оценку",
    ],
    Icon: ExpertRoleIcon,
  },
  {
    role: "CUSTOMER",
    label: "Заказчик",
    desc: "Найдите исполнителя из множества инженерных работ",
    bullets: [
      "Экспертиза промышленной безопасности",
      "Проектно-изыскательские работы",
      "Геолого-маркшейдерские работы",
      "Аудит СУПБ",
      "Дефектоскопия",
      "Лабораторные и опытно-промышленные испытания",
      "Кадастровые и судебные экспертизы",
      "Иные инженерные работы",
    ],
    Icon: CustomerRoleIcon,
  },
  {
    role: "LICENSE_HOLDER",
    label: "Держатель разрешительных документов",
    desc: "Предоставляйте лицензию ЭПБ ОПО и другие разрешительные документы для работы",
    bullets: [
      "Подтвердите номер лицензии и объекты экспертизы",
      "Принимайте заявки на предоставление лицензии",
      "Договаривайтесь о цене напрямую",
    ],
    Icon: LicenseRoleIcon,
  },
];

export function AuthPage() {
  const { state, dispatch, submit } = useAuthForm();
  const [mode, setMode] = useState<"welcome" | "login" | "register">("welcome");
  const [regRole, setRegRole] = useState<Role | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [activeRoleIndex, setActiveRoleIndex] = useState(1);
  const [roleSliderRef, roleSlider] = useKeenSlider<HTMLDivElement>({
    initial: 1,
    mode: "snap",
    slides: { origin: "center", perView: 1.08, spacing: 12 },
    slideChanged(slider) {
      setActiveRoleIndex(slider.track.details.rel);
      tapHaptic();
    },
  });

  const pickRegRole = (role: Role) => {
    tapHaptic();
    setRegRole(role);
  };

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <Logo size={62} className={s.logo} />
        <h1 className={s.heroTitle}>Добро пожаловать!</h1>
        <p className={s.heroSub}>{mode === "login" ? "Войдите в свой аккаунт" : "Войдите или создайте аккаунт"}</p>
      </div>

      <div className={s.card}>
        {mode === "welcome" && (
          <div className={s.actions}>
            <Button
              onClick={() => {
                tapHaptic();
                setMode("login");
              }}
            >
              Войти
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                tapHaptic();
                setMode("register");
              }}
            >
              Регистрация
            </Button>
          </div>
        )}

        {mode === "login" && (
          <form
            className={s.form}
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <TextField
              icon={<MailIcon width={20} height={20} />}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Электронная почта"
              value={state.email}
              onChange={(e) => dispatch({ type: "email", value: e.target.value })}
            />
            <TextField
              icon={<LockIcon width={20} height={20} />}
              password
              autoComplete="current-password"
              placeholder="Пароль"
              value={state.password}
              onChange={(e) => dispatch({ type: "password", value: e.target.value })}
            />
            <Button type="submit" loading={state.loading}>
              Войти
            </Button>
            <button
              type="button"
              className={s.forgot}
              onClick={() => {
                tapHaptic();
                setForgotOpen(true);
              }}
            >
              Забыли пароль?
            </button>
            <button type="button" className={s.back} onClick={() => setMode("welcome")}>
              Назад
            </button>
          </form>
        )}

        {mode === "register" && (
          <div className={s.regRoles}>
            <p className={s.regRolesHint}>Выберите роль — листайте карточки</p>
            <div ref={roleSliderRef} className={`keen-slider ${s.regRoleSlider}`}>
              {REG_ROLES.map((r) => (
                <article key={r.role} className={`keen-slider__slide ${s.regRoleCard}`}>
                  <div className={s.regRoleHeader}>
                    <span className={s.roleIcon}>
                      <r.Icon size={26} />
                    </span>
                    <h2 className={s.regRoleLabel}>{r.label}</h2>
                  </div>
                  {r.subtitle ? <p className={s.regRoleSubtitle}>{r.subtitle}</p> : null}
                  <p className={s.regRoleDesc}>{r.desc}</p>
                  {r.bullets ? (
                    <ul className={s.regRoleBullets}>
                      {r.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  <button type="button" className={s.regRoleSelect} onClick={() => pickRegRole(r.role)}>
                    Выбрать роль
                    <ChevronRightIcon width={18} height={18} />
                  </button>
                </article>
              ))}
            </div>
            <div className={s.regRoleDots} aria-label="Навигация по ролям">
              {REG_ROLES.map((r, index) => (
                <button
                  key={r.role}
                  type="button"
                  className={`${s.regRoleDot} ${index === activeRoleIndex ? s.regRoleDotActive : ""}`}
                  aria-label={`Показать роль «${r.label}»`}
                  onClick={() => roleSlider.current?.moveToIdx(index)}
                />
              ))}
            </div>
            <button type="button" className={s.back} onClick={() => setMode("welcome")}>
              Назад
            </button>
          </div>
        )}
      </div>

      <BottomSheet open={state.rolesOpen} title="Под какой ролью войти?" onClose={() => dispatch({ type: "closeRoles" })}>
        <p className={s.roleHint}>На эти данные зарегистрировано несколько аккаунтов</p>
        <div className={s.roleList}>
          {state.roles.map((r) => {
            const { label, Icon } = LOGIN_ROLE_META[r];
            return (
              <button
                key={r}
                className={s.roleBtn}
                onClick={() => {
                  tapHaptic();
                  dispatch({ type: "closeRoles" });
                  void submit(r);
                }}
              >
                <span className={s.roleIcon}>
                  <Icon size={26} />
                </span>
                <span className={s.roleLabel}>{label}</span>
              </button>
            );
          })}
          <Button variant="outline" onClick={() => dispatch({ type: "closeRoles" })}>
            Отмена
          </Button>
        </div>
      </BottomSheet>

      <RegisterSheet role={regRole} onClose={() => setRegRole(null)} />
      <ForgotSheet open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}
