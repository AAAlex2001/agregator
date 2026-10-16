import { normalizeReferralCode } from "@/entities/referral";
import { createPrivateMetadata } from "../../seo/private-page";
import { RegistrationPageContent } from "../../ui/pages/registration-page-content";

export const metadata = createPrivateMetadata("Регистрация исполнителя");

/** Параметры приглашения из ссылки на регистрацию. */
interface RegistrationPageProps {
  searchParams: Promise<{ ref?: string | string[] }>;
}

/** Проверяет код приглашения, сохраняя обработку пустой и повторной ref-параметров. */
export default async function RegistrationPage({
  searchParams,
}: RegistrationPageProps) {
  const params = await searchParams;
  const rawCode = typeof params.ref === "string" ? params.ref : null;
  const referralCode = normalizeReferralCode(rawCode);
  const invalidInvitation = params.ref !== undefined && referralCode === null;

  return (
    <RegistrationPageContent
      referralCode={referralCode}
      invalidInvitation={invalidInvitation}
    />
  );
}
