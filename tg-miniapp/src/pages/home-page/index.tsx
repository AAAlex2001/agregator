import { useState, type ComponentType, type SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { useSession } from "@/entites/session";
import { tapHaptic } from "@/shared/services/telegram";
import { Screen } from "@/widgets/app-shell";
import { Card, BottomSheet, Logo } from "@/shared/ui";
import {
  BoltIcon,
  ChevronRightIcon,
  CreditIcon,
  DocIcon,
  PlusIcon,
  ToolIcon,
  UserIcon,
} from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Action {
  key: string;
  title: string;
  sub: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  tint: string;
  to?: string;
}

const CUSTOMER_ACTIONS: Action[] = [
  { key: "create", title: "Создать заказ", sub: "Разместить тендер на экспертизу", Icon: PlusIcon, tint: s.tintAccent },
  { key: "orders", title: "Мои заказы", sub: "Отклики и статусы по заказам", Icon: DocIcon, tint: s.tintBlue },
];

const EXPERT_ACTIONS: Action[] = [
  { key: "feed", title: "Заказы под вас", sub: "Новые тендеры по вашей аттестации", Icon: BoltIcon, tint: s.tintAccent },
  { key: "responses", title: "Мои отклики", sub: "Статусы по отправленным заявкам", Icon: DocIcon, tint: s.tintBlue },
  { key: "tools", title: "Инструменты", sub: "Анализ риска и остаточный ресурс", Icon: ToolIcon, tint: s.tintGreen },
  { key: "tariffs", title: "Тарифы", sub: "Подписка эксперта", Icon: CreditIcon, tint: s.tintAccent, to: "/pricing" },
];

function roleLabel(role: string | null): string {
  if (role === "EXPERT") return "эксперт";
  if (role === "LICENSE_HOLDER") return "держатель лицензии";
  return "заказчик";
}

export function HomePage() {
  const { role } = useSession();
  const navigate = useNavigate();
  const [soonOpen, setSoonOpen] = useState(false);
  const [soonTitle, setSoonTitle] = useState("");

  const actions = role === "EXPERT" ? EXPERT_ACTIONS : CUSTOMER_ACTIONS;

  const handle = (a: Action) => {
    if (a.to) {
      navigate(a.to);
      return;
    }
    setSoonTitle(a.title);
    setSoonOpen(true);
  };

  return (
    <Screen
      title={
        <>
          <Logo size={28} className={s.logoMark} />
          Ресурс-Плюс
        </>
      }
      right={
        <button
          className={s.iconBtn}
          aria-label="Профиль"
          onClick={() => {
            tapHaptic();
            navigate("/profile");
          }}
        >
          <UserIcon width={22} height={22} />
        </button>
      }
    >
      <Card className={s.hero}>
        <p className={s.hi}>Здравствуйте 👋</p>
        <p className={s.roleLine}>
          Вы вошли как <b>{roleLabel(role)}</b>
        </p>
      </Card>

      <p className={s.sectionTitle}>Действия</p>
      <div className={s.actions}>
        {actions.map((a) => (
          <Card key={a.key} className={s.actionCard} onClick={() => handle(a)}>
            <span className={cn(s.actionIcon, a.tint)}>
              <a.Icon width={24} height={24} />
            </span>
            <span className={s.actionText}>
              <span className={s.actionTitle}>{a.title}</span>
              <span className={s.actionSub}>{a.sub}</span>
            </span>
            <ChevronRightIcon className={s.chev} width={20} height={20} />
          </Card>
        ))}
      </div>

      <BottomSheet open={soonOpen} title={soonTitle} onClose={() => setSoonOpen(false)}>
        <p className={s.soonText}>Раздел скоро появится — делаем его следующим шагом.</p>
      </BottomSheet>
    </Screen>
  );
}
