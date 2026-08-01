import type { ZodTypeAny } from "zod";
import {
  fetchAuditCustomerProfile,
  fetchAuditExpertProfile,
  fetchCadastralProfile,
  fetchExpertiseProfile,
  fetchForensicProfile,
  saveAuditCustomerProfile,
  saveAuditExpertProfile,
  saveCadastralProfile,
  saveExpertiseProfile,
  saveForensicProfile,
  type AuditCustomerProfile,
  type AuditExpertProfile,
  type CadastralExpertProfile,
  type DirectionKey,
  type DirectionProfile,
  type ExpertiseExpertProfile,
  type ForensicExpertProfile,
} from "@/source/entities/direction";
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

export interface DirectionRoleForm<TProfile> {
  description: string;
  Form: DirectionFormComponent<TProfile>;
  emptyValue: TProfile;
  schema: ZodTypeAny;
  load: () => Promise<TProfile>;
  save: (profile: TProfile) => Promise<TProfile>;
  supportsDocuments?: boolean;
}

export type ErasedDirectionRoleForm = DirectionRoleForm<DirectionProfile>;

function form<TProfile extends DirectionProfile>(
  entry: DirectionRoleForm<TProfile>,
): ErasedDirectionRoleForm {
  return entry as unknown as ErasedDirectionRoleForm;
}

export interface DirectionEntry {
  key: DirectionKey;
  title: string;
  forms: Partial<Record<UserRole, ErasedDirectionRoleForm>>;
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
      EXPERT: form<ExpertiseExpertProfile>({
        description: "Удостоверения: область аттестации, объект экспертизы и категория",
        Form: ExpertiseExpertForm,
        emptyValue: { certificates: [] },
        schema: expertiseExpertSchema,
        load: fetchExpertiseProfile,
        save: saveExpertiseProfile,
      }),
    },
  },
  {
    key: "AUDIT_SUPB",
    title: "Аудит СУПБ",
    forms: {
      CUSTOMER: form<AuditCustomerProfile>({
        description: "Независимая оценка системы управления промышленной безопасностью",
        Form: AuditCustomerForm,
        emptyValue: { position: "", opo_license_number: "" },
        schema: auditCustomerSchema,
        load: fetchAuditCustomerProfile,
        save: saveAuditCustomerProfile,
      }),
      EXPERT: form<AuditExpertProfile>({
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
          documents: [],
        },
        schema: auditExpertSchema,
        load: fetchAuditExpertProfile,
        save: saveAuditExpertProfile,
        supportsDocuments: true,
      }),
    },
  },
  {
    key: "CADASTRAL",
    title: "Кадастровые работы",
    forms: {
      EXPERT: form<CadastralExpertProfile>({
        description: "Аттестат кадастрового инженера, оборудование и место работы",
        Form: CadastralExpertForm,
        emptyValue: {
          education: "",
          registry_joined_at: null,
          certificate_number: "",
          registry_number: "",
          equipment: "",
          workplace: "",
          documents: [],
        },
        schema: cadastralExpertSchema,
        load: fetchCadastralProfile,
        save: saveCadastralProfile,
        supportsDocuments: true,
      }),
    },
  },
  {
    key: "FORENSIC",
    title: "Судебная экспертиза",
    forms: {
      EXPERT: form<ForensicExpertProfile>({
        description: "Образование, опыт аналогичных экспертиз и кто выдаёт заключение",
        Form: ForensicExpertForm,
        emptyValue: {
          education: "",
          similar_cases_experience: "",
          workplace_kind: "INDIVIDUAL",
          workplace_name: "",
          documents: [],
        },
        schema: forensicExpertSchema,
        load: fetchForensicProfile,
        save: saveForensicProfile,
        supportsDocuments: true,
      }),
    },
  },
];

const BY_KEY = new Map(DIRECTIONS.map((direction) => [direction.key, direction]));

export function getDirectionForm(
  key: DirectionKey,
  role: UserRole,
): ErasedDirectionRoleForm | null {
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
  return { ...(getDirectionForm(key, role)?.emptyValue ?? {}) } as DirectionProfile;
}

export function validateDirection(
  key: DirectionKey,
  role: UserRole,
  value: DirectionProfile,
): string | null {
  const entry = getDirectionForm(key, role);
  if (!entry) return null;
  const result = entry.schema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}
