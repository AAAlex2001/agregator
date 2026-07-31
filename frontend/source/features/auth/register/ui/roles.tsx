import { CustomerIcon, ExpertIcon, DiplomaIcon } from "@/source/shared/ui/icons";
import { ROLE_ID_CUSTOMER, ROLE_ID_EXPERT, ROLE_ID_LICENSE_HOLDER } from "../model/types";
import type { Role } from "../model/types";

export const REGISTER_ROLES: Role[] = [
  {
    id: ROLE_ID_CUSTOMER,
    title: "Заказчик",
    icon: <CustomerIcon />,
    expandedTitle: "Найдите исполнителя из множества инженерных работ",
    description: [
      "Экспертиза промышленной безопасности",
      "Проектно-изыскательские работы",
      "Геолого-маркшейдерские работы",
      "Аудит СУПБ",
      "Дефектоскопия",
      "Лабораторные и опытно-промышленные испытания",
      "Кадастровые и судебные экспертизы",
      "Иные инженерные работы",
    ],
    photo: "/advantages__3.webp",
  },
  {
    id: ROLE_ID_EXPERT,
    title: "Исполнитель",
    subtitle:
      "Исполнитель экспертиз, проектов, обследований, дефектоскопии и других инженерных работ",
    icon: <ExpertIcon />,
    expandedTitle: "Находите проекты и укрепляйте репутацию, расширяя портфолио",
    description: [
      "Найдите свой проект и участвуйте в тендере",
      "Договаривайтесь напрямую",
      "Выполните заказ, получите отзыв и оценку",
    ],
    photo: "/advantages_1.webp",
  },
  {
    id: ROLE_ID_LICENSE_HOLDER,
    title: "Держатель разрешительных документов",
    icon: <DiplomaIcon size={24} />,
    expandedTitle:
      "Предоставляйте лицензию ЭПБ ОПО и другие разрешительные документы для работы",
    description: [
      "Подтвердите номер лицензии и объекты экспертизы",
      "Принимайте заявки на предоставление лицензии",
      "Договаривайтесь о цене напрямую",
    ],
    photo: "/license_holder.webp",
  },
];
