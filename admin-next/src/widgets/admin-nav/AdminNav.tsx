"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/entities/article";

interface NavItem {
  href: string;
  label: string;
  match?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    title: "Контент",
    items: [
      { href: "/", label: "Статьи · новости и блог", match: "/edit" },
      { href: "/new", label: "Новая статья" },
    ],
  },
  {
    title: "Ростехнадзор отвечает",
    items: [
      { href: "/rtn", label: "Разъяснения", match: "/rtn/edit" },
      { href: "/rtn/new", label: "Новое разъяснение" },
      { href: "/rtn/questions", label: "Вопросы посетителей" },
      { href: "/rtn/change-reports", label: "Сообщения об изменениях" },
    ],
  },
  {
    title: "Продажи",
    items: [
      { href: "/leads", label: "Заявки с сайта" },
      { href: "/contact-deals", label: "Покупка контактов", match: "/contact-deals" },
    ],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.href) return true;
  if (item.match && pathname.startsWith(item.match)) return true;
  return false;
}

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login") return null;

  const onLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">Ресурс-Плюс</div>

      {GROUPS.map((group) => (
        <div key={group.title} className="sidebar-group">
          <span className="sidebar-title">{group.title}</span>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(pathname, item) ? "sidebar-link on" : "sidebar-link"}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <button className="sidebar-logout" onClick={onLogout}>
        Выйти
      </button>
    </nav>
  );
}
