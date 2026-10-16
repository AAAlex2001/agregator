"use client";

import { ReferralInvitation } from "@/widgets/referral-invitation";
import { useAuthentication } from "../../../providers/authentication";

/** Код приглашения из адреса и результат его проверки. */
interface RegistrationPageContentProps {
  referralCode: string | null;
  invalidInvitation: boolean;
}

/** Подключает приглашение к общему окну регистрации исполнителя. */
export function RegistrationPageContent({
  referralCode,
  invalidInvitation,
}: RegistrationPageContentProps) {
  const { openLogin, openRegistration } = useAuthentication();

  /** Открывает регистрацию с заранее выбранной ролью исполнителя. */
  function registerExpert() {
    openRegistration({ role: "EXPERT" });
  }

  return (
    <ReferralInvitation
      referralCode={referralCode}
      invalidInvitation={invalidInvitation}
      onOpenRegistration={registerExpert}
      onOpenLogin={openLogin}
    />
  );
}
