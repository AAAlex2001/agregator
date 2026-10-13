"use client";

import type { UserProfile } from "@/source/entities/user";
import { FormSection } from "@/source/shared/ui";
import { Switch } from "@/source/shared/ui/Switch";
import { useEmailEvents } from "../model/useEmailEvents";
import s from "./EmailEventsSection.module.scss";

interface EmailEventsSectionProps {
  profile: UserProfile;
}

/** Блок «События по заявкам»: переключатели писем, каждый сохраняется сразу. */
export function EmailEventsSection({ profile }: EmailEventsSectionProps) {
  const { events, savingKey, toggle } = useEmailEvents(profile);

  return (
    <FormSection
      title="События по заявкам"
      hint="Отклики, изменения, сообщения и другие письма по вашим заявкам."
      collapsible
    >
      <ul className={s.list}>
        {events.map((event) => (
          <li key={event.key}>
            <Switch
              id={`pref-${event.key}`}
              checked={profile.email_preferences[event.key]}
              onChange={(enabled) => toggle(event.key, enabled)}
              label={event.label}
              description={event.description}
              disabled={savingKey === event.key}
            />
          </li>
        ))}
      </ul>
    </FormSection>
  );
}
