import type { EmailPreferences } from "@/source/entities/user";

export type NotificationPreferenceKey = keyof EmailPreferences;

export type UpdateEmailPreferencesPayload = Partial<EmailPreferences>;

export interface NotificationPreferenceDescriptor {
  key: NotificationPreferenceKey;
  label: string;
  description: string;
  roles: ReadonlyArray<"CUSTOMER" | "EXPERT">;
}
