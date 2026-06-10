import type { EmailPreferences } from "@/source/entities/user";

export type { UpdateEmailPreferencesPayload } from "@/source/entities/user";

export type NotificationPreferenceKey = keyof EmailPreferences;

export interface NotificationPreferenceDescriptor {
  key: NotificationPreferenceKey;
  label: string;
  description: string;
  roles: ReadonlyArray<"CUSTOMER" | "EXPERT">;
}
