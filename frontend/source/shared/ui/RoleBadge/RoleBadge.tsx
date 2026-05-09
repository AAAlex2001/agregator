import { CustomerIcon, DiplomaIcon, ExpertIcon } from "@/source/shared/ui/icons";
import s from "./RoleBadge.module.scss";

type Role = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

interface Props {
  role: Role | string | null | undefined;
  className?: string;
}

const PRESETS: Record<Role, { label: string; tone: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  CUSTOMER: { label: "Заказчик", tone: "blue", Icon: CustomerIcon },
  EXPERT: { label: "Эксперт", tone: "orange", Icon: ExpertIcon },
  LICENSE_HOLDER: { label: "Держатель лицензии", tone: "green", Icon: DiplomaIcon },
};

function getPreset(role: Props["role"]) {
  if (role === "CUSTOMER" || role === "EXPERT" || role === "LICENSE_HOLDER") {
    return PRESETS[role];
  }
  return null;
}

export function RoleBadge({ role, className }: Props) {
  const preset = getPreset(role);
  if (!preset) return null;
  const { label, tone, Icon } = preset;

  return (
    <span className={`${s.badge} ${s[tone]} ${className ?? ""}`}>
      <Icon size={20} className={s.icon} />
      <span className={s.label}>{label}</span>
    </span>
  );
}
