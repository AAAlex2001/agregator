import { toUserRole } from "@/entities/user";
import type { UserRole } from "@/entities/user";
import { Tabs } from "@/shared/ui/tabs";

/** Роли регистрации в исходном порядке вкладок. */
const ROLE_TABS = [
  { id: "CUSTOMER", label: "Заказчик" },
  { id: "EXPERT", label: "Исполнитель" },
  { id: "LICENSE_HOLDER", label: "Держатель разрешительных документов" },
];

/** Текущая роль и действие выбора другой формы регистрации. */
interface RoleSelectProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

/** Переключает форму между заказчиком, исполнителем и держателем документов. */
export function RoleSelect({ value, onChange, disabled }: RoleSelectProps) {
  return (
    <Tabs
      tabs={ROLE_TABS}
      activeTab={value}
      disabled={disabled}
      onTabChange={(id) => {
        const role = toUserRole(id);

        if (role) {
          onChange(role);
        }
      }}
    />
  );
}

