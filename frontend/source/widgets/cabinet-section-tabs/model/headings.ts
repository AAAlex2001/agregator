interface SectionHeading {
  title: string;
  subtitle: string;
}

export const ORDER_PAGE_HEADINGS: Record<string, SectionHeading> = {
  "/expert/orders": {
    title: "Все заказы",
    subtitle: "Актуальные заказы по направлениям",
  },
  "/customer/orders": {
    title: "Все заказы",
    subtitle: "Актуальные заказы по направлениям",
  },
  "/responses": {
    title: "Взаимодействие по заказам",
    subtitle: "Все отклики в одном месте — просмотр, управление и контроль статусов",
  },
  "/archive": {
    title: "Архив заказов",
    subtitle: "Здесь находятся завершённые заказы",
  },
  "/customer/orders/new": {
    title: "Создание заказа",
    subtitle: "Укажите задачу, требования к исполнителю и сроки выполнения",
  },
  "/customer/reports": {
    title: "Мои отчёты",
    subtitle: "Отчёты по завершённым тендерам: участники и выбранный исполнитель",
  },
};
