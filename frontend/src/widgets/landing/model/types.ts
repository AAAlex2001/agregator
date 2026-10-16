import type { ReactNode } from "react";
import type { ArticleListItem } from "@/entities/article";
import type { DirectionCode } from "@/entities/direction";
import type { UserRole } from "@/entities/user";

/** Данные страницы направления и действия, подключённые приложением. */
export interface ServiceLandingProps {
  navigation: ReactNode;
  search: ReactNode;
  news: ArticleListItem[];
  onRegister: (role: UserRole, direction?: DirectionCode) => void;
  header?: ReactNode;
  footer?: ReactNode;
  articleBasePath?: string;
}

/** Короткий шаг знакомства с направлением на первом экране. */
export interface ServiceBullet {
  title: string;
  text: string;
}

/** Описание роли и предустановка регистрации на странице направления. */
export interface ServiceRole {
  id: string;
  role: UserRole;
  direction?: DirectionCode;
  subtitle: string;
  description: string;
  fields: string[];
}

/** Шаг работы или преимущество платформы для одной из ролей. */
export interface ServiceStep {
  id: number;
  icon: string;
  title: string;
  description: string;
  sub_description?: string;
}

/** Шаги работы или преимущества для трёх ролей страницы направления. */
export interface ServiceRoleSteps {
  client: ServiceStep[];
  expert: ServiceStep[];
  license_holder: ServiceStep[];
}

/** Роль в объяснении порядка работы и преимуществ платформы. */
export type ServiceStepRole = "client" | "expert" | "license_holder";

/** Описание пользы направления для заказчика или исполнителя. */
export interface ServiceAudienceBlock {
  audience: string;
  title: string;
  items: string[];
  image: string;
  imageAlt: string;
  link?: {
    label: string;
    href: string;
  };
}

/** Пункт каталога работ или аудиторий с пояснением и иллюстрацией. */
export interface ServiceShowcaseItem {
  title: string;
  text: string;
  image: string;
}

/** Роль, для которой показаны условия использования платформы. */
export type LandingPricingRole = "customer" | "expert" | "license_holder";

/** Направление в публичной витрине услуг с описанием и ссылкой на лендинг. */
export interface LandingDirection {
  id: number;
  slug: string;
  title: string;
  text: string;
  image: string;
  href?: string;
  direction?: string;
}

/** Направление в навигации лендинга и пояснение к карте специалистов. */
export interface LandingNavigationItem {
  direction: DirectionCode | null;
  title: string;
  text: string;
  href?: string;
}

/** Текущая страница, переходы и карта, подключённые приложением. */
export interface LandingNavigationProps {
  activeHref?: string;
  onNavigate: (href: string) => void;
  renderMap: (direction: DirectionCode | null) => ReactNode;
}

/** Ссылка на описание конкретного вида судебного исследования. */
export interface ForensicCatalogItem {
  label: string;
  href: string;
}

/** Группа судебных исследований в одной вкладке каталога. */
export interface ForensicCatalogGroup {
  id: string;
  tab: string;
  title: string;
  href: string;
  description: string;
  items: ForensicCatalogItem[];
}
