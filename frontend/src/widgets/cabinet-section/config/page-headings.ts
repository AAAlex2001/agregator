/** Заголовок страницы заказов с кратким пояснением её назначения. */
interface PageHeading {
  pathname: string;
  title: string;
  subtitle: string;
}

/** Тексты заголовков, которые кабинет размещает над вкладками. */
const PAGE_HEADINGS: PageHeading[] = [
  {
    pathname: "/expert/orders",
    title: "Все заказы",
    subtitle: "Актуальные заказы по направлениям",
  },
  {
    pathname: "/customer/orders",
    title: "Все заказы",
    subtitle: "Актуальные заказы по направлениям",
  },
  {
    pathname: "/responses",
    title: "Взаимодействие по заказам",
    subtitle: "Все отклики в одном месте — просмотр, управление и контроль статусов",
  },
  {
    pathname: "/archive",
    title: "Архив заказов",
    subtitle: "Здесь находятся завершённые заказы",
  },
  {
    pathname: "/customer/orders/new",
    title: "Создание заказа",
    subtitle: "Укажите задачу, требования к исполнителю и сроки выполнения",
  },
  {
    pathname: "/customer/reports",
    title: "Мои отчёты",
    subtitle: "Отчёты по завершённым тендерам: участники и выбранный исполнитель",
  },
];

/** Находит заголовок только для страницы, указанной в настройках раздела. */
export function getPageHeading(pathname: string): PageHeading | undefined {
  return PAGE_HEADINGS.find((heading) => heading.pathname === pathname);
}
