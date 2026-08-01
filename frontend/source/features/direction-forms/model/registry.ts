import type { ZodTypeAny } from "zod";
import type { DirectionKey, DirectionProfile } from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import { AuditCustomerForm } from "../ui/AuditCustomerForm";
import { AuditExpertForm } from "../ui/AuditExpertForm";
import { ExpertiseExpertForm } from "../ui/ExpertiseExpertForm";
import { auditCustomerSchema, auditExpertSchema, expertiseExpertSchema } from "./schemas";
import type { DirectionFormComponent } from "./types";

export interface DirectionRoleForm {
  description: string;
  Form: DirectionFormComponent;
  emptyValue: DirectionProfile;
  schema: ZodTypeAny;
}

export interface DirectionEntry {
  key: DirectionKey;
  title: string;
  forms: Partial<Record<UserRole, DirectionRoleForm>>;
}

export interface DirectionOption {
  key: DirectionKey;
  title: string;
  description: string;
}

const DIRECTIONS: DirectionEntry[] = [
  {
    key: "EXPERTISE",
    title: "Экспертиза промышленной безопасности",
    forms: {
      EXPERT: {
        description: "Области аттестации эксперта и отображение на карте России",
        Form: ExpertiseExpertForm,
        emptyValue: {
          certificates: [],
          show_on_map: true,
          map_fields: ["name", "area", "object", "category"],
        },
        schema: expertiseExpertSchema,
      },
    },
  },
  {
    key: "AUDIT_SUPB",
    title: "Аудит СУПБ",
    forms: {
      CUSTOMER: {
        description: "Независимая оценка системы управления промышленной безопасностью",
        Form: AuditCustomerForm,
        emptyValue: { position: "", opo_license_number: "" },
        schema: auditCustomerSchema,
      },
      EXPERT: {
        description: "Аудитор с независимой оценкой квалификации или инспекционный орган типа А",
        Form: AuditExpertForm,
        emptyValue: {
          participant_kind: "AUDITOR",
          industrial_safety_areas: [],
          expert_attestation_areas: [],
          audit_qualifications: [],
          full_name: "",
          short_name: "",
          inn: "",
          certificate_number: "",
          accreditation_areas: [],
        },
        schema: auditExpertSchema,
      },
    },
  },
];

const BY_KEY = new Map(DIRECTIONS.map((direction) => [direction.key, direction]));

export function getDirectionForm(key: DirectionKey, role: UserRole): DirectionRoleForm | null {
  return BY_KEY.get(key)?.forms[role] ?? null;
}

export function directionOptionsForRole(role: UserRole): DirectionOption[] {
  return DIRECTIONS.filter((direction) => direction.forms[role]).map((direction) => ({
    key: direction.key,
    title: direction.title,
    description: direction.forms[role]!.description,
  }));
}

export function emptyDirectionValue(key: DirectionKey, role: UserRole): DirectionProfile {
  return { ...(getDirectionForm(key, role)?.emptyValue ?? {}) };
}

export function validateDirection(
  key: DirectionKey,
  role: UserRole,
  value: DirectionProfile,
): string | null {
  const form = getDirectionForm(key, role);
  if (!form) return null;
  const result = form.schema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}
