import type { Metadata } from "next";
import { normalizeReferralCode } from "@/source/entities/referral";
import { ReferralInvitation } from "@/source/widgets/referral-invitation";

export const metadata: Metadata = {
  title: "Регистрация исполнителя",
  robots: { index: false, follow: false },
};

interface RegistrationPageProps {
  searchParams: Promise<{ ref?: string | string[] }>;
}

export default async function RegistrationPage({ searchParams }: RegistrationPageProps) {
  const params = await searchParams;
  const rawCode = typeof params.ref === "string" ? params.ref : null;
  const referralCode = normalizeReferralCode(rawCode) ?? null;

  return (
    <ReferralInvitation
      referralCode={referralCode}
      invalidInvitation={params.ref !== undefined && referralCode === null}
    />
  );
}
