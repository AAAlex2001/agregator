import type { ZodTypeAny } from "zod";
import type { DirectionKey, DirectionProfile } from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import { AuditCustomerForm } from "../ui/AuditCustomerForm";
import { AuditExpertForm } from "../ui/AuditExpertForm";
import { CadastralExpertForm } from "../ui/CadastralExpertForm";
import { ExpertiseExpertForm } from "../ui/ExpertiseExpertForm";
import { ForensicExpertForm } from "../ui/ForensicExpertForm";
import {
  auditCustomerSchema,
  auditExpertSchema,
  cadastralExpertSchema,
  expertiseExpertSchema,
  forensicExpertSchema,
} from "./schemas";
import type { DirectionFormComponent } from "./types";

export interface DirectionRoleForm {
  description: string;
  Form: DirectionFormComponent;
  emptyValue: DirectionProfile;
  schema: ZodTypeAny;
  supportsDocuments?: boolean;
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
        description: "Удостоверения: область аттестации, объект экспертизы и категория",
        Form: ExpertiseExpertForm,
        emptyValue: { certificates: [] },
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
        supportsDocuments: true,
      },
    },
  },
  {
    key: "CADASTRAL",
    title: "Кадастровые работы",
    forms: {
      EXPERT: {
        description: "Аттестат кадастрового инженера, оборудование и место работы",
        Form: CadastralExpertForm,
        emptyValue: {
          education: "",
          registry_joined_at: null,
          certificate_number: "",
          registry_number: "",
          equipment: "",
          workplace: "",
        },
        schema: cadastralExpertSchema,
        supportsDocuments: true,
      },
    },
  },
  {
    key: "FORENSIC",
    title: "Судебная экспертиза",
    forms: {
      EXPERT: {
        description: "Образование, опыт аналогичных экспертиз и кто выдаёт заключение",
        Form: ForensicExpertForm,
        emptyValue: {
          education: "",
          similar_cases_experience: "",
          workplace_kind: "INDIVIDUAL",
          workplace_name: "",
        },
        schema: forensicExpertSchema,
        supportsDocuments: true,
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
