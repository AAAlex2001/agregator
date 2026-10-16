/** Код приглашения и открытие регистрации исполнителя из приложения. */
export interface ReferralInvitationOptions {
  referralCode: string | null;
  onOpenRegistration: () => void;
}
